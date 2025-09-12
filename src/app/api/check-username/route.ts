import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Username check request started', {
        requestId,
        endpoint: '/api/check-username',
        method: 'POST'
    });

    try {
        const { username } = await request.json()

        logger.debug('Username check request details', {
            requestId,
            usernameLength: username?.length || 0,
            hasUsername: !!username
        });

        if (!username || username.length < 3) {
            logger.warn('Username validation failed - too short', {
                requestId,
                usernameLength: username?.length || 0
            });
            return NextResponse.json({ available: false, message: 'Username must be at least 3 characters' })
        }

        // Check if username exists
        const existingProfile = await prisma.profile.findUnique({
            where: { username }
        })

        const isAvailable = !existingProfile;
        const message = existingProfile ? 'Username is already taken' : 'Username is available';

        logger.info('Username check completed successfully', {
            requestId,
            username,
            isAvailable,
            processingTime: Date.now() - startTime
        });

        return NextResponse.json({
            available: isAvailable,
            message
        })
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error checking username', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json({ available: false, message: 'Error checking username' }, { status: 500 })
    }
}
