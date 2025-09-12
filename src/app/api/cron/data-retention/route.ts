/**
 * Data Retention Cron Job Handler
 * 
 * This endpoint handles scheduled data retention operations.
 * It can be called by external cron services or internal schedulers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DataRetentionScheduler } from '@/lib/data-retention/scheduler';
import { isDataRetentionEnabled } from '@/config/data-retention.config';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

/**
 * POST /api/cron/data-retention
 * Handle scheduled data retention operations
 */
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `cron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Data retention cron job request started', {
        requestId,
        endpoint: '/api/cron/data-retention',
        method: 'POST'
    });

    try {
        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for cron job', {
                requestId
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        // Verify request is from authorized source
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'default-secret';

        if (authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Unauthorized cron job request', {
                requestId,
                hasAuthHeader: !!authHeader
            });
            return NextResponse.json({
                success: false,
                error: 'Unauthorized',
            }, { status: 401 });
        }

        logger.debug('Cron job authentication successful', {
            requestId
        });

        const body = await request.json();
        const {
            jobType,
            adminUserId = 'cron-system',
            dryRun = false
        } = body;

        logger.debug('Cron job parameters', {
            requestId,
            jobType,
            adminUserId,
            dryRun
        });

        const scheduler = new DataRetentionScheduler(prisma, { dryRun });

        let result;

        switch (jobType) {
            case 'daily_check':
                logger.info('Executing daily retention check cron job', {
                    requestId,
                    adminUserId,
                    dryRun
                });
                result = await scheduler.runDailyRetentionCheck(adminUserId);
                break;

            case 'notification_check':
                logger.info('Executing notification check cron job', {
                    requestId,
                    adminUserId,
                    dryRun
                });
                result = await scheduler.runNotificationCheck(adminUserId);
                break;

            case 'weekly_cleanup':
                logger.info('Executing weekly cleanup cron job', {
                    requestId,
                    adminUserId,
                    dryRun
                });
                result = await scheduler.runWeeklyCleanup(adminUserId);
                break;

            default:
                logger.warn('Invalid job type for cron job', {
                    requestId,
                    jobType,
                    validTypes: ['daily_check', 'notification_check', 'weekly_cleanup']
                });
                return NextResponse.json({
                    success: false,
                    error: `Invalid jobType: ${jobType}. Valid types: daily_check, notification_check, weekly_cleanup`,
                }, { status: 400 });
        }

        logger.info('Cron job completed successfully', {
            requestId,
            jobType,
            success: result.success,
            totalRecordsProcessed: result.totalRecordsProcessed,
            totalRecordsDeleted: result.totalRecordsDeleted,
            totalRecordsAnonymized: result.totalRecordsAnonymized,
            processingTimeMs: result.processingTimeMs,
            errors: result.errors.length,
            totalProcessingTime: Date.now() - startTime
        });

        return NextResponse.json({
            success: true,
            result,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error executing cron job', {
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
 * GET /api/cron/data-retention
 * Get cron job status and configuration
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Data retention cron status request started', {
        requestId,
        endpoint: '/api/cron/data-retention',
        method: 'GET'
    });

    try {
        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for cron status', {
                requestId
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        const scheduler = new DataRetentionScheduler(prisma);
        const status = scheduler.getStatus();

        logger.info('Data retention cron status retrieved successfully', {
            requestId,
            processingTime: Date.now() - startTime,
            enabled: status.enabled,
            dryRun: status.dryRun
        });

        return NextResponse.json({
            success: true,
            enabled: true,
            status,
            availableJobs: [
                'daily_check',
                'notification_check',
                'weekly_cleanup',
            ],
            cronExpressions: {
                dailyCheck: process.env.DATA_RETENTION_DAILY_CRON || '0 2 * * *',
                notificationCheck: process.env.DATA_RETENTION_NOTIFICATION_CRON || '0 8 * * *',
                weeklyCleanup: process.env.DATA_RETENTION_WEEKLY_CRON || '0 3 * * 0',
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error getting cron status', {
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
