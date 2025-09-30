/**
 * Data Retention Utilities
 * 
 * This module provides utility functions for data retention operations,
 * including validation, logging, and helper functions.
 */

import { DataType, getRetentionPolicy, calculateDeletionDate, calculateNotificationDate } from '../data-retention';
import { getTableName, getFieldMappings } from './data-retention-schema';

// Minimal Prisma-like typings to avoid using `any` while supporting dynamic table access
interface PrismaLikeModel {
    count(args: { where?: unknown }): Promise<number>;
    findMany(args: {
        where?: unknown;
        select?: Record<string, boolean>;
        take?: number;
    }): Promise<Array<Record<string, unknown>>>;
}

type PrismaLikeClient = any;

/**
 * Data retention operation result
 */
export interface RetentionOperationResult {
    success: boolean;
    recordsProcessed: number;
    recordsDeleted: number;
    recordsAnonymized: number;
    errors: string[];
    warnings: string[];
}

/**
 * Data retention operation context
 */
export interface RetentionOperationContext {
    dataType: DataType;
    operation: 'delete' | 'anonymize' | 'notify';
    dryRun: boolean;
    batchSize: number;
    userId?: string;
    adminUserId?: string;
}

/**
 * Record eligible for retention processing
 */
export interface RetentionEligibleRecord {
    id: string;
    createdAt: Date;
    lastAccessedAt?: Date;
    deletionDate: Date;
    notificationDate?: Date;
}

/**
 * Validate data retention configuration
 */
export function validateRetentionConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if all data types have valid retention periods
    Object.values(DataType).forEach(dataType => {
        const policy = getRetentionPolicy(dataType);

        if (policy.retentionDays < 0) {
            errors.push(`Invalid retention period for ${dataType}: ${policy.retentionDays} days`);
        }

        if (policy.notifyBeforeDeletion && policy.notificationDays >= policy.retentionDays) {
            errors.push(`Notification days (${policy.notificationDays}) must be less than retention days (${policy.retentionDays}) for ${dataType}`);
        }

        if (policy.notifyBeforeDeletion && policy.notificationDays <= 0) {
            errors.push(`Notification days must be positive for ${dataType}`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Calculate retention statistics for a data type
 */
export async function calculateRetentionStats(
    dataType: DataType,
    prisma: PrismaLikeClient
): Promise<{
    totalRecords: number;
    eligibleForDeletion: number;
    needingNotification: number;
    alreadyDeleted: number;
    anonymizable: number;
}> {
    const tableName = getTableName(dataType);
    const fields = getFieldMappings(dataType);
    const policy = getRetentionPolicy(dataType);

    try {
        // Get total records
        const totalRecords = await prisma[tableName].count({
            where: { [fields.isDeleted]: false }
        });

        // Get records eligible for deletion
        const eligibleForDeletion = await prisma[tableName].count({
            where: {
                [fields.isDeleted]: false,
                OR: [
                    {
                        [fields.lastAccessedAt]: {
                            not: null,
                            lt: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000)
                        }
                    },
                    {
                        [fields.lastAccessedAt]: null,
                        [fields.createdAt]: {
                            lt: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000)
                        }
                    }
                ]
            }
        });

        // Get records needing notification
        let needingNotification = 0;
        if (policy.notifyBeforeDeletion) {
            const notificationThreshold = policy.retentionDays - policy.notificationDays;
            needingNotification = await prisma[tableName].count({
                where: {
                    [fields.isDeleted]: false,
                    [fields.lastAccessedAt]: {
                        not: null,
                        gte: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000),
                        lt: new Date(Date.now() - notificationThreshold * 24 * 60 * 60 * 1000)
                    }
                }
            });
        }

        // Get already deleted records
        const alreadyDeleted = await prisma[tableName].count({
            where: { [fields.isDeleted]: true }
        });

        // Get anonymizable records (records that can be anonymized instead of deleted)
        const anonymizable = policy.allowAnonymization ? eligibleForDeletion : 0;

        return {
            totalRecords,
            eligibleForDeletion,
            needingNotification,
            alreadyDeleted,
            anonymizable,
        };
    } catch (error) {
        console.error(`Error calculating retention stats for ${dataType}:`, error);
        throw error;
    }
}

/**
 * Get records eligible for retention processing
 */
export async function getEligibleRecords(
    dataType: DataType,
    prisma: PrismaLikeClient,
    limit: number = 1000
): Promise<RetentionEligibleRecord[]> {
    const tableName = getTableName(dataType);
    const fields = getFieldMappings(dataType);
    const policy = getRetentionPolicy(dataType);

    try {
        const records = await prisma[tableName].findMany({
            where: {
                [fields.isDeleted]: false,
                OR: [
                    {
                        [fields.lastAccessedAt]: {
                            not: null,
                            lt: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000)
                        }
                    },
                    {
                        [fields.lastAccessedAt]: null,
                        [fields.createdAt]: {
                            lt: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000)
                        }
                    }
                ]
            },
            select: {
                id: true,
                [fields.createdAt]: true,
                [fields.lastAccessedAt]: true,
            },
            take: limit,
        });

        return records.map((record: any) => {
            const createdAt = record[fields.createdAt] as Date;
            const lastAccessedAt = record[fields.lastAccessedAt] as Date | undefined;
            const referenceDate = lastAccessedAt || createdAt;

            return {
                id: record.id as string,
                createdAt,
                lastAccessedAt,
                deletionDate: calculateDeletionDate(dataType, referenceDate),
                notificationDate: policy.notifyBeforeDeletion
                    ? calculateNotificationDate(dataType, referenceDate)
                    : undefined,
            };
        });
    } catch (error) {
        console.error(`Error getting eligible records for ${dataType}:`, error);
        throw error;
    }
}

