/**
 * Data Retention Scheduler
 * 
 * This module provides scheduling capabilities for data retention operations.
 * It can be integrated with cron jobs, background tasks, or API endpoints.
 */

import { PrismaClient } from '@prisma/client';
import { DataType } from '../data-retention';
import { DataRetentionDeletionService } from './deletion-service';
import {
    DATA_RETENTION_CONFIG,
    isDataRetentionEnabled
} from '../../config/data-retention.config';

/**
 * Scheduler configuration
 */
export interface SchedulerConfig {
    enabled: boolean;
    dryRun: boolean;
    batchSize: number;
    maxRecords: number;
    continueOnError: boolean;
    maxRetries: number;
    retryDelayMs: number;
}

/**
 * Scheduled job result
 */
export interface ScheduledJobResult {
    jobId: string;
    jobType: 'retention_check' | 'notification_check' | 'cleanup';
    startTime: Date;
    endTime: Date;
    success: boolean;
    dataTypesProcessed: DataType[];
    totalRecordsProcessed: number;
    totalRecordsDeleted: number;
    totalRecordsAnonymized: number;
    errors: string[];
    processingTimeMs: number;
}

/**
 * Data Retention Scheduler
 */
export class DataRetentionScheduler {
    private prisma: PrismaClient;
    private deletionService: DataRetentionDeletionService;
    private config: SchedulerConfig;

    constructor(prisma: PrismaClient, config?: Partial<SchedulerConfig>) {
        this.prisma = prisma;
        this.config = {
            enabled: config?.enabled ?? isDataRetentionEnabled(),
            dryRun: config?.dryRun ?? DATA_RETENTION_CONFIG.dryRun,
            batchSize: config?.batchSize ?? DATA_RETENTION_CONFIG.batchSize,
            maxRecords: config?.maxRecords ?? DATA_RETENTION_CONFIG.maxRecordsPerOperation,
            continueOnError: config?.continueOnError ?? DATA_RETENTION_CONFIG.errorHandling.continueOnError,
            maxRetries: config?.maxRetries ?? DATA_RETENTION_CONFIG.errorHandling.maxRetries,
            retryDelayMs: config?.retryDelayMs ?? DATA_RETENTION_CONFIG.errorHandling.retryDelayMs,
        };

        this.deletionService = new DataRetentionDeletionService(prisma, {
            dryRun: this.config.dryRun,
            batchSize: this.config.batchSize,
            maxRecords: this.config.maxRecords,
            continueOnError: this.config.continueOnError,
            maxRetries: this.config.maxRetries,
            retryDelayMs: this.config.retryDelayMs,
        });
    }

    /**
     * Run daily retention check
     * This should be called daily to process expired data
     */
    async runDailyRetentionCheck(adminUserId?: string): Promise<ScheduledJobResult> {
        const jobId = `retention_check_${Date.now()}`;
        const startTime = new Date();

        console.log(`Starting daily retention check: ${jobId}`);

        try {
            if (!this.config.enabled) {
                throw new Error('Data retention scheduler is disabled');
            }

            // Process all data types
            const results = await this.deletionService.processAllDataTypes(adminUserId);

            // Calculate totals
            const dataTypesProcessed = results.map(r => r.dataType);
            const totalRecordsProcessed = results.reduce((sum, r) => sum + r.totalProcessed, 0);
            const totalRecordsDeleted = results.reduce((sum, r) => sum + r.softDeleted + r.hardDeleted, 0);
            const totalRecordsAnonymized = results.reduce((sum, r) => sum + r.anonymized, 0);
            const errors = results.flatMap(r => r.errors);
            const success = errors.length === 0;

            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            const result: ScheduledJobResult = {
                jobId,
                jobType: 'retention_check',
                startTime,
                endTime,
                success,
                dataTypesProcessed,
                totalRecordsProcessed,
                totalRecordsDeleted,
                totalRecordsAnonymized,
                errors,
                processingTimeMs,
            };

            console.log(`Daily retention check completed: ${jobId}`, {
                success,
                totalRecordsProcessed,
                totalRecordsDeleted,
                totalRecordsAnonymized,
                processingTimeMs,
                errors: errors.length,
            });

            return result;

        } catch (error) {
            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            console.error(`Daily retention check failed: ${jobId}`, error);

            return {
                jobId,
                jobType: 'retention_check',
                startTime,
                endTime,
                success: false,
                dataTypesProcessed: [],
                totalRecordsProcessed: 0,
                totalRecordsDeleted: 0,
                totalRecordsAnonymized: 0,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                processingTimeMs,
            };
        }
    }

