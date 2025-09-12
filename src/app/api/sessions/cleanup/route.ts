import { NextRequest, NextResponse } from 'next/server'
import { runSessionCleanup } from '@/lib/auth/session-cleanup'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Session cleanup POST request started', {
        requestId,
        endpoint: '/api/sessions/cleanup',
        method: 'POST'
    });

    try {
        const result = await runSessionCleanup()

        logger.info('Session cleanup POST completed successfully', {
            requestId,
            processingTime: Date.now() - startTime,
            success: result.success,
            cleanedSessions: result.cleanedSessions || 0
        });

        return NextResponse.json(result)
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error in session cleanup API', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Session cleanup failed'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Session cleanup GET request started', {
        requestId,
        endpoint: '/api/sessions/cleanup',
        method: 'GET'
    });

    try {
        const result = await runSessionCleanup()

        logger.info('Session cleanup GET completed successfully', {
            requestId,
            processingTime: Date.now() - startTime,
            success: result.success,
            cleanedSessions: result.cleanedSessions || 0
        });

        return NextResponse.json(result)
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error in session cleanup API', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Session cleanup failed'
            },
            { status: 500 }
        )
    }
}
