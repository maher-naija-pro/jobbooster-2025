import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/job-data/[id] - Get specific job data
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jobData = await prisma.jobData.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!jobData) {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.jobData.update({
            where: { id: params.id },
            data: { viewCount: { increment: 1 } },
        });

        return NextResponse.json(jobData);
    } catch (error) {
        console.error('Error fetching job data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job data' },
            { status: 500 }
        );
    }
}

// PUT /api/job-data/[id] - Update job data
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            dataClassification,
            isPublic,
            isActive,
            isArchived,
        } = body;

        // Check if job data exists and belongs to user
        const existingJobData = await prisma.jobData.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingJobData) {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }

        const updateData: any = {};

        if (content !== undefined) updateData.content = content;
        if (title !== undefined) updateData.title = title;
        if (company !== undefined) updateData.company = company;
        if (jobType !== undefined) updateData.jobType = jobType;
        if (location !== undefined) updateData.location = location;
        if (remoteType !== undefined) updateData.remoteType = remoteType;
        if (salaryRange !== undefined) updateData.salaryRange = salaryRange;
        if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
        if (industry !== undefined) updateData.industry = industry;
        if (department !== undefined) updateData.department = department;
        if (employmentType !== undefined) updateData.employmentType = employmentType;
        if (dataClassification !== undefined) updateData.dataClassification = dataClassification;
        if (isPublic !== undefined) updateData.isPublic = isPublic;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isArchived !== undefined) {
            updateData.isArchived = isArchived;
            if (isArchived) {
                updateData.archiveDate = new Date();
            }
        }

        const updatedJobData = await prisma.jobData.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(updatedJobData);
    } catch (error) {
        console.error('Error updating job data:', error);
        return NextResponse.json(
            { error: 'Failed to update job data' },
            { status: 500 }
        );
    }
}

// DELETE /api/job-data/[id] - Delete job data
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if job data exists and belongs to user
        const existingJobData = await prisma.jobData.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingJobData) {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }

        await prisma.jobData.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Job data deleted successfully' });
    } catch (error) {
        console.error('Error deleting job data:', error);
        return NextResponse.json(
            { error: 'Failed to delete job data' },
            { status: 500 }
        );
    }
}
