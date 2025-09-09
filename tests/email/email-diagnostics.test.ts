import { createClient } from '@supabase/supabase-js'
import { describe, it, expect } from '@jest/globals'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

describe('Email Configuration Diagnostics', () => {
    let supabase: any

    beforeAll(() => {
        supabase = createClient(supabaseUrl, supabaseAnonKey)
    })

    it('should verify Supabase connection', async () => {
        console.log('🔍 Checking Supabase connection...')
        console.log(`📡 Supabase URL: ${supabaseUrl}`)
        console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)

        try {
            const { data, error } = await supabase.auth.getSession()
            console.log('✅ Supabase connection successful')
            console.log('📊 Current session:', data.session ? 'Active' : 'No active session')
        } catch (error) {
            console.error('❌ Supabase connection failed:', error)
            throw error
        }
    })

    it('should check email configuration requirements', () => {
        console.log('📧 Email Configuration Check:')
        console.log('='.repeat(50))

        // Check environment variables
        const requiredEnvVars = [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY',
            'SITE_NAME',
            'SITE_URL',
            'SUPPORT_EMAIL'
        ]

        requiredEnvVars.forEach(envVar => {
            const value = process.env[envVar]
            if (value) {
                console.log(`✅ ${envVar}: ${value}`)
            } else {
                console.log(`❌ ${envVar}: Missing`)
            }
        })

        console.log('='.repeat(50))
        console.log('📝 To fix email issues:')
        console.log('1. Check Supabase Dashboard > Authentication > Email Templates')
        console.log('2. Verify SMTP settings in Supabase Dashboard > Settings > Auth')
        console.log('3. Ensure email templates are properly configured')
        console.log('4. Check spam folder for test emails')
        console.log('5. Verify domain authentication if using custom SMTP')
    })

    it('should test email template variables', () => {
        console.log('📋 Email Template Variables:')
        console.log('='.repeat(50))

        const templateVars = {
            'SITE_NAME': process.env.SITE_NAME || 'JobBooster',
            'SITE_URL': process.env.SITE_URL || 'https://jobbooster.com',
            'SITE_DOMAIN': process.env.SITE_URL || 'https://jobbooster.com',
            'SUPPORT_EMAIL': process.env.SUPPORT_EMAIL || 'support@jobbooster.com',
            'CURRENT_YEAR': new Date().getFullYear().toString()
        }

        Object.entries(templateVars).forEach(([key, value]) => {
            console.log(`${key}: ${value}`)
        })

        console.log('='.repeat(50))
    })
})
