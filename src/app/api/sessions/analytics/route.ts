import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSessionAnalytics } from '@/lib/auth/session-manager'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const analytics = await getSessionAnalytics(user.id)

        return NextResponse.json({
            success: true,
            data: analytics
        })
    } catch (error) {
        console.error('Error getting session analytics:', error)
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
