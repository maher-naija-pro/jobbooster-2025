import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.info('User profile request started', {
        requestId,
        endpoint: '/api/user/profile',
        method: 'GET'
    });

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Unauthorized profile request', {
                requestId,
                step: 'authentication'
            });
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        logger.debug('User authenticated for profile request', {
            requestId,
            userId: user.id,
            step: 'authentication'
        });

        const profile = await getProfile(user.id)

        logger.info('User profile retrieved successfully', {
            requestId,
            userId: user.id,
            processingTime: Date.now() - startTime,
            hasProfile: !!profile
        });

        return NextResponse.json({ profile })
    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Error fetching profile', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime
        });
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}