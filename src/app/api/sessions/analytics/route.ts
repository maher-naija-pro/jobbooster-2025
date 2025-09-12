import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSessionAnalytics } from '@/lib/auth/session-manager'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('Session analytics request started', {
        requestId,
        endpoint: '/api/sessions/analytics',
        method: 'GET'
    });

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Unauthorized session analytics request', {
                requestId,
                step: 'authentication'
            });
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        logger.debug('User authenticated for session analytics', {
            requestId,
            userId: user.id,
            step: 'authentication'
        });

        const analytics = await getSessionAnalytics(user.id)

        logger.info('Session analytics retrieved successfully', {
            requestId,
            userId: user.id,
            processingTime: Date.now() - startTime,
            hasAnalytics: !!analytics
        });

        return NextResponse.json({
            success: true,
            data: analytics
        })
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error getting session analytics', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Failed to get session analytics'
            },
            { status: 500 }
        )
    }
}
