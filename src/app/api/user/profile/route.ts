import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/app/user/profile/actions'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const profile = await getProfile(user.id)

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}