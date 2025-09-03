'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/auth/validation'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Validate input
    const validatedData = loginSchema.parse(data)

    const { error } = await supabase.auth.signInWithPassword(validatedData)

    if (error) {
        redirect('/error?message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    // Don't redirect - let the user stay on the current page
    // The AuthModal will close automatically due to the onSuccess callback
}
