/**
 * Data Retention Deletion Service
 * 
 * This service handles the actual deletion and anonymization of data
 * based on retention policies. It provides both individual and batch
 * processing capabilities with comprehensive error handling and logging.
 */

import { PrismaClient } from '@prisma/client';
import {
    DataType,
    getRetentionPolicy,
    isEligibleForDeletion,
    getEligibleRecords,
    type RetentionOperationResult,
    type RetentionOperationContext,
    type RetentionEligibleRecord
} from '../data-retention';
import {
    getTableName,
    getFieldMappings,
    RETENTION_QUERIES
} from './data-retention-schema';
import {
    logRetentionOperation,
    createRetentionResult,
    validateRecordForRetention
} from './data-retention-utils';
import {
    DATA_RETENTION_CONFIG,
    isDataRetentionEnabled,
    isDryRunMode,
    getBatchSize,
    getMaxRecordsPerOperation
} from '../../config/data-retention.config';

/**
 * Deletion operation types
 */
export type DeletionOperation = 'soft_delete' | 'hard_delete' | 'anonymize';

/**
 * Deletion service configuration
 */
export interface DeletionServiceConfig {
    dryRun?: boolean;
    batchSize?: number;
    maxRecords?: number;
    continueOnError?: boolean;
    maxRetries?: number;
    retryDelayMs?: number;
}

/**
 * Individual record deletion result
 */
export interface RecordDeletionResult {
    recordId: string;
    success: boolean;
    operation: DeletionOperation;
    error?: string;
    anonymized?: boolean;
    deletedAt?: Date;
}

/**
 * Batch deletion result
 */
export interface BatchDeletionResult {
    dataType: DataType;
    totalProcessed: number;
    successful: number;
    failed: number;
    anonymized: number;
    softDeleted: number;
    hardDeleted: number;
    errors: string[];
    processingTimeMs: number;
    dryRun: boolean;
}

/**
 * Data Retention Deletion Service
 */
export class DataRetentionDeletionService {
    private prisma: PrismaClient;
    private config: DeletionServiceConfig;

    constructor(prisma: PrismaClient, config: DeletionServiceConfig = {}) {
        this.prisma = prisma;
        this.config = {
            dryRun: config.dryRun ?? isDryRunMode(),
            batchSize: config.batchSize ?? getBatchSize(),
            maxRecords: config.maxRecords ?? getMaxRecordsPerOperation(),
            continueOnError: config.continueOnError ?? DATA_RETENTION_CONFIG.errorHandling.continueOnError,
            maxRetries: config.maxRetries ?? DATA_RETENTION_CONFIG.errorHandling.maxRetries,
            retryDelayMs: config.retryDelayMs ?? DATA_RETENTION_CONFIG.errorHandling.retryDelayMs,
        };
    }

