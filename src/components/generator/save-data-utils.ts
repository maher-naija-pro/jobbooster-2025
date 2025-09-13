import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { CVData } from '@/lib/types';

/**
 * Interface for CV data that needs to be saved
 */
export interface CvDataToSave {
    id?: string;
    filename: string;
    size: number;
    uploadDate: Date;
    processedContent: string;
    status: 'processing' | 'completed' | 'error';
    fileUrl?: string;
    extractedText?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    nationality?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    githubUrl?: string;
}

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
 * Check if CV data is already saved in the database
 * @param cvData - The CV data to check
 * @returns Promise<boolean> - True if CV is saved, false otherwise
 */
export async function isCvDataSaved(cvData: CvDataToSave): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';

        // Check if CV exists by fileUrl or extractedText content
        const existingCv = await prisma.cvData.findFirst({
            where: {
                userId,
                OR: [
                    { fileUrl: cvData.fileUrl },
                    { extractedText: cvData.extractedText }
                ],
                isDeleted: false,
                isActive: true
            }
        });

        return !!existingCv;
    } catch (error) {
        logger.error('Error checking if CV data is saved:', { error: error instanceof Error ? error.message : String(error) });
        return false;
    }
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
 * Save CV data to the database
 * @param cvData - The CV data to save
 * @returns Promise<string> - The ID of the saved CV data
 */
export async function saveCvData(cvData: CvDataToSave): Promise<string> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';

        // Create CV data record
        const savedCvData = await prisma.cvData.create({
            data: {
                userId,
                fileName: cvData.filename,
                fileUrl: cvData.fileUrl || null,
                fileSize: cvData.size,
                mimeType: 'application/pdf', // Default to PDF, could be enhanced
                extractedText: cvData.extractedText || cvData.processedContent,
                processingStatus: 'UPLOADED',
                processingStartedAt: new Date(),
                processingCompletedAt: new Date(),

                // Personal information
                firstName: cvData.firstName || null,
                lastName: cvData.lastName || null,
                fullName: cvData.fullName || null,
                email: cvData.email || null,
                phone: cvData.phone || null,
                nationality: cvData.nationality || null,
                linkedinUrl: cvData.linkedinUrl || null,
                websiteUrl: cvData.websiteUrl || null,
                githubUrl: cvData.githubUrl || null,

                // Status and processing
                isPublic: false,
                gdprConsent: !!user,
                dataClassification: 'internal',
                viewCount: 0,
                analysisCount: 0,
                isActive: true,
                isArchived: false,
                isDeleted: false,
                isLatest: true,
                version: 1,
                retryCount: 0,

                // Metadata
                metadata: {
                    createdVia: 'button-action',
                    uploadTimestamp: new Date().toISOString(),
                    isAuthenticated: !!user,
                    source: 'manual-save'
                }
            }
        });

        logger.info('CV data saved successfully', {
            cvId: savedCvData.id,
            fileName: cvData.filename,
            userId
        });

        return savedCvData.id;
    } catch (error) {
        logger.error('Error saving CV data:', { error: error instanceof Error ? error.message : String(error) });
        throw new Error('Failed to save CV data');
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
 * Convert CVData to CvDataToSave format
 * @param cvData - The CV data to convert
 * @returns CvDataToSave - Converted CV data
 */
function convertCVDataToSave(cvData: CVData): CvDataToSave {
    return {
        id: cvData.id,
        filename: cvData.filename,
        size: cvData.size,
        uploadDate: cvData.uploadDate,
        processedContent: cvData.processedContent,
        status: cvData.status,
        fileUrl: cvData.fileUrl,
        extractedText: cvData.processedContent, // Use processedContent as extractedText
        // Note: Personal information fields are not available in CVData interface
        // They would need to be added to the main CVData interface if needed
    };
}

/**
 * Ensure CV and job offer data are saved before proceeding with actions
 * @param cvData - The CV data to check/save
 * @param jobOffer - The job offer data to check/save
 * @returns Promise<{cvId: string, jobId: string}> - IDs of saved data
 */
export async function ensureDataSaved(
    cvData: CVData | null,
    jobOffer: string | null
): Promise<{ cvId: string | null; jobId: string | null }> {
    const result = { cvId: null as string | null, jobId: null as string | null };

    logger.info('Ensuring data is saved before action', {
        hasCvData: !!cvData,
        hasJobOffer: !!(jobOffer && jobOffer.length >= 100),
        cvFilename: cvData?.filename,
        jobOfferLength: jobOffer?.length,
        cvDataId: cvData?.id,
        cvFileUrl: cvData?.fileUrl
    });

    try {
        // Check and save CV data if provided
        if (cvData) {
            const cvDataToSave = convertCVDataToSave(cvData);
            const isCvSaved = await isCvDataSaved(cvDataToSave);
            if (!isCvSaved) {
                logger.info('CV data not found in database, saving...', {
                    filename: cvData.filename
                });
                result.cvId = await saveCvData(cvDataToSave);
            } else {
                logger.info('CV data already exists in database', {
                    filename: cvData.filename
                });
                // Get the existing CV ID
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();
                const userId = user?.id || 'anonymous';

                const existingCv = await prisma.cvData.findFirst({
                    where: {
                        userId,
                        OR: [
                            { fileUrl: cvData.fileUrl },
                            { extractedText: cvData.processedContent }
                        ],
                        isDeleted: false,
                        isActive: true
                    },
                    select: { id: true }
                });

                result.cvId = existingCv?.id || null;
            }
        }

        // Check and save job offer data if provided
        if (jobOffer && jobOffer.length >= 100) {
            const jobOfferData: JobOfferToSave = {
                content: jobOffer,
                title: 'Generated Job Offer',
                company: 'Unknown Company'
            };

            const isJobSaved = await isJobOfferSaved(jobOfferData);
            if (!isJobSaved) {
                logger.info('Job offer data not found in database, saving...', {
                    contentLength: jobOffer.length
                });
                result.jobId = await saveJobOfferData(jobOfferData);
            } else {
                logger.info('Job offer data already exists in database', {
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

                result.jobId = existingJob?.id || null;
            }
        }

        return result;
    } catch (error) {
        logger.error('Error ensuring data is saved:', { error: error instanceof Error ? error.message : String(error) });
        throw new Error('Failed to ensure data is saved');
    }
}
