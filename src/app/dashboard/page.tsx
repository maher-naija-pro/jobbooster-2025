import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/app/user/profile/actions'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { isPricingEnabled } from '@/lib/feature-flags'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getProfile(user.id)

    const initials = profile?.fullName
        ? profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        : user.email?.charAt(0).toUpperCase() || 'U'

    const subscription = profile?.subscription || { plan: 'free' }
    const preferences = profile?.preferences || {}

    return (
        <DashboardClient
            profile={profile}
            user={user}
            subscription={subscription}
            preferences={preferences}
            initials={initials}
        />
    )
}