    /**
     * Process data retention for a specific data type
     */
    async processDataRetention(
        dataType: DataType,
        adminUserId?: string
    ): Promise<BatchDeletionResult> {
        const startTime = Date.now();
        const context: RetentionOperationContext = {
            dataType,
            operation: 'delete',
            dryRun: this.config.dryRun!,
            batchSize: this.config.batchSize!,
            adminUserId,
        };

        try {
            // Check if data retention is enabled
            if (!isDataRetentionEnabled()) {
                throw new Error('Data retention system is disabled');
            }

            // Get eligible records
            const eligibleRecords = await getEligibleRecords(
                dataType,
                this.prisma,
                this.config.maxRecords!
            );

            if (eligibleRecords.length === 0) {
                return this.createBatchResult(dataType, 0, 0, 0, 0, 0, 0, [], startTime);
            }

            // Process records in batches
            const results = await this.processBatch(eligibleRecords, dataType, context);

            // Log the operation
            const operationResult = createRetentionResult(
                results.failed === 0,
                results.totalProcessed,
                results.softDeleted + results.hardDeleted,
                results.anonymized,
                results.errors
            );

            logRetentionOperation(context, operationResult);

            return results;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Error processing data retention for ${dataType}:`, error);

            const operationResult = createRetentionResult(false, 0, 0, 0, [errorMessage]);
            logRetentionOperation(context, operationResult);

            return this.createBatchResult(
                dataType,
                0,
                0,
                0,
                0,
                0,
                0,
                [errorMessage],
                startTime
            );
        }
    }

    /**
     * Process a batch of records
     */
    private async processBatch(
        records: RetentionEligibleRecord[],
        dataType: DataType,
        context: RetentionOperationContext
    ): Promise<BatchDeletionResult> {
        const startTime = Date.now();
        const policy = getRetentionPolicy(dataType);
        const tableName = getTableName(dataType);

        let successful = 0;
        let failed = 0;
        let anonymized = 0;
        let softDeleted = 0;
        let hardDeleted = 0;
        const errors: string[] = [];

        // Process records in smaller batches
        const batchSize = this.config.batchSize!;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);

            for (const record of batch) {
                try {
                    // Validate record
                    const validation = validateRecordForRetention(record, dataType);
                    if (!validation.valid) {
                        errors.push(`Validation failed for record ${record.id}: ${validation.errors.join(', ')}`);
                        failed++;
                        continue;
                    }

                    // Determine operation type
                    const operation = this.determineOperation(dataType, policy);

                    // Execute operation
                    const result = await this.executeDeletionOperation(
                        record,
                        dataType,
                        operation,
                        tableName
                    );

                    if (result.success) {
                        successful++;
                        if (result.operation === 'anonymize') {
                            anonymized++;
                        } else if (result.operation === 'soft_delete') {
                            softDeleted++;
                        } else if (result.operation === 'hard_delete') {
                            hardDeleted++;
                        }
                    } else {
                        failed++;
                        if (result.error) {
                            errors.push(`Record ${record.id}: ${result.error}`);
                        }
                    }

                } catch (error) {
                    failed++;
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    errors.push(`Record ${record.id}: ${errorMessage}`);

                    if (!this.config.continueOnError) {
                        throw error;
                    }
                }
            }
        }

        return this.createBatchResult(
            dataType,
            records.length,
            successful,
            failed,
            anonymized,
            softDeleted,
            hardDeleted,
            errors,
            startTime
        );
    }

    /**
     * Determine the appropriate operation for a data type
     */
    private determineOperation(
        dataType: DataType,
        policy: { allowAnonymization?: boolean; requiresManualReview?: boolean }
    ): DeletionOperation {
        // Check if anonymization is allowed and preferred
        if (policy.allowAnonymization) {
            return 'anonymize';
        }

        // Check if manual review is required
        if (policy.requiresManualReview) {
            return 'soft_delete'; // Soft delete for manual review
        }

        // Default to soft delete for safety
        return 'soft_delete';
    }

    /**
     * Execute a deletion operation on a single record
     */
    private async executeDeletionOperation(
        record: RetentionEligibleRecord,
        dataType: DataType,
        operation: DeletionOperation,
        tableName: string
    ): Promise<RecordDeletionResult> {
        try {
            if (this.config.dryRun) {
                return {
                    recordId: record.id,
                    success: true,
                    operation,
                    deletedAt: new Date(),
                };
            }

            switch (operation) {
                case 'anonymize':
                    return await this.anonymizeRecord(record, dataType, tableName);

                case 'soft_delete':
                    return await this.softDeleteRecord(record, dataType, tableName);

                case 'hard_delete':
                    return await this.hardDeleteRecord(record, dataType, tableName);

                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }

        } catch (error) {
            return {
                recordId: record.id,
                success: false,
                operation,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Anonymize a record
     */
    private async anonymizeRecord(
        record: RetentionEligibleRecord,
        dataType: DataType,
        tableName: string
    ): Promise<RecordDeletionResult> {
        const fields = getFieldMappings(dataType);

        try {
            // Get anonymization queries
            const queries = this.getAnonymizationQueries(dataType, tableName, record.id);

            // Execute anonymization queries
            for (const query of queries) {
                await this.prisma.$executeRawUnsafe(query);
            }

            return {
                recordId: record.id,
                success: true,
                operation: 'anonymize',
                anonymized: true,
                deletedAt: new Date(),
            };

        } catch (error) {
            return {
                recordId: record.id,
                success: false,
                operation: 'anonymize',
                error: error instanceof Error ? error.message : 'Anonymization failed',
            };
        }
    }

    /**
     * Soft delete a record
     */
    private async softDeleteRecord(
        record: RetentionEligibleRecord,
        dataType: DataType,
        tableName: string
    ): Promise<RecordDeletionResult> {
        const fields = getFieldMappings(dataType);

        try {
            // Use raw SQL to avoid dynamic delegate casting
            await this.prisma.$executeRawUnsafe(`
                UPDATE "${tableName}"
                SET 
                  "${String(fields.isDeleted)}" = true,
                  "${String(fields.deletedAt)}" = NOW(),
                  "deletedBy" = 'data-retention-system'
                WHERE id = '${record.id}'
            `);

            return {
                recordId: record.id,
                success: true,
                operation: 'soft_delete',
                deletedAt: new Date(),
            };

        } catch (error) {
            return {
                recordId: record.id,
                success: false,
                operation: 'soft_delete',
                error: error instanceof Error ? error.message : 'Soft delete failed',
            };
        }
    }

    /**
     * Hard delete a record
     */
    private async hardDeleteRecord(
        record: RetentionEligibleRecord,
        dataType: DataType,
        tableName: string
    ): Promise<RecordDeletionResult> {
        try {
            // Use raw SQL to avoid dynamic delegate casting
            await this.prisma.$executeRawUnsafe(`
                DELETE FROM "${tableName}"
                WHERE id = '${record.id}'
            `);

            return {
                recordId: record.id,
                success: true,
                operation: 'hard_delete',
                deletedAt: new Date(),
            };

        } catch (error) {
            return {
                recordId: record.id,
                success: false,
                operation: 'hard_delete',
                error: error instanceof Error ? error.message : 'Hard delete failed',
            };
        }
    }

    /**
     * Get anonymization queries for a data type
     */
    private getAnonymizationQueries(dataType: DataType, tableName: string, recordId: string): string[] {
        const queries: string[] = [];

        switch (dataType) {
            case DataType.USER_PROFILE:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "fullName" = 'ANONYMIZED',
            "email" = CONCAT('anonymized_', id, '@deleted.local'),
            "username" = CONCAT('user_', SUBSTRING(id, 1, 8)),
            "avatarUrl" = NULL,
            "preferences" = '{}',
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            case DataType.CV_DATA:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "fileName" = 'anonymized_cv.pdf',
            "extractedText" = 'ANONYMIZED',
            "technicalSkills" = '[]',
            "workExperience" = '{}',
            "education" = '{}',
            "certifications" = '{}',
            "languages" = '[]',
            "firstName" = 'ANONYMIZED',
            "lastName" = 'ANONYMIZED',
            "fullName" = 'ANONYMIZED',
            "email" = CONCAT('anonymized_', id, '@deleted.local'),
            "phone" = NULL,
            "linkedinUrl" = NULL,
            "websiteUrl" = NULL,
            "githubUrl" = NULL,
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            case DataType.JOB_DATA:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "content" = 'ANONYMIZED',
            "title" = 'ANONYMIZED',
            "companyName" = 'ANONYMIZED',
            "companyDescription" = 'ANONYMIZED',
            "companyLogoUrl" = NULL,
            "recruiterInfo" = '{}',
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            case DataType.CONTACT_MESSAGES:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "name" = 'ANONYMIZED',
            "email" = 'anonymized@deleted.local',
            "message" = 'ANONYMIZED',
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            case DataType.NEWSLETTER_SUBSCRIPTIONS:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "email" = CONCAT('anonymized_', id, '@deleted.local'),
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            case DataType.GENERATED_CONTENT:
                queries.push(`
          UPDATE "${tableName}"
          SET 
            "content" = 'ANONYMIZED',
            "metadata" = '{}',
            "deletedAt" = NOW(),
            "deletedBy" = 'data-retention-system'
          WHERE id = '${recordId}'
        `);
                break;

            default:
                // For other data types, just soft delete
                queries.push(RETENTION_QUERIES.softDelete(tableName, recordId));
        }

        return queries;
    }

    /**
     * Create batch deletion result
     */
    private createBatchResult(
        dataType: DataType,
        totalProcessed: number,
        successful: number,
        failed: number,
        anonymized: number,
        softDeleted: number,
        hardDeleted: number,
        errors: string[],
        startTime: number
    ): BatchDeletionResult {
        return {
            dataType,
            totalProcessed,
            successful,
            failed,
            anonymized,
            softDeleted,
            hardDeleted,
            errors,
            processingTimeMs: Date.now() - startTime,
            dryRun: this.config.dryRun!,
        };
    }

    /**
     * Process all data types for retention
     */
    async processAllDataTypes(adminUserId?: string): Promise<BatchDeletionResult[]> {
        const results: BatchDeletionResult[] = [];

        for (const dataType of Object.values(DataType)) {
            try {
                const result = await this.processDataRetention(dataType, adminUserId);
                results.push(result);
            } catch (error) {
                console.error(`Error processing ${dataType}:`, error);
                results.push({
                    dataType,
                    totalProcessed: 0,
                    successful: 0,
                    failed: 0,
                    anonymized: 0,
                    softDeleted: 0,
                    hardDeleted: 0,
                    errors: [error instanceof Error ? error.message : 'Unknown error'],
                    processingTimeMs: 0,
                    dryRun: this.config.dryRun!,
                });
            }
        }

        return results;
    }

    /**
     * Get records eligible for retention processing
     */
    async getEligibleRecords(
        dataType: DataType,
        limit: number = 1000
    ): Promise<RetentionEligibleRecord[]> {
        return await getEligibleRecords(dataType, this.prisma, limit);
    }

    /**
     * Get deletion statistics
     */
    async getDeletionStatistics(): Promise<Record<DataType, BatchDeletionResult>> {
        const stats: Record<DataType, BatchDeletionResult> = {} as Record<DataType, BatchDeletionResult>;

        for (const dataType of Object.values(DataType)) {
            try {
                const result = await this.processDataRetention(dataType);
                stats[dataType as DataType] = result;
            } catch (error) {
                stats[dataType as DataType] = {
                    dataType,
                    totalProcessed: 0,
                    successful: 0,
                    failed: 0,
                    anonymized: 0,
                    softDeleted: 0,
                    hardDeleted: 0,
                    errors: [error instanceof Error ? error.message : 'Unknown error'],
                    processingTimeMs: 0,
                    dryRun: this.config.dryRun!,
                };
            }
        }

        return stats;
    }
}
