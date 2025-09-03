# Authentication Feature

**Key Feature**: Users can access the main application page without registration or login. Authentication is only required when users attempt to use CV analysis features (all other features don't need authentication), at which point a popup modal prompts them to register or login.

## Modern Supabase Authentication Implementation

This document outlines the modern authentication patterns using the latest Supabase Auth API with Next.js 15+ and the `@supabase/ssr` package.

### 1. **Review the Specification**
Start with the feature specification to understand:
- What features need to be built
- Anonymous access requirements
- Authentication triggers for specific features

### 2. **Study the Architecture**
Review the technical architecture for:
- Component structure and relationships
- Database design 
- API endpoints and middleware
- State management patterns

## Core Authentication Features

### Modern Authentication Stack
- [ ] **Supabase SSR Setup** - Using `@supabase/ssr` package for server-side authentication
- [ ] **Anonymous Access** - Allow users to browse without authentication
- [ ] **Authentication Modal** - Popup modal for CV analysis features
- [ ] **Email/Password Auth** - Traditional authentication with modern patterns

- [ ] **OAuth Integration** - Google, GitHub, and other providers
- [ ] **Profile Management** - User profile with avatar upload
- [ ] **Email Validation** - Configurable email verification
- [ ] **User Dashboard** - Protected user area



## Key Technologies

### Modern Stack (2024-2025)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Frontend**: Next.js 15.5.2 + React 19.1.0 + TypeScript
- **Authentication**: `@supabase/ssr` package for server-side auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database ORM**: Prisma (type-safe database operations)
- **State Management**: React Context + Supabase Client




## Database Schema

### Core Tables

#### User Management
- `profiles` - User profile information (name, avatar, preferences, settings)
- `user_sessions` - Session tracking and analytics (login/logout times, device info)
- `user_activity` - Activity logs and audit trail (feature usage, page visits)
- `user_preferences` - User settings and customization options
- `user_notifications` - Notification preferences and delivery status

#### Authentication & Security
- `auth_providers` - OAuth provider configurations (Google, GitHub, etc.)
- `user_auth_methods` - Track which auth methods user has enabled
- `password_reset_tokens` - Secure password reset token storage
- `email_verification_tokens` - Email verification token management

#### Content & Data
- `cv_data` - User's uploaded CV data and metadata
- `generated_content` - AI-generated content history and versions
- `file_uploads` - File storage metadata and access controls




## Modern API Endpoints & Patterns

### Authentication Endpoints (Server Actions)
```typescript
// Modern Next.js App Router patterns with Server Actions
- `app/auth/login/actions.ts` - Server Action for login
- `app/auth/register/actions.ts` - Server Action for registration  
- `app/auth/logout/actions.ts` - Server Action for logout
- `app/auth/confirm/route.ts` - Email confirmation handler
- `app/auth/callback/route.ts` - OAuth callback handler
```

### User Management (Server Actions)
```typescript
- `app/user/profile/actions.ts` - Profile management actions
- `app/user/preferences/actions.ts` - User preferences actions
- `app/user/avatar/actions.ts` - Avatar upload actions
```

### Modern Authentication Methods
```typescript
// Email/Password Authentication
await supabase.auth.signInWithPassword({ email, password })
await supabase.auth.signUp({ email, password })



```
components/
├── auth/
│   ├── auth-modal.tsx         # Authentication modal for anonymous users
│   ├── auth-form.tsx          # Modern login/signup form with Server Actions

│   ├── oauth-buttons.tsx      # Social login buttons
│   └── auth-provider.tsx      # Authentication context with SSR support
├── user/
│   ├── user-profile.tsx       # Profile management with Server Actions
│   ├── user-dashboard.tsx     # Protected user dashboard
│   ├── user-preferences.tsx   # Settings management
│   └── avatar-upload.tsx      # Profile picture upload with Supabase Storage
├── protected/
│   ├── protected-route.tsx    # Route protection wrapper
│   ├── auth-guard.tsx         # Authentication guard component
│   └── anonymous-guard.tsx    # Anonymous access guard
└── ui/
    ├── loading-spinner.tsx    # Loading states
    ├── error-boundary.tsx     # Error handling
    └── notification.tsx       # User notifications
```

### Server-Side Utilities
```
utils/
├── supabase/
│   ├── client.ts              # Browser client for client components
│   ├── server.ts              # Server client for server components
│   └── middleware.ts          # Middleware for session management
└── auth/
    ├── session.ts             # Session management utilities
    └── validation.ts          # Input validation schemas
```

## Environment Variables

### Modern Supabase Configuration
```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication Flow Configuration
ENABLE_ANONYMOUS_ACCESS=true
AUTH_REQUIRED_FEATURES=cv_analysis,content_generation

# Email Configuration
REQUIRE_EMAIL_VERIFICATION=true
EMAIL_VALIDATION_STRICT=true
ALLOW_DISPOSABLE_EMAILS=false

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Modern Supabase Client Setup
```typescript
// utils/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// utils/supabase/server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}
```

## Modern Authentication Patterns

### 1. Server-Side Authentication with Middleware
```typescript
// middleware.ts - Automatic session refresh
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 2. Server Actions for Authentication
```typescript
// app/auth/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```


### 4. OAuth Authentication
```typescript
// app/auth/oauth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { url: data.url }
}
```

### 5. Protected Routes with Server Components
```typescript
// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

### 6. Anonymous Access with Feature Gating
```typescript
// components/auth/feature-gate.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AuthModal } from './auth-modal'

interface FeatureGateProps {
  children: React.ReactNode
  feature: string
}

export function FeatureGate({ children, feature }: FeatureGateProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()
  
  const handleFeatureAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setShowAuthModal(true)
      return
    }
    
    // User is authenticated, allow access
  }

  return (
    <>
      <div onClick={handleFeatureAccess}>
        {children}
      </div>
      
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          feature={feature}
        />
      )}
    </>
  )
}
```

## Testing Strategy

## Monitoring & Analytics








---

## Next Steps

### Implementation Roadmap

1. **Project Setup**
   - [ ] Create Supabase project and configure environment variables
   - [ ] Install required packages: `@supabase/ssr`, `@supabase/supabase-js`
   - [ ] Configure email templates and OAuth providers

2. **Core Authentication**
   - [ ] Implement Supabase client utilities (client.ts, server.ts, middleware.ts)
   - [ ] Create authentication Server Actions
   - [ ] Build authentication modal component
   - [ ] Implement anonymous access with feature gating

3. **Authentication Methods**
   - [ ] Email/password authentication
   - [ ] OAuth integration (Google)

4. **User Management**
   - [ ] User profile management
   - [ ] Avatar upload with Supabase Storage
   - [ ] User preferences and settings
   - [ ] Protected dashboard


### Key Resources
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Server-Side Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase SSR Package](https://github.com/supabase/ssr)
- [Modern Authentication Patterns](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)


