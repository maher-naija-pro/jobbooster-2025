import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createUserSession } from '@/lib/auth/session-manager'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const startTime = Date.now()
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'
  // Check if this is a popup OAuth flow
  const isPopup = searchParams.get('popup') === 'true'

  logger.info('Auth callback initiated', {
    action: 'auth_callback',
    step: 'callback_received',
    hasCode: !!code,
    next: next,
    origin: origin,
    timestamp: new Date().toISOString()
  })

  if (code) {
    const supabase = await createClient()
    logger.debug('Supabase client created for auth callback', {
      action: 'auth_callback',
      step: 'supabase_client_created'
    })

    logger.debug('Exchanging code for session', {
      action: 'auth_callback',
      step: 'session_exchange_initiated',
      codeLength: code.length
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      logger.info('Code exchanged for session successfully', {
        action: 'auth_callback',
        step: 'session_exchange_success'
      })

      // Get the user after successful session exchange
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        logger.info('User retrieved after session exchange', {
          action: 'auth_callback',
          step: 'user_retrieved',
          userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
          userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null',
          emailConfirmed: !!user.email_confirmed_at
        })
        // Update user profile after email confirmation (profile may already exist from registration)
        const registrationMethod = user.app_metadata?.provider || 'email'
        const additionalData = {
          fullName: user.user_metadata?.full_name || user.user_metadata?.name,
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture
        }

        logger.debug('Updating user profile after email confirmation', {
          action: 'auth_callback',
          step: 'profile_update_initiated',
          userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
          registrationMethod: registrationMethod,
          hasFullName: !!additionalData.fullName,
          hasAvatarUrl: !!additionalData.avatarUrl
        })

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

          logger.info('User profile updated successfully', {
            action: 'auth_callback',
            step: 'profile_update_success',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null'
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

          logger.info('Email confirmation activity logged', {
            action: 'auth_callback',
            step: 'activity_logged',
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            registrationMethod: registrationMethod
          })

          // Create user session for analytics tracking
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            logger.debug('Creating user session for analytics tracking', {
              action: 'auth_callback',
              step: 'session_creation_initiated',
              userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
            })

            await createUserSession(user, session.access_token, request)

            logger.info('User session created for analytics tracking', {
              action: 'auth_callback',
              step: 'session_creation_success',
              userId: user.id ? `${user.id.substring(0, 8)}...` : 'null'
            })
          }
        } catch (profileError) {
          logger.error('Error updating user profile after email confirmation', {
            action: 'auth_callback',
            step: 'profile_update_failed',
            error: profileError instanceof Error ? profileError.message : 'Unknown profile error',
            stack: profileError instanceof Error ? profileError.stack : undefined,
            userId: user.id ? `${user.id.substring(0, 8)}...` : 'null',
            userEmail: user.email ? `${user.email.substring(0, 3)}***@${user.email.split('@')[1]}` : 'null'
          })
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const redirectUrl = isLocalEnv
        ? `${origin}${next}`
        : forwardedHost
          ? `https://${forwardedHost}${next}`
          : `${origin}${next}`

      logger.info('Auth callback completed successfully, redirecting user', {
        action: 'auth_callback',
        step: 'redirect_user',
        redirectUrl: redirectUrl,
        isLocalEnv: isLocalEnv,
        hasForwardedHost: !!forwardedHost,
        isPopup: isPopup,
        duration: `${Date.now() - startTime}ms`
      })

      // If this is a popup, return HTML that communicates with parent window
      if (isPopup) {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Authentication Complete</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 12px;
                  backdrop-filter: blur(10px);
                }
                .spinner {
                  border: 3px solid rgba(255, 255, 255, 0.3);
                  border-radius: 50%;
                  border-top: 3px solid white;
                  width: 40px;
                  height: 40px;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 1rem;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="spinner"></div>
                <h2>Authentication Successful!</h2>
                <p>You can close this window now.</p>
              </div>
              <script>
                // Notify parent window of successful authentication
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_OAUTH_SUCCESS',
                    data: { success: true }
                  }, window.location.origin);
                  
                  // Close the popup after a short delay
                  setTimeout(() => {
                    window.close();
                  }, 1000);
                } else {
                  // If no opener, redirect to the main app
                  window.location.href = '${redirectUrl}';
                }
              </script>
            </body>
          </html>
        `
        return new NextResponse(html, {
          headers: { 'Content-Type': 'text/html' },
        })
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      logger.error('Code exchange for session failed', {
        action: 'auth_callback',
        step: 'session_exchange_failed',
        error: error.message,
        errorCode: error.status,
        isPopup: isPopup,
        duration: `${Date.now() - startTime}ms`
      })

      // If this is a popup, return HTML that communicates error to parent window
      if (isPopup) {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Authentication Error</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 12px;
                  backdrop-filter: blur(10px);
                }
                .error-icon {
                  font-size: 3rem;
                  margin-bottom: 1rem;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="error-icon">⚠️</div>
                <h2>Authentication Failed</h2>
                <p>There was an error during authentication. Please try again.</p>
              </div>
              <script>
                // Notify parent window of authentication error
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_OAUTH_ERROR',
                    error: 'Authentication failed. Please try again.'
                  }, window.location.origin);
                  
                  // Close the popup after a short delay
                  setTimeout(() => {
                    window.close();
                  }, 2000);
                } else {
                  // If no opener, redirect to the main app
                  window.location.href = '${origin}';
                }
              </script>
            </body>
          </html>
        `
        return new NextResponse(html, {
          headers: { 'Content-Type': 'text/html' },
        })
      }
    }
  } else {
    logger.warn('Auth callback received without code', {
      action: 'auth_callback',
      step: 'no_code_received',
      isPopup: isPopup,
      duration: `${Date.now() - startTime}ms`
    })

    // If this is a popup, return HTML that communicates error to parent window
    if (isPopup) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Error</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                color: white;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(10px);
              }
              .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error-icon">⚠️</div>
              <h2>Authentication Error</h2>
              <p>No authentication code received. Please try again.</p>
            </div>
            <script>
              // Notify parent window of authentication error
              if (window.opener) {
                window.opener.postMessage({
                  type: 'GOOGLE_OAUTH_ERROR',
                  error: 'No authentication code received. Please try again.'
                }, window.location.origin);
                
                // Close the popup after a short delay
                setTimeout(() => {
                  window.close();
                }, 2000);
              } else {
                // If no opener, redirect to the main app
                window.location.href = '${origin}';
              }
            </script>
          </body>
        </html>
      `
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      })
    }
  }

  // return the user to an error page with instructions
  logger.warn('Redirecting to auth error page', {
    action: 'auth_callback',
    step: 'redirect_to_error',
    isPopup: isPopup,
    duration: `${Date.now() - startTime}ms`
  })
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
