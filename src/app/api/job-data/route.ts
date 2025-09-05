import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/job-data - Get all job data for the current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const isArchived = searchParams.get('archived') === 'true';

        const skip = (page - 1) * limit;

        const where = {
            userId: session.user.id,
            ...(status && { processingStatus: status }),
            ...(isArchived !== null && { isArchived }),
        };

        const [jobData, total] = await Promise.all([
            prisma.jobData.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.jobData.count({ where }),
        ]);

        return NextResponse.json({
            data: jobData,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching job data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job data' },
            { status: 500 }
        );
    }
}

// POST /api/job-data - Create new job data
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            content,
            title,
            company,
            jobType,
            location,
            remoteType,
            salaryRange,
            experienceLevel,
            industry,
            department,
            employmentType,
            dataClassification = 'internal',
        } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const jobData = await prisma.jobData.create({
            data: {
                userId: session.user.id,
                content,
                title,
                company,
                jobType,
                location,
                remoteType,
                salaryRange,
                experienceLevel,
                industry,
                department,
                employmentType,
                dataClassification,
                processingStatus: 'uploaded',
                status: 'uploaded',
            },
        });

        return NextResponse.json(jobData, { status: 201 });
    } catch (error) {
        console.error('Error creating job data:', error);
        return NextResponse.json(
            { error: 'Failed to create job data' },
            { status: 500 }
        );
    }
}
