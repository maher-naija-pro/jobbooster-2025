import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Interface for job offer data that needs to be saved
 */
export interface JobOfferToSave {
    id?: string;
    content: string;
    title?: string;
    company?: string;
    jobLink?: string;
}


/**
 * Check if job offer data is already saved in the database
 * @param jobOffer - The job offer data to check
 * @returns Promise<boolean> - True if job offer is saved, false otherwise
 */
export async function isJobOfferSaved(jobOffer: JobOfferToSave): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';

        // Check if job offer exists by content
        const existingJob = await prisma.jobData.findFirst({
            where: {
                userId,
                content: jobOffer.content,
                isDeleted: false,
                isActive: true
            }
        });

        return !!existingJob;
    } catch (error) {
        logger.error('Error checking if job offer is saved:', { error: error instanceof Error ? error.message : String(error) });
        return false;
    }
}


/**
 * Save job offer data to the database
 * @param jobOffer - The job offer data to save
 * @returns Promise<string> - The ID of the saved job offer data
 */
export async function saveJobOfferData(jobOffer: JobOfferToSave): Promise<string> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';

        // Create job data record
        const savedJobData = await prisma.jobData.create({
            data: {
                userId,
                content: jobOffer.content,
                title: jobOffer.title || null,
                companyName: jobOffer.company || null,
                processingStatus: 'UPLOADED',
                viewCount: 0,
                analysisCount: 0,
                isPublic: false,
                gdprConsent: !!user,
                isActive: true,
                isArchived: false,

                // Additional fields
                createdBy: user?.id || 'anonymous',
                dataClassification: 'internal'
            }
        });

        logger.info('Job offer data saved successfully', {
            jobId: savedJobData.id,
            title: jobOffer.title,
            company: jobOffer.company,
            userId
        });

        return savedJobData.id;
    } catch (error) {
        logger.error('Error saving job offer data:', { error: error instanceof Error ? error.message : String(error) });
        throw new Error('Failed to save job offer data');
    }
}

/**
 * Save job offer data when user clicks action buttons
 * @param jobOffer - The job offer content to save
 * @returns Promise<string | null> - The ID of the saved job offer data, or null if not saved
 */
export async function saveJobOfferOnAction(jobOffer: string): Promise<string | null> {
    try {
        // Only save if job offer has sufficient content
        if (!jobOffer || jobOffer.length < 100) {
            logger.info('Job offer content too short, skipping save', {
                contentLength: jobOffer?.length || 0
            });
            return null;
        }

        const jobOfferData: JobOfferToSave = {
            content: jobOffer,
            title: 'Job Offer from Action',
            company: 'Unknown Company'
        };

        // Check if already saved
        const isJobSaved = await isJobOfferSaved(jobOfferData);
        if (isJobSaved) {
            logger.info('Job offer already exists in database', {
                contentLength: jobOffer.length
            });

            // Get the existing job ID
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || 'anonymous';

            const existingJob = await prisma.jobData.findFirst({
                where: {
                    userId,
                    content: jobOffer,
                    isDeleted: false,
                    isActive: true
                },
                select: { id: true }
            });

            return existingJob?.id || null;
        }

        // Save new job offer
        logger.info('Saving new job offer data', {
            contentLength: jobOffer.length
        });

        const jobId = await saveJobOfferData(jobOfferData);
        return jobId;
    } catch (error) {
        logger.error('Error saving job offer on action:', {
            error: error instanceof Error ? error.message : String(error),
            contentLength: jobOffer?.length || 0
        });
        // Don't throw error to avoid breaking the action flow
        return null;
    }
}
