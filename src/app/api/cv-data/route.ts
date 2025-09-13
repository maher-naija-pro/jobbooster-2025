import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { generateAnonymousSessionId } from '@/lib/anonymous-session';

// GET - Retrieve CV data by ID or list all CVs for user
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('CV Data GET request started', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'GET'
    });

    // Mac-specific logging
    logger.macProcessStart('CV Data GET Request', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'GET'
    });

    try {
        const { searchParams } = new URL(request.url);
        const cvId = searchParams.get('id');
        const userId = searchParams.get('userId');
        const includeArchived = searchParams.get('includeArchived') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const currentUserId = user?.id || generateAnonymousSessionId();

        // If specific CV ID requested
        if (cvId) {
            const cvData = await prisma.cvData.findFirst({
                where: {
                    id: cvId,
                    userId: isAuthenticated ? currentUserId : undefined,
                    isDeleted: false,
                    ...(includeArchived ? {} : { isArchived: false })
                },
                include: {
                    profile: {
                        select: {
                            fullName: true,
                            email: true,
                            username: true
                        }
                    }
                }
            });

            if (!cvData) {
                logger.warn('CV data not found', {
                    requestId,
                    cvId,
                    userId: currentUserId,
                    isAuthenticated
                });
                return NextResponse.json(
                    { error: 'CV data not found' },
                    { status: 404 }
                );
            }

            logger.info('CV data retrieved successfully', {
                requestId,
                cvId,
                processingTime: Date.now() - startTime
            });

            // Mac-specific file operation logging
            logger.macFileOperation('CV Data Retrieval', cvId, {
                requestId,
                cvId,
                processingTime: Date.now() - startTime
            });

            return NextResponse.json({
                success: true,
                data: cvData,
                processingTime: Date.now() - startTime
            });
        }

        // List CVs for user
        const whereClause: any = {
            userId: isAuthenticated ? currentUserId : undefined,
            isDeleted: false,
            ...(includeArchived ? {} : { isArchived: false })
        };

        // If userId provided and user is authenticated, allow viewing other user's public CVs
        if (userId && isAuthenticated && userId !== currentUserId) {
            whereClause.isPublic = true;
            whereClause.userId = userId;
        }

        const [cvDataList, totalCount] = await Promise.all([
            prisma.cvData.findMany({
                where: whereClause,
                orderBy: [
                    { isLatest: 'desc' },
                    { createdAt: 'desc' }
                ],
                take: limit,
                skip: offset,
                include: {
                    profile: {
                        select: {
                            fullName: true,
                            email: true,
                            username: true
                        }
                    }
                }
            }),
            prisma.cvData.count({ where: whereClause })
        ]);

        logger.info('CV data list retrieved successfully', {
            requestId,
            count: cvDataList.length,
            totalCount,
            processingTime: Date.now() - startTime
        });

        // Mac-specific process completion logging
        logger.macProcessEnd('CV Data GET Request', Date.now() - startTime, {
            requestId,
            count: cvDataList.length,
            totalCount,
            limit,
            offset
        });

        return NextResponse.json({
            success: true,
            data: cvDataList,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount
            },
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Error retrieving CV data', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        // Mac-specific error logging
        logger.macError(error instanceof Error ? error : new Error(String(error)), {
            requestId,
            component: 'cv_data_get',
            operation: 'retrieve_data',
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to retrieve CV data' },
            { status: 500 }
        );
    }
}

// POST - Create new CV data record (non-LLM fields only)
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('CV Data POST request started', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'POST'
    });

    // Mac-specific logging
    logger.macProcessStart('CV Data POST Request', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'POST'
    });

    try {
        const body = await request.json();
        const {
            // File information
            fileName,
            fileUrl,
            fileSize,
            mimeType,
            extractedText,

            // Personal information (non-LLM fields)
            firstName,
            lastName,
            fullName,
            email,
            phone,
            nationality,
            linkedinUrl,
            websiteUrl,
            githubUrl,

            // Basic metadata
            isPublic = false,
            gdprConsent = false,
            dataClassification = 'internal',

            // Additional metadata
            metadata = {}
        } = body;

        // Validate required fields
        if (!fileName || !fileUrl) {
            logger.warn('Missing required fields', {
                requestId,
                hasFileName: !!fileName,
                hasFileUrl: !!fileUrl
            });
            return NextResponse.json(
                { error: 'fileName and fileUrl are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const userId = user?.id || generateAnonymousSessionId();

        // Create CV data record with non-LLM fields only
        const cvData = await prisma.cvData.create({
            data: {
                userId,
                fileName,
                fileUrl,
                fileSize: fileSize || null,
                mimeType: mimeType || null,
                extractedText: extractedText || null,

                // Personal information (non-LLM fields)
                firstName: firstName || null,
                lastName: lastName || null,
                fullName: fullName || null,
                email: email || null,
                phone: phone || null,
                nationality: nationality || null,
                linkedinUrl: linkedinUrl || null,
                websiteUrl: websiteUrl || null,
                githubUrl: githubUrl || null,

                // Status and processing
                processingStatus: 'UPLOADED',
                processingStartedAt: new Date(),
                processingCompletedAt: new Date(),

                // Privacy and compliance
                isPublic,
                gdprConsent: isAuthenticated ? gdprConsent : false,
                dataClassification,

                // Metadata
                metadata: {
                    ...metadata,
                    createdVia: 'api',
                    requestId,
                    processingTime: Date.now() - startTime,
                    isAuthenticated,
                    createdAt: new Date().toISOString()
                },

                // Default values
                viewCount: 0,
                analysisCount: 0,
                isActive: true,
                isArchived: false,
                isDeleted: false,
                isLatest: true,
                version: 1
            }
        });

        logger.info('CV data created successfully', {
            requestId,
            cvId: cvData.id,
            fileName,
            processingTime: Date.now() - startTime
        });

        // Mac-specific file operation logging
        logger.macFileOperation('CV Data Creation', fileName, {
            requestId,
            cvId: cvData.id,
            fileName,
            processingTime: Date.now() - startTime
        });

        // Mac-specific process completion logging
        logger.macProcessEnd('CV Data POST Request', Date.now() - startTime, {
            requestId,
            cvId: cvData.id,
            fileName
        });

        return NextResponse.json({
            success: true,
            data: cvData,
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Error creating CV data', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        // Mac-specific error logging
        logger.macError(error instanceof Error ? error : new Error(String(error)), {
            requestId,
            component: 'cv_data_post',
            operation: 'create_data',
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to create CV data' },
            { status: 500 }
        );
    }
}

// PUT - Update CV data (non-LLM fields only)
export async function PUT(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('CV Data PUT request started', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'PUT'
    });

    // Mac-specific logging
    logger.macProcessStart('CV Data PUT Request', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'PUT'
    });

    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            logger.warn('Missing CV ID for update', { requestId });
            return NextResponse.json(
                { error: 'CV ID is required for update' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const currentUserId = user?.id || generateAnonymousSessionId();

        // Check if CV exists and user has permission to update
        const existingCv = await prisma.cvData.findFirst({
            where: {
                id,
                userId: isAuthenticated ? currentUserId : undefined,
                isDeleted: false
            }
        });

        if (!existingCv) {
            logger.warn('CV not found or no permission to update', {
                requestId,
                cvId: id,
                userId: currentUserId,
                isAuthenticated
            });
            return NextResponse.json(
                { error: 'CV not found or no permission to update' },
                { status: 404 }
            );
        }

        // Filter out LLM-generated fields that should only be updated via LLM endpoint
        const allowedFields = [
            'firstName', 'lastName', 'fullName', 'email', 'phone', 'nationality',
            'linkedinUrl', 'websiteUrl', 'githubUrl', 'isPublic', 'gdprConsent',
            'dataClassification', 'metadata'
        ];

        const filteredUpdateData: any = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdateData[key] = updateData[key];
            }
        });

        // Add update metadata
        filteredUpdateData.metadata = {
            ...(existingCv.metadata as Record<string, any> || {}),
            ...(filteredUpdateData.metadata as Record<string, any> || {}),
            lastUpdatedVia: 'api',
            lastUpdateRequestId: requestId,
            lastUpdateTime: new Date().toISOString()
        };

        const updatedCv = await prisma.cvData.update({
            where: { id },
            data: {
                ...filteredUpdateData,
                updatedAt: new Date()
            }
        });

        logger.info('CV data updated successfully', {
            requestId,
            cvId: id,
            processingTime: Date.now() - startTime
        });

        // Mac-specific file operation logging
        logger.macFileOperation('CV Data Update', id, {
            requestId,
            cvId: id,
            processingTime: Date.now() - startTime
        });

        // Mac-specific process completion logging
        logger.macProcessEnd('CV Data PUT Request', Date.now() - startTime, {
            requestId,
            cvId: id
        });

        return NextResponse.json({
            success: true,
            data: updatedCv,
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Error updating CV data', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        // Mac-specific error logging
        logger.macError(error instanceof Error ? error : new Error(String(error)), {
            requestId,
            component: 'cv_data_put',
            operation: 'update_data',
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to update CV data' },
            { status: 500 }
        );
    }
}

// DELETE - Soft delete CV data
export async function DELETE(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('CV Data DELETE request started', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'DELETE'
    });

    // Mac-specific logging
    logger.macProcessStart('CV Data DELETE Request', {
        requestId,
        endpoint: '/api/cv-data',
        method: 'DELETE'
    });

    try {
        const { searchParams } = new URL(request.url);
        const cvId = searchParams.get('id');

        if (!cvId) {
            logger.warn('Missing CV ID for deletion', { requestId });
            return NextResponse.json(
                { error: 'CV ID is required for deletion' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const currentUserId = user?.id || generateAnonymousSessionId();

        // Check if CV exists and user has permission to delete
        const existingCv = await prisma.cvData.findFirst({
            where: {
                id: cvId,
                userId: isAuthenticated ? currentUserId : undefined,
                isDeleted: false
            }
        });

        if (!existingCv) {
            logger.warn('CV not found or no permission to delete', {
                requestId,
                cvId,
                userId: currentUserId,
                isAuthenticated
            });
            return NextResponse.json(
                { error: 'CV not found or no permission to delete' },
                { status: 404 }
            );
        }

        // Soft delete the CV
        const deletedCv = await prisma.cvData.update({
            where: { id: cvId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                metadata: {
                    ...(existingCv.metadata as Record<string, any> || {}),
                    deletedVia: 'api',
                    deletedBy: isAuthenticated ? currentUserId : 'anonymous',
                    deletionRequestId: requestId,
                    deletionTime: new Date().toISOString()
                }
            }
        });

        logger.info('CV data deleted successfully', {
            requestId,
            cvId,
            processingTime: Date.now() - startTime
        });

        // Mac-specific file operation logging
        logger.macFileOperation('CV Data Deletion', cvId, {
            requestId,
            cvId,
            processingTime: Date.now() - startTime
        });

        // Mac-specific process completion logging
        logger.macProcessEnd('CV Data DELETE Request', Date.now() - startTime, {
            requestId,
            cvId
        });

        return NextResponse.json({
            success: true,
            message: 'CV data deleted successfully',
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Error deleting CV data', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        // Mac-specific error logging
        logger.macError(error instanceof Error ? error : new Error(String(error)), {
            requestId,
            component: 'cv_data_delete',
            operation: 'delete_data',
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to delete CV data' },
            { status: 500 }
        );
    }
}