/**
 * Get records that need deletion notifications
 */
export async function getRecordsNeedingNotification(
    dataType: DataType,
    prisma: PrismaLikeClient,
    limit: number = 1000
): Promise<RetentionEligibleRecord[]> {
    const tableName = getTableName(dataType);
    const fields = getFieldMappings(dataType);
    const policy = getRetentionPolicy(dataType);

    if (!policy.notifyBeforeDeletion) {
        return [];
    }

    try {
        const notificationThreshold = policy.retentionDays - policy.notificationDays;
        const records = await prisma[tableName].findMany({
            where: {
                [fields.isDeleted]: false,
                [fields.lastAccessedAt]: {
                    not: null,
                    gte: new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000),
                    lt: new Date(Date.now() - notificationThreshold * 24 * 60 * 60 * 1000)
                }
            },
            select: {
                id: true,
                [fields.createdAt]: true,
                [fields.lastAccessedAt]: true,
            },
            take: limit,
        });

        return records.map((record: any) => {
            const createdAt = record[fields.createdAt] as Date;
            const lastAccessedAt = record[fields.lastAccessedAt] as Date | undefined;
            const referenceDate = lastAccessedAt || createdAt;

            return {
                id: record.id as string,
                createdAt,
                lastAccessedAt,
                deletionDate: calculateDeletionDate(dataType, referenceDate),
                notificationDate: calculateNotificationDate(dataType, referenceDate),
            };
        });
    } catch (error) {
        console.error(`Error getting records needing notification for ${dataType}:`, error);
        throw error;
    }
}

/**
 * Log data retention operation
 */
export function logRetentionOperation(
    context: RetentionOperationContext,
    result: RetentionOperationResult,
    additionalData?: Record<string, unknown>
): void {
    const logData = {
        timestamp: new Date().toISOString(),
        dataType: context.dataType,
        operation: context.operation,
        dryRun: context.dryRun,
        recordsProcessed: result.recordsProcessed,
        recordsDeleted: result.recordsDeleted,
        recordsAnonymized: result.recordsAnonymized,
        success: result.success,
        errors: result.errors,
        warnings: result.warnings,
        userId: context.userId,
        adminUserId: context.adminUserId,
        ...additionalData,
    };

    if (result.success) {
        console.log(`✅ Data retention operation completed:`, logData);
    } else {
        console.error(`❌ Data retention operation failed:`, logData);
    }
}

/**
 * Create retention operation result
 */
export function createRetentionResult(
    success: boolean,
    recordsProcessed: number = 0,
    recordsDeleted: number = 0,
    recordsAnonymized: number = 0,
    errors: string[] = [],
    warnings: string[] = []
): RetentionOperationResult {
    return {
        success,
        recordsProcessed,
        recordsDeleted,
        recordsAnonymized,
        errors,
        warnings,
    };
}

/**
 * Format retention period for display
 */
export function formatRetentionPeriod(days: number): string {
    if (days === 0) {
        return 'Until manually deleted';
    }

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);

    return parts.join(', ');
}

/**
 * Get data retention summary for all data types
 */
export async function getDataRetentionSummary(prisma: PrismaLikeClient) {
    const summary = [];

    for (const dataType of Object.values(DataType)) {
        try {
            const stats = await calculateRetentionStats(dataType, prisma);
            const policy = getRetentionPolicy(dataType);

            summary.push({
                dataType,
                policy: {
                    retentionDays: policy.retentionDays,
                    retentionPeriod: formatRetentionPeriod(policy.retentionDays),
                    notifyBeforeDeletion: policy.notifyBeforeDeletion,
                    notificationDays: policy.notificationDays,
                    allowAnonymization: policy.allowAnonymization,
                    legalBasis: policy.legalBasis,
                    requiresManualReview: policy.requiresManualReview,
                },
                stats,
            });
        } catch (error) {
            console.error(`Error getting summary for ${dataType}:`, error);
            summary.push({
                dataType,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    return summary;
}

/**
 * Validate record for retention processing
 */
export function validateRecordForRetention(
    record: RetentionEligibleRecord,
    dataType: DataType
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!record.id) {
        errors.push('Record ID is required');
    }

    if (!record.createdAt) {
        errors.push('Creation date is required');
    }

    if (record.createdAt && record.createdAt > new Date()) {
        errors.push('Creation date cannot be in the future');
    }

    if (record.lastAccessedAt && record.lastAccessedAt > new Date()) {
        errors.push('Last accessed date cannot be in the future');
    }

    if (record.lastAccessedAt && record.createdAt && record.lastAccessedAt < record.createdAt) {
        errors.push('Last accessed date cannot be before creation date');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