    /**
     * Run notification check
     * This should be called daily to send deletion notifications
     */
    async runNotificationCheck(_adminUserId?: string): Promise<ScheduledJobResult> {
        const jobId = `notification_check_${Date.now()}`;
        const startTime = new Date();

        console.log(`Starting notification check: ${jobId}`);

        try {
            if (!this.config.enabled) {
                throw new Error('Data retention scheduler is disabled');
            }

            // TODO: Implement notification service in next task
            // For now, return a placeholder result
            const results = {
                success: true,
                dataTypesProcessed: [],
                totalNotificationsSent: 0,
                errors: [],
            };

            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            const result: ScheduledJobResult = {
                jobId,
                jobType: 'notification_check',
                startTime,
                endTime,
                success: results.success,
                dataTypesProcessed: results.dataTypesProcessed,
                totalRecordsProcessed: results.totalNotificationsSent,
                totalRecordsDeleted: 0,
                totalRecordsAnonymized: 0,
                errors: results.errors,
                processingTimeMs,
            };

            console.log(`Notification check completed: ${jobId}`, {
                success: results.success,
                totalNotificationsSent: results.totalNotificationsSent,
                processingTimeMs,
                errors: results.errors.length,
            });

            return result;

        } catch (error) {
            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            console.error(`Notification check failed: ${jobId}`, error);

            return {
                jobId,
                jobType: 'notification_check',
                startTime,
                endTime,
                success: false,
                dataTypesProcessed: [],
                totalRecordsProcessed: 0,
                totalRecordsDeleted: 0,
                totalRecordsAnonymized: 0,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                processingTimeMs,
            };
        }
    }

    /**
     * Run weekly cleanup
     * This should be called weekly for additional cleanup tasks
     */
    async runWeeklyCleanup(adminUserId?: string): Promise<ScheduledJobResult> {
        const jobId = `weekly_cleanup_${Date.now()}`;
        const startTime = new Date();

        console.log(`Starting weekly cleanup: ${jobId}`);

        try {
            if (!this.config.enabled) {
                throw new Error('Data retention scheduler is disabled');
            }

            // Run retention check for all data types
            const retentionResults = await this.deletionService.processAllDataTypes(adminUserId);

            // Additional cleanup tasks
            const cleanupResults = await this.performAdditionalCleanup();

            // Calculate totals
            const dataTypesProcessed = retentionResults.map(r => r.dataType);
            const totalRecordsProcessed = retentionResults.reduce((sum, r) => sum + r.totalProcessed, 0);
            const totalRecordsDeleted = retentionResults.reduce((sum, r) => sum + r.softDeleted + r.hardDeleted, 0);
            const totalRecordsAnonymized = retentionResults.reduce((sum, r) => sum + r.anonymized, 0);
            const errors = [
                ...retentionResults.flatMap(r => r.errors),
                ...cleanupResults.errors,
            ];
            const success = errors.length === 0;

            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            const result: ScheduledJobResult = {
                jobId,
                jobType: 'cleanup',
                startTime,
                endTime,
                success,
                dataTypesProcessed,
                totalRecordsProcessed,
                totalRecordsDeleted,
                totalRecordsAnonymized,
                errors,
                processingTimeMs,
            };

            console.log(`Weekly cleanup completed: ${jobId}`, {
                success,
                totalRecordsProcessed,
                totalRecordsDeleted,
                totalRecordsAnonymized,
                processingTimeMs,
                errors: errors.length,
            });

            return result;

        } catch (error) {
            const endTime = new Date();
            const processingTimeMs = endTime.getTime() - startTime.getTime();

            console.error(`Weekly cleanup failed: ${jobId}`, error);

            return {
                jobId,
                jobType: 'cleanup',
                startTime,
                endTime,
                success: false,
                dataTypesProcessed: [],
                totalRecordsProcessed: 0,
                totalRecordsDeleted: 0,
                totalRecordsAnonymized: 0,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                processingTimeMs,
            };
        }
    }

