import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json()

        if (!username || username.length < 3) {
            return NextResponse.json({ available: false, message: 'Username must be at least 3 characters' })
        }

        // Check if username exists
        const existingProfile = await prisma.profile.findUnique({
            where: { username }
        })

        return NextResponse.json({
            available: !existingProfile,
            message: existingProfile ? 'Username is already taken' : 'Username is available'
        })
    } catch (error) {
        console.error('Error checking username:', error)
        return NextResponse.json({ available: false, message: 'Error checking username' }, { status: 500 })
    }
}
