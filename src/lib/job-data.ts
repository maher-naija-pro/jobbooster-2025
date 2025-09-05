import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateJobDataInput {
    userId: string;
    content: string;
    title?: string;
    company?: string;
    jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
    location?: string;
    remoteType?: 'remote' | 'hybrid' | 'onsite';
    salaryRange?: string;
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
    industry?: string;
    department?: string;
    employmentType?: string;
    dataClassification?: 'public' | 'internal' | 'confidential';
}

export interface UpdateJobDataInput {
    content?: string;
    title?: string;
    company?: string;
    jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
    location?: string;
    remoteType?: 'remote' | 'hybrid' | 'onsite';
    salaryRange?: string;
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
    industry?: string;
    department?: string;
    employmentType?: string;
    dataClassification?: 'public' | 'internal' | 'confidential';
    isPublic?: boolean;
    isActive?: boolean;
    isArchived?: boolean;
}

export class JobDataService {
    // Create new job data
    static async create(input: CreateJobDataInput) {
        return await prisma.jobData.create({
            data: {
                ...input,
                processingStatus: 'uploaded',
                status: 'uploaded',
                viewCount: 0,
                analysisCount: 0,
                isPublic: false,
                gdprConsent: false,
                isActive: true,
                isArchived: false,
            },
        });
    }

    // Get job data by ID
    static async getById(id: string, userId: string) {
        return await prisma.jobData.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    // Get all job data for a user
    static async getByUserId(
        userId: string,
        options: {
            page?: number;
            limit?: number;
            status?: string;
            isArchived?: boolean;
        } = {}
    ) {
        const { page = 1, limit = 10, status, isArchived } = options;
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(status && { processingStatus: status }),
            ...(isArchived !== undefined && { isArchived }),
        };

        const [data, total] = await Promise.all([
            prisma.jobData.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.jobData.count({ where }),
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Update job data
    static async update(id: string, userId: string, input: UpdateJobDataInput) {
        // Check if job data exists and belongs to user
        const existingJobData = await prisma.jobData.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingJobData) {
            throw new Error('Job data not found');
        }

        const updateData: any = { ...input };

        // Handle archive date
        if (input.isArchived && !existingJobData.isArchived) {
            updateData.archiveDate = new Date();
        }

        return await prisma.jobData.update({
            where: { id },
            data: updateData,
        });
    }

    // Delete job data
    static async delete(id: string, userId: string) {
        // Check if job data exists and belongs to user
        const existingJobData = await prisma.jobData.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!existingJobData) {
            throw new Error('Job data not found');
        }

        return await prisma.jobData.delete({
            where: { id },
        });
    }

    // Increment view count
    static async incrementViewCount(id: string) {
        return await prisma.jobData.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }

    // Update analysis data
    static async updateAnalysisData(
        id: string,
        analysisData: {
            analysisId?: string;
            analysisVersion?: string;
            extractedSkills?: string[];
            requiredQualifications?: string[];
            preferredQualifications?: string[];
            processingStatus?: 'uploaded' | 'extracting' | 'analyzing' | 'completed' | 'failed';
            processingStartedAt?: Date;
            processingCompletedAt?: Date;
            processingError?: string;
            processingTime?: number;
            modelUsed?: string;
            parameters?: any;
            errorMessage?: string;
        }
    ) {
        const updateData: any = { ...analysisData };

        // Update analysis count and last analyzed date
        if (analysisData.processingStatus === 'completed') {
            updateData.analysisCount = { increment: 1 };
            updateData.lastAnalyzedAt = new Date();
        }

        return await prisma.jobData.update({
            where: { id },
            data: updateData,
        });
    }

    // Archive job data
    static async archive(id: string, userId: string) {
        return await this.update(id, userId, {
            isArchived: true,
        });
    }

    // Unarchive job data
    static async unarchive(id: string, userId: string) {
        return await this.update(id, userId, {
            isArchived: false,
            archiveDate: undefined,
        });
    }

    // Get job data statistics for a user
    static async getStats(userId: string) {
        const [
            total,
            active,
            archived,
            completed,
            failed,
            totalViews,
            totalAnalyses,
        ] = await Promise.all([
            prisma.jobData.count({ where: { userId } }),
            prisma.jobData.count({ where: { userId, isActive: true, isArchived: false } }),
            prisma.jobData.count({ where: { userId, isArchived: true } }),
            prisma.jobData.count({ where: { userId, processingStatus: 'completed' } }),
            prisma.jobData.count({ where: { userId, processingStatus: 'failed' } }),
            prisma.jobData.aggregate({
                where: { userId },
                _sum: { viewCount: true },
            }),
            prisma.jobData.aggregate({
                where: { userId },
                _sum: { analysisCount: true },
            }),
        ]);

        return {
            total,
            active,
            archived,
            completed,
            failed,
            totalViews: totalViews._sum.viewCount || 0,
            totalAnalyses: totalAnalyses._sum.analysisCount || 0,
        };
    }
}
