import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the user after successful session exchange
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Update user profile after email confirmation (profile may already exist from registration)
        const registrationMethod = user.app_metadata?.provider || 'email'
        const additionalData = {
          fullName: user.user_metadata?.full_name || user.user_metadata?.name,
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture
        }

        try {
          // Update existing profile or create new one
          await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
              email: user.email!,
              ...(additionalData.fullName && { fullName: additionalData.fullName }),
              ...(additionalData.avatarUrl && { avatarUrl: additionalData.avatarUrl }),
              updatedAt: new Date()
            },
            create: {
              userId: user.id,
              email: user.email!,
              fullName: additionalData.fullName,
              avatarUrl: additionalData.avatarUrl,
              preferences: {},
              subscription: { plan: 'free' }
            }
          })

          // Log the email confirmation activity
          await prisma.userActivity.create({
            data: {
              userId: user.id,
              action: 'email_confirmed',
              resourceType: 'profile',
              metadata: {
                email: user.email,
                registrationMethod,
                provider: user.app_metadata?.provider,
                ...additionalData
              }
            }
          })
        } catch (profileError) {
          console.error('Error updating user profile after email confirmation:', profileError)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
