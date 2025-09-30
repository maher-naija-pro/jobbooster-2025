#!/usr/bin/env tsx

/**
 * Data Retention CLI Script
 * 
 * This script provides command-line interface for data retention operations.
 * It can be used for manual execution, testing, and debugging.
 * 
 * Usage:
 *   npm run data-retention -- --help
 *   npm run data-retention -- --operation daily_check
 *   npm run data-retention -- --operation process_data_type --data-type USER_PROFILE
 *   npm run data-retention -- --operation daily_check --dry-run
 */

import { PrismaClient } from '@prisma/client';
import { DataRetentionScheduler } from '../src/lib/data-retention/scheduler';
import { DataRetentionDeletionService } from '../src/lib/data-retention/deletion-service';
import { DataType, getRetentionPoliciesSummary } from '../src/lib/data-retention';
import { isDataRetentionEnabled } from '../src/config/data-retention.config';

const prisma = new PrismaClient();

interface CliOptions {
    operation: string;
    dataType?: string;
    dryRun: boolean;
    adminUserId?: string;
    help: boolean;
    verbose: boolean;
}

function parseArgs(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {
        operation: '',
        dryRun: false,
        help: false,
        verbose: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--help':
            case '-h':
                options.help = true;
                break;
            case '--operation':
            case '-o':
                options.operation = args[++i];
                break;
            case '--data-type':
            case '-d':
                options.dataType = args[++i];
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--admin-user-id':
            case '-u':
                options.adminUserId = args[++i];
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            default:
                console.error(`Unknown option: ${arg}`);
                process.exit(1);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Data Retention CLI Script

Usage:
  npm run data-retention -- [options]

Options:
  --help, -h                    Show this help message
  --operation, -o <operation>   Operation to perform (required)
  --data-type, -d <type>        Data type for specific operations
  --dry-run                     Run in dry-run mode (no actual deletions)
  --admin-user-id, -u <id>      Admin user ID for audit logging
  --verbose, -v                 Enable verbose output

Operations:
  daily_check                   Run daily retention check
  notification_check            Run notification check
  weekly_cleanup               Run weekly cleanup
  process_data_type            Process specific data type
  list_policies                List all retention policies
  status                       Show system status
  stats                        Show statistics

Data Types:
  ${Object.values(DataType).join(', ')}

Examples:
  npm run data-retention -- --operation daily_check
  npm run data-retention -- --operation process_data_type --data-type USER_PROFILE
  npm run data-retention -- --operation daily_check --dry-run --verbose
  npm run data-retention -- --operation list_policies
`);
}

async function executeOperation(options: CliOptions): Promise<void> {
    if (!isDataRetentionEnabled()) {
        console.error('❌ Data retention system is disabled');
        process.exit(1);
    }

    const scheduler = new DataRetentionScheduler(prisma, {
        dryRun: options.dryRun
    });
    const deletionService = new DataRetentionDeletionService(prisma, {
        dryRun: options.dryRun
    });

    console.log(`🚀 Starting data retention operation: ${options.operation}`);
    if (options.dryRun) {
        console.log('⚠️  Running in DRY RUN mode - no actual deletions will occur');
    }
    console.log('');

    try {
        let result: OperationResult | void;

        switch (options.operation) {
            case 'daily_check':
                result = await scheduler.runDailyRetentionCheck(options.adminUserId);
                break;

            case 'notification_check':
                result = await scheduler.runNotificationCheck(options.adminUserId);
                break;

            case 'weekly_cleanup':
                result = await scheduler.runWeeklyCleanup(options.adminUserId);
                break;

            case 'process_data_type':
                if (!options.dataType) {
                    console.error('❌ --data-type is required for process_data_type operation');
                    process.exit(1);
                }

                if (!Object.values(DataType).includes(options.dataType as DataType)) {
                    console.error(`❌ Invalid data type: ${options.dataType}`);
                    console.error(`Valid types: ${Object.values(DataType).join(', ')}`);
                    process.exit(1);
                }

                const batchResult = await deletionService.processDataRetention(
                    options.dataType as DataType,
                    options.adminUserId
                );

                // Convert BatchDeletionResult to OperationResult
                result = {
                    success: batchResult.failed === 0,
                    processingTimeMs: batchResult.processingTimeMs,
                    totalRecordsProcessed: batchResult.totalProcessed,
                    totalRecordsDeleted: batchResult.softDeleted + batchResult.hardDeleted,
                    totalRecordsAnonymized: batchResult.anonymized,
                    errors: batchResult.errors,
                    dataTypesProcessed: [batchResult.dataType]
                };
                break;

            case 'list_policies':
                await listPolicies();
                return;

            case 'status':
                await showStatus(scheduler);
                return;

            case 'stats':
                await showStats(deletionService);
                return;

            default:
                console.error(`❌ Unknown operation: ${options.operation}`);
                console.error('Use --help to see available operations');
                process.exit(1);
        }

        // Display results
        if (result) {
            displayResult(result, options.verbose);
        }

    } catch (error) {
        console.error('❌ Error executing operation:', error);
        process.exit(1);
    }
}

interface OperationResult {
    success: boolean;
    jobId?: string;
    processingTimeMs?: number;
    totalRecordsProcessed?: number;
    totalRecordsDeleted?: number;
    totalRecordsAnonymized?: number;
    errors?: string[];
    dataTypesProcessed?: string[];
}

function displayResult(result: OperationResult, verbose: boolean): void {
    console.log('');
    console.log('📊 Operation Results:');
    console.log('==================');
    console.log(`✅ Success: ${result.success ? 'Yes' : 'No'}`);
    console.log(`📝 Job ID: ${result.jobId || 'N/A'}`);
    console.log(`⏱️  Processing Time: ${result.processingTimeMs || 0}ms`);
    console.log(`📊 Records Processed: ${result.totalRecordsProcessed || 0}`);
    console.log(`🗑️  Records Deleted: ${result.totalRecordsDeleted || 0}`);
    console.log(`🔒 Records Anonymized: ${result.totalRecordsAnonymized || 0}`);
    console.log(`❌ Errors: ${result.errors?.length || 0}`);

    if (result.dataTypesProcessed && result.dataTypesProcessed.length > 0) {
        console.log(`📋 Data Types Processed: ${result.dataTypesProcessed.join(', ')}`);
    }

    if (result.errors && result.errors.length > 0) {
        console.log('');
        console.log('❌ Errors:');
        result.errors.forEach((error: string, index: number) => {
            console.log(`  ${index + 1}. ${error}`);
        });
    }

    if (verbose && result.errors && result.errors.length > 0) {
        console.log('');
        console.log('🔍 Full Error Details:');
        result.errors.forEach((error: string, index: number) => {
            console.log(`  ${index + 1}. ${error}`);
        });
    }

    console.log('');
    console.log(result.success ? '✅ Operation completed successfully!' : '❌ Operation completed with errors');
}


async function listPolicies(): Promise<void> {
    console.log('📋 Data Retention Policies:');
    console.log('==========================');

    const policies = getRetentionPoliciesSummary();

    policies.forEach((policy) => {
        console.log('');
        console.log(`📄 ${policy.dataType}:`);
        console.log(`   Retention: ${policy.retentionDays} days (${policy.retentionYears} years)`);
        console.log(`   Notify Before Deletion: ${policy.notifyBeforeDeletion ? 'Yes' : 'No'}`);
        if (policy.notifyBeforeDeletion) {
            console.log(`   Notification Days: ${policy.notificationDays}`);
        }
        console.log(`   Allow Anonymization: ${policy.allowAnonymization ? 'Yes' : 'No'}`);
        console.log(`   Legal Basis: ${policy.legalBasis}`);
        console.log(`   Manual Review Required: ${policy.requiresManualReview ? 'Yes' : 'No'}`);
        console.log(`   Description: ${policy.description}`);
    });
}

async function showStatus(scheduler: DataRetentionScheduler): Promise<void> {
    console.log('📊 Data Retention System Status:');
    console.log('================================');

    const status = scheduler.getStatus();

    console.log(`Enabled: ${status.enabled ? '✅ Yes' : '❌ No'}`);
    console.log(`Dry Run Mode: ${status.dryRun ? '⚠️  Yes' : '✅ No'}`);
    console.log(`Batch Size: ${status.config.batchSize}`);
    console.log(`Max Records: ${status.config.maxRecords}`);
    console.log(`Continue on Error: ${status.config.continueOnError ? 'Yes' : 'No'}`);
    console.log(`Max Retries: ${status.config.maxRetries}`);
    console.log(`Retry Delay: ${status.config.retryDelayMs}ms`);
}

async function showStats(deletionService: DataRetentionDeletionService): Promise<void> {
    console.log('📊 Data Retention Statistics:');
    console.log('=============================');

    const stats = await deletionService.getDeletionStatistics();

    Object.entries(stats).forEach(([dataType, stat]) => {
        console.log('');
        console.log(`📄 ${dataType}:`);
        console.log(`   Total Processed: ${stat.totalProcessed}`);
        console.log(`   Successful: ${stat.successful}`);
        console.log(`   Failed: ${stat.failed}`);
        console.log(`   Anonymized: ${stat.anonymized}`);
        console.log(`   Soft Deleted: ${stat.softDeleted}`);
        console.log(`   Hard Deleted: ${stat.hardDeleted}`);
        console.log(`   Processing Time: ${stat.processingTimeMs}ms`);
        if (stat.errors.length > 0) {
            console.log(`   Errors: ${stat.errors.length}`);
        }
    });
}

async function main(): Promise<void> {
    const options = parseArgs();

    if (options.help) {
        printHelp();
        return;
    }

    if (!options.operation) {
        console.error('❌ --operation is required');
        console.error('Use --help to see available operations');
        process.exit(1);
    }

    try {
        await executeOperation(options);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the script
main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
