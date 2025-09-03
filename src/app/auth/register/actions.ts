'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/lib/auth/validation'
import { prisma } from '@/lib/prisma'

export async function register(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    // Validate input
    const validatedData = registerSchema.parse(data)

    const { data: signUpData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    // Create user profile immediately after signup (even before email confirmation)
    if (signUpData.user) {
        try {
            await prisma.profile.upsert({
                where: { userId: signUpData.user.id },
                update: {
                    email: validatedData.email,
                    updatedAt: new Date()
                },
                create: {
                    userId: signUpData.user.id,
                    email: validatedData.email,
                    preferences: {},
                    subscription: { plan: 'free' }
                }
            })

            // Log the registration activity
            await prisma.userActivity.create({
                data: {
                    userId: signUpData.user.id,
                    action: 'user_registered',
                    resourceType: 'profile',
                    metadata: {
                        email: validatedData.email,
                        registrationMethod: 'email',
                        emailConfirmed: false
                    }
                }
            })
        } catch (profileError) {
            console.error('Error creating user profile during registration:', profileError)
            // Don't fail the registration if profile creation fails
            // The profile will be created in the callback as a fallback
        }
    }

    revalidatePath('/', 'layout')
    // Don't redirect - let the modal close naturally
}
