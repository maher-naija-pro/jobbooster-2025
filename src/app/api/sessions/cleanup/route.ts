import { NextRequest, NextResponse } from 'next/server'
import { runSessionCleanup } from '@/lib/auth/session-cleanup'

export async function POST(request: NextRequest) {
    try {
        const result = await runSessionCleanup()

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error in session cleanup API:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Session cleanup failed'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const result = await runSessionCleanup()

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error in session cleanup API:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message: 'Session cleanup failed'
            },
            { status: 500 }
        )
    }
}
