/**
 * Data Retention API Endpoints for Specific Data Types
 * 
 * This module provides REST API endpoints for processing specific data types.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DataRetentionDeletionService } from '@/lib/data-retention/deletion-service';
import { DataType, getRetentionPolicy, calculateRetentionStats } from '@/lib/data-retention';
import { isDataRetentionEnabled } from '@/config/data-retention.config';
import { logger } from '@/lib/logger';
import { RetentionEligibleRecord } from '@/lib/data-retention/data-retention-utils';

const prisma = new PrismaClient();

/**
 * GET /api/data-retention/[dataType]
 * Get information about a specific data type and its retention status
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ dataType: string }> }
) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const { dataType } = await params;

        logger.info('Data retention data type info request started', {
            requestId,
            endpoint: '/api/data-retention/[dataType]',
            method: 'GET',
            dataType: dataType
        });

        // Validate data type
        if (!Object.values(DataType).includes(dataType as DataType)) {
            logger.warn('Invalid data type requested', {
                requestId,
                dataType,
                validDataTypes: Object.values(DataType)
            });
            return NextResponse.json({
                success: false,
                error: `Invalid dataType: ${dataType}`,
                validDataTypes: Object.values(DataType),
            }, { status: 400 });
        }

        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for data type info', {
                requestId,
                dataType
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        const typedDataType = dataType as DataType;

        // Get retention policy
        const policy = getRetentionPolicy(typedDataType);

        // Get retention statistics
        const stats = await calculateRetentionStats(typedDataType, prisma as any);

        // Get eligible records (without processing them)
        const deletionService = new DataRetentionDeletionService(prisma, { dryRun: true });
        const eligibleRecords = await deletionService.getEligibleRecords(typedDataType, 100);

        logger.info('Data retention data type info retrieved successfully', {
            requestId,
            dataType: typedDataType,
            processingTime: Date.now() - startTime,
            eligibleRecordsCount: eligibleRecords.length
        });

        return NextResponse.json({
            success: true,
            dataType: typedDataType,
            policy: {
                retentionDays: policy.retentionDays,
                retentionYears: Math.round((policy.retentionDays / 365) * 10) / 10,
                notifyBeforeDeletion: policy.notifyBeforeDeletion,
                notificationDays: policy.notificationDays,
                allowAnonymization: policy.allowAnonymization,
                legalBasis: policy.legalBasis,
                description: policy.description,
                requiresManualReview: policy.requiresManualReview,
            },
            statistics: stats,
            eligibleRecords: {
                count: eligibleRecords.length,
                sample: eligibleRecords.slice(0, 10).map((record: RetentionEligibleRecord) => ({
                    id: record.id,
                    createdAt: record.createdAt,
                    lastAccessedAt: record.lastAccessedAt,
                    deletionDate: record.deletionDate,
                    notificationDate: record.notificationDate,
                })),
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error getting data type info', {
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
 * POST /api/data-retention/[dataType]
 * Process retention for a specific data type
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ dataType: string }> }
) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const { dataType } = await params;

        logger.info('Data retention data type processing request started', {
            requestId,
            endpoint: '/api/data-retention/[dataType]',
            method: 'POST',
            dataType: dataType
        });
        const body = await request.json();
        const { dryRun = false, adminUserId } = body;

        logger.debug('Data retention processing parameters', {
            requestId,
            dataType,
            dryRun,
            adminUserId
        });

        // Validate data type
        if (!Object.values(DataType).includes(dataType as DataType)) {
            logger.warn('Invalid data type for processing', {
                requestId,
                dataType,
                validDataTypes: Object.values(DataType)
            });
            return NextResponse.json({
                success: false,
                error: `Invalid dataType: ${dataType}`,
                validDataTypes: Object.values(DataType),
            }, { status: 400 });
        }

        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for processing', {
                requestId,
                dataType
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        const typedDataType = dataType as DataType;
        const deletionService = new DataRetentionDeletionService(prisma, { dryRun });

        // Process the data type
        const result = await deletionService.processDataRetention(typedDataType, adminUserId);

        logger.info('Data retention data type processing completed successfully', {
            requestId,
            dataType: typedDataType,
            dryRun,
            processingTime: Date.now() - startTime,
            totalProcessed: result.totalProcessed,
            successful: result.successful,
            failed: result.failed
        });

        return NextResponse.json({
            success: true,
            dataType: typedDataType,
            result,
            dryRun,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error processing data type', {
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
 * DELETE /api/data-retention/[dataType]
 * Force delete all records of a specific data type (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ dataType: string }> }
) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        const { dataType } = await params;

        logger.info('Data retention force delete request started', {
            requestId,
            endpoint: '/api/data-retention/[dataType]',
            method: 'DELETE',
            dataType: dataType
        });
        const body = await request.json();
        const { adminUserId, confirm = false } = body;

        logger.debug('Data retention force delete parameters', {
            requestId,
            dataType,
            adminUserId,
            confirm
        });

        // Validate data type
        if (!Object.values(DataType).includes(dataType as DataType)) {
            logger.warn('Invalid data type for force delete', {
                requestId,
                dataType,
                validDataTypes: Object.values(DataType)
            });
            return NextResponse.json({
                success: false,
                error: `Invalid dataType: ${dataType}`,
                validDataTypes: Object.values(DataType),
            }, { status: 400 });
        }

        // Require confirmation for force delete
        if (!confirm) {
            logger.warn('Force delete attempted without confirmation', {
                requestId,
                dataType
            });
            return NextResponse.json({
                success: false,
                error: 'Force delete requires confirmation. Set confirm: true in request body.',
            }, { status: 400 });
        }

        // Check if data retention is enabled
        if (!isDataRetentionEnabled()) {
            logger.warn('Data retention system is disabled for force delete', {
                requestId,
                dataType
            });
            return NextResponse.json({
                success: false,
                error: 'Data retention system is disabled',
                enabled: false,
            }, { status: 503 });
        }

        const typedDataType = dataType as DataType;
        const deletionService = new DataRetentionDeletionService(prisma, {
            dryRun: false,
            continueOnError: false,
        });

        // Get all records of this type (not just eligible ones)
        const allRecords = await deletionService.getEligibleRecords(typedDataType, 10000);

        if (allRecords.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No records found to delete',
                dataType: typedDataType,
                deletedCount: 0,
            });
        }

        // Process all records
        const result = await deletionService.processDataRetention(typedDataType, adminUserId);

        logger.info('Data retention force delete completed successfully', {
            requestId,
            dataType: typedDataType,
            processingTime: Date.now() - startTime,
            totalProcessed: result.totalProcessed,
            successful: result.successful,
            failed: result.failed
        });

        return NextResponse.json({
            success: true,
            dataType: typedDataType,
            result,
            message: `Force delete completed for ${typedDataType}`,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error force deleting data type', {
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