    /**
     * Perform additional cleanup tasks
     */
    private async performAdditionalCleanup(): Promise<{
        errors: string[];
        cleanedUp: number;
    }> {
        const errors: string[] = [];
        let cleanedUp = 0;

        try {
            // Clean up old audit logs
            const auditLogCleanup = await this.cleanupOldAuditLogs();
            cleanedUp += auditLogCleanup.cleanedUp;
            errors.push(...auditLogCleanup.errors);

            // Clean up old session data
            const sessionCleanup = await this.cleanupOldSessions();
            cleanedUp += sessionCleanup.cleanedUp;
            errors.push(...sessionCleanup.errors);

            // Clean up old temporary files
            const tempFileCleanup = await this.cleanupTemporaryFiles();
            cleanedUp += tempFileCleanup.cleanedUp;
            errors.push(...tempFileCleanup.errors);

        } catch (error) {
            errors.push(`Additional cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return { errors, cleanedUp };
    }

    /**
     * Clean up old audit logs
     */
    private async cleanupOldAuditLogs(): Promise<{ cleanedUp: number; errors: string[] }> {
        const errors: string[] = [];
        let cleanedUp = 0;

        try {
            // Clean up audit logs older than 7 years
            const sevenYearsAgo = new Date();
            sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

            const result = await this.prisma.userActivity.deleteMany({
                where: {
                    // Note: activityType field may not exist in current schema
                    // This is a placeholder for future audit log cleanup
                    createdAt: {
                        lt: sevenYearsAgo,
                    },
                },
            });

            cleanedUp = result.count;
            console.log(`Cleaned up ${cleanedUp} old audit logs`);

        } catch (error) {
            errors.push(`Audit log cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return { cleanedUp, errors };
    }

    /**
     * Clean up old session data
     */
    private async cleanupOldSessions(): Promise<{ cleanedUp: number; errors: string[] }> {
        const errors: string[] = [];
        let cleanedUp = 0;

        try {
            // Clean up sessions older than 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await this.prisma.userSession.deleteMany({
                where: {
                    expiresAt: {
                        lt: thirtyDaysAgo,
                    },
                },
            });

            cleanedUp = result.count;
            console.log(`Cleaned up ${cleanedUp} old sessions`);

        } catch (error) {
            errors.push(`Session cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return { cleanedUp, errors };
    }

    /**
     * Clean up temporary files
     */
    private async cleanupTemporaryFiles(): Promise<{ cleanedUp: number; errors: string[] }> {
        const errors: string[] = [];
        const cleanedUp = 0;

        try {
            // This would integrate with file storage system
            // For now, just log that it would be done
            console.log('Temporary file cleanup would be performed here');

            // In a real implementation, this would:
            // 1. List temporary files older than 24 hours
            // 2. Delete them from storage
            // 3. Update database records

        } catch (error) {
            errors.push(`Temporary file cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        return { cleanedUp, errors };
    }

    /**
     * Get scheduler status
     */
    getStatus(): {
        enabled: boolean;
        dryRun: boolean;
        config: SchedulerConfig;
    } {
        return {
            enabled: this.config.enabled,
            dryRun: this.config.dryRun,
            config: this.config,
        };
    }

    /**
     * Enable/disable scheduler
     */
    setEnabled(enabled: boolean): void {
        this.config.enabled = enabled;
        console.log(`Data retention scheduler ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Set dry run mode
     */
    setDryRun(dryRun: boolean): void {
        this.config.dryRun = dryRun;
        this.deletionService = new DataRetentionDeletionService(this.prisma, {
            ...this.config,
            dryRun,
        });
        console.log(`Data retention dry run mode ${dryRun ? 'enabled' : 'disabled'}`);
    }
}
