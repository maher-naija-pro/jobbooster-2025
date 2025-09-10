import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { consent, consentDate, consentVersion } = body

        // Validate consent data
        if (!consent || typeof consent !== 'object') {
            return NextResponse.json(
                { error: 'Invalid consent data' },
                { status: 400 }
            )
        }

        // Update user consent in database
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                gdprConsent: true,
                consentDate: new Date(consentDate),
                consentVersion: consentVersion || '1.0',
                preferences: {
                    ...consent,
                    lastUpdated: new Date().toISOString()
                }
            },
            create: {
                userId: user.id,
                email: user.email!,
                gdprConsent: true,
                consentDate: new Date(consentDate),
                consentVersion: consentVersion || '1.0',
                preferences: {
                    ...consent,
                    lastUpdated: new Date().toISOString()
                }
            }
        })

        // Log consent update activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'consent_updated',
                resourceType: 'privacy',
                metadata: {
                    consent,
                    consentDate,
                    consentVersion
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Consent updated successfully'
        })

    } catch (error) {
        console.error('Error updating consent:', error)
        return NextResponse.json(
            { error: 'Failed to update consent' },
            { status: 500 }
        )
    }
}

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

        // Get user consent data
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
            select: {
                gdprConsent: true,
                consentDate: true,
                consentVersion: true,
                preferences: true
            }
        })

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            consent: profile.preferences,
            consentDate: profile.consentDate,
            consentVersion: profile.consentVersion,
            gdprConsent: profile.gdprConsent
        })

    } catch (error) {
        console.error('Error fetching consent:', error)
        return NextResponse.json(
            { error: 'Failed to fetch consent' },
            { status: 500 }
        )
    }
}
