import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { generateAnonymousSessionId } from '@/lib/anonymous-session';

// GET - Retrieve generated content data by user
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Generated Content GET request started', {
        requestId,
        endpoint: '/api/generated-content',
        method: 'GET'
    });

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const includeArchived = searchParams.get('includeArchived') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const type = searchParams.get('type'); // Filter by content type

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const currentUserId = user?.id || generateAnonymousSessionId();

        // Build where clause
        const whereClause: any = {
            userId: currentUserId,
            isDeleted: false,
            ...(includeArchived ? {} : { isArchived: false })
        };

        // If userId provided and user is authenticated, allow viewing other user's public content
        if (userId && isAuthenticated && userId !== currentUserId) {
            whereClause.isPublic = true;
            whereClause.userId = userId;
        }

        // Add type filter if provided
        if (type) {
            whereClause.type = type;
        }

        const [contentList, totalCount] = await Promise.all([
            prisma.generatedContent.findMany({
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
            prisma.generatedContent.count({ where: whereClause })
        ]);

        logger.info('Generated content list retrieved successfully', {
            requestId,
            count: contentList.length,
            totalCount,
            processingTime: Date.now() - startTime
        });

        return NextResponse.json({
            success: true,
            data: contentList,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount
            },
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Failed to retrieve generated content', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to retrieve generated content' },
            { status: 500 }
        );
    }
}

// POST - Create new generated content record
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Generated Content POST request started', {
        requestId,
        endpoint: '/api/generated-content',
        method: 'POST'
    });

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        const currentUserId = user?.id || generateAnonymousSessionId();

        const body = await request.json();
        const {
            type,
            title,
            content,
            cvDataId,
            jobDataId,
            metadata,
            confidenceScore,
            qualityScore,
            wordCount,
            readingTime
        } = body;

        // Validate required fields
        if (!type || !content) {
            return NextResponse.json(
                { error: 'Missing required fields: type and content' },
                { status: 400 }
            );
        }

        const newContent = await prisma.generatedContent.create({
            data: {
                userId: currentUserId,
                type: type as any,
                title: title || null,
                content: content,
                cvDataId: cvDataId || null,
                jobDataId: jobDataId || null,
                metadata: metadata || null,
                confidenceScore: confidenceScore || null,
                qualityScore: qualityScore || null,
                wordCount: wordCount || null,
                readingTime: readingTime || null,
                processingStatus: 'COMPLETED',
                isActive: true,
                isArchived: false,
                isDeleted: false,
                isPublic: false,
                isLatest: true,
                viewCount: 0,
                copyCount: 0,
                version: 1,
                gdprConsent: isAuthenticated,
                dataClassification: 'internal'
            }
        });

        logger.info('Generated content created successfully', {
            requestId,
            contentId: newContent.id,
            type: newContent.type,
            processingTime: Date.now() - startTime
        });

        return NextResponse.json({
            success: true,
            data: newContent,
            processingTime: Date.now() - startTime
        });

    } catch (error) {
        logger.error('Failed to create generated content', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: Date.now() - startTime
        });

        return NextResponse.json(
            { error: 'Failed to create generated content' },
            { status: 500 }
        );
    }
}
