import { createClient } from '@/lib/supabase/server'

export async function currentUser() {
    const supabase = await createClient()

    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.error('Error getting current user:', error)
            return null
        }

        return user
    } catch (error) {
        console.error('Error in currentUser function:', error)
        return null
    }
}
