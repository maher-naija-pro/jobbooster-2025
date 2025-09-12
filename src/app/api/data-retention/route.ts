/**
 * Data Retention API Endpoints
 * 
 * This module provides REST API endpoints for data retention operations.
 * It includes endpoints for manual execution, monitoring, and configuration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DataRetentionScheduler } from '@/lib/data-retention/scheduler';
import { DataRetentionDeletionService } from '@/lib/data-retention/deletion-service';
import { DataType } from '@/lib/data-retention';
import { isDataRetentionEnabled } from '@/config/data-retention.config';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

/**
 * GET /api/data-retention
 * Get data retention system status and statistics
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Data retention status request started', {
        requestId,
        endpoint: '/api/data-retention',
        method: 'GET'
    });

    try {
        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled', {
                requestId
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        const scheduler = new DataRetentionScheduler(prisma);
        const deletionService = new DataRetentionDeletionService(prisma);

        // Get system status
        const status = scheduler.getStatus();

        // Get deletion statistics
        const statistics = await deletionService.getDeletionStatistics();

        // Calculate totals
        const totalStats = Object.values(statistics).reduce((acc, stat) => ({
            totalProcessed: acc.totalProcessed + stat.totalProcessed,
            successful: acc.successful + stat.successful,
            failed: acc.failed + stat.failed,
            anonymized: acc.anonymized + stat.anonymized,
            softDeleted: acc.softDeleted + stat.softDeleted,
            hardDeleted: acc.hardDeleted + stat.hardDeleted,
            errors: acc.errors + stat.errors.length,
        }), {
            totalProcessed: 0,
            successful: 0,
            failed: 0,
            anonymized: 0,
            softDeleted: 0,
            hardDeleted: 0,
            errors: 0,
        });

        logger.info('Data retention status retrieved successfully', {
            requestId,
            processingTime: Date.now() - startTime,
            totalStats
        });

        return NextResponse.json({
            success: true,
            enabled: true,
            status,
            statistics: {
                byDataType: statistics,
                totals: totalStats,
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error getting data retention status', {
            requestId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * POST /api/data-retention
 * Execute data retention operations
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Data retention operation request started', {
        requestId,
        endpoint: '/api/data-retention',
        method: 'POST'
    });

    try {
        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for operation', {
                requestId
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
            }, { status: 503 });
        }

        const body = await request.json();
        const {
            operation,
            dataType,
            dryRun = false,
            adminUserId
        } = body;

        const scheduler = new DataRetentionScheduler(prisma, { dryRun });
        const deletionService = new DataRetentionDeletionService(prisma, { dryRun });

        let result;

        switch (operation) {
            case 'daily_check':
                result = await scheduler.runDailyRetentionCheck(adminUserId);
                break;

            case 'notification_check':
                result = await scheduler.runNotificationCheck(adminUserId);
                break;

            case 'weekly_cleanup':
                result = await scheduler.runWeeklyCleanup(adminUserId);
                break;

            case 'process_data_type':
                if (!dataType) {
                    return NextResponse.json({
                        success: false,
                        error: 'dataType is required for process_data_type operation',
                    }, { status: 400 });
                }

                if (!Object.values(DataType).includes(dataType)) {
                    return NextResponse.json({
                        success: false,
                        error: `Invalid dataType: ${dataType}`,
                    }, { status: 400 });
                }

                const batchResult = await deletionService.processDataRetention(dataType, adminUserId);
                result = {
                    jobId: `manual_${dataType}_${Date.now()}`,
                    jobType: 'retention_check',
                    startTime: new Date(),
                    endTime: new Date(),
                    success: batchResult.failed === 0,
                    dataTypesProcessed: [dataType],
                    totalRecordsProcessed: batchResult.totalProcessed,
                    totalRecordsDeleted: batchResult.softDeleted + batchResult.hardDeleted,
                    totalRecordsAnonymized: batchResult.anonymized,
                    errors: batchResult.errors,
                    processingTimeMs: batchResult.processingTimeMs,
                };
                break;

            default:
                return NextResponse.json({
                    success: false,
                    error: `Invalid operation: ${operation}. Valid operations: daily_check, notification_check, weekly_cleanup, process_data_type`,
                }, { status: 400 });
        }

        logger.info('Data retention operation completed successfully', {
            requestId,
            operation,
            processingTime: Date.now() - startTime,
            success: result.success
        });

        return NextResponse.json({
            success: true,
            result,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error executing data retention operation', {
            requestId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

/**
 * PUT /api/data-retention
 * Update data retention configuration
 */
export async function PUT(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Data retention configuration update request started', {
        requestId,
        endpoint: '/api/data-retention',
        method: 'PUT'
    });

    try {
        const body = await request.json();
        const { enabled, dryRun } = body;

        logger.debug('Data retention configuration update parameters', {
            requestId,
            enabled,
            dryRun,
            hasEnabled: typeof enabled === 'boolean',
            hasDryRun: typeof dryRun === 'boolean'
        });

        const scheduler = new DataRetentionScheduler(prisma);

        if (typeof enabled === 'boolean') {
            scheduler.setEnabled(enabled);
        }

        if (typeof dryRun === 'boolean') {
            scheduler.setDryRun(dryRun);
        }

        const status = scheduler.getStatus();

        logger.info('Data retention configuration updated successfully', {
            requestId,
            processingTime: Date.now() - startTime,
            enabled: status.enabled,
            dryRun: status.dryRun
        });

        return NextResponse.json({
            success: true,
            status,
            message: 'Configuration updated successfully',
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error updating data retention configuration', {
            requestId,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
