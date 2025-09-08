import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '../../../lib/types';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import { logger } from '../../../lib/logger';
import { createClient } from '../../../lib/supabase/server';
import { prisma } from '../../../lib/prisma';
import { nanoid } from 'nanoid';
import { generateDateFolder } from '../../../lib/supabase/upload_supa';
import { generateAnonymousSessionId, getAnonymousSessionId } from '../../../lib/anonymous-session';
import { ProcessingStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    logger.cvUpload('CV upload request started');

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            logger.warn('CV upload failed: No file provided');
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        logger.cvUpload('File received', {
            filename: file.name,
            size: file.size,
            type: file.type
        });

        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (file.size > maxSize) {
            logger.warn('CV upload failed: File size exceeds limit', {
                filename: file.name,
                size: file.size,
                maxSize
            });
            return NextResponse.json(
                { error: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        if (!allowedTypes.includes(file.type)) {
            logger.warn('CV upload failed: Invalid file type', {
                filename: file.name,
                type: file.type,
                allowedTypes
            });
            return NextResponse.json(
                { error: 'Only PDF, DOC, and DOCX files are allowed' },
                { status: 400 }
            );
        }

        logger.cvUpload('File validation passed', {
            filename: file.name,
            size: file.size,
            type: file.type
        });

        // Extract text content from the uploaded file
        let extractedText = '';
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        logger.cvUpload('Starting text extraction', {
            filename: file.name,
            type: file.type,
            bufferSize: fileBuffer.length
        });

        try {
            if (file.type === 'application/pdf') {
                logger.cvUpload('Processing PDF file', { filename: file.name });
                // Use pdf2json to parse PDF
                const pdfParser = new PDFParser();

                // Convert buffer to base64 for pdf2json
                const base64String = fileBuffer.toString('base64');

                // Parse PDF and extract text
                const pdfData = await new Promise((resolve, reject) => {
                    pdfParser.on('pdfParser_dataError', (errData: any) => {
                        reject(new Error(errData.parserError));
                    });

                    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
                        // Extract text from all pages
                        let text = '';
                        if (pdfData.Pages) {
                            pdfData.Pages.forEach((page: any) => {
                                if (page.Texts) {
                                    page.Texts.forEach((textItem: any) => {
                                        if (textItem.R) {
                                            textItem.R.forEach((r: any) => {
                                                if (r.T) {
                                                    text += decodeURIComponent(r.T) + ' ';
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        resolve({ text: text.trim() });
                    });

                    // Parse the base64 PDF data
                    pdfParser.parseBuffer(Buffer.from(base64String, 'base64'));
                });

                extractedText = (pdfData as any).text;
                logger.cvUpload('PDF text extraction completed', {
                    filename: file.name,
                    textLength: extractedText.length
                });
            } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                logger.cvUpload('Processing Word document', { filename: file.name });
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                extractedText = result.value;
                logger.cvUpload('Word document text extraction completed', {
                    filename: file.name,
                    textLength: extractedText.length
                });
            } else {
                logger.warn('CV upload failed: Unsupported file type', {
                    filename: file.name,
                    type: file.type
                });
                return NextResponse.json(
                    { error: 'Unsupported file type' },
                    { status: 400 }
                );
            }
        } catch (extractionError) {
            logger.error('Error extracting text from file', {
                filename: file.name,
                type: file.type,
                error: extractionError
            });
            return NextResponse.json(
                { error: 'Failed to extract text from file' },
                { status: 500 }
            );
        }

        // Upload file to Supabase storage
        logger.cvUpload('Uploading file to Supabase storage', {
            filename: file.name,
            size: file.size
        });

        const supabase = await createClient();
        const fileId = nanoid();
        const fileExtension = file.name.split('.').pop();

        // Create date-based folder structure: YYYY/MM/DD/filename
        const dateFolder = generateDateFolder();
        const storageFilename = `${dateFolder}/${fileId}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('pdfs')
            .upload(storageFilename, file);

        if (uploadError) {
            logger.error('Supabase storage upload failed', {
                filename: file.name,
                error: uploadError.message
            });
            return NextResponse.json(
                { error: 'Failed to upload file to storage' },
                { status: 500 }
            );
        }

        // Get public URL for the uploaded file
        const { data: urlData } = await supabase.storage
            .from('pdfs')
            .getPublicUrl(uploadData.path);

        logger.cvUpload('File uploaded to Supabase storage successfully', {
            filename: file.name,
            storagePath: uploadData.path,
            publicUrl: urlData.publicUrl
        });

        // Save to database using CvData table
        logger.cvUpload('Saving file upload to database', {
            filename: file.name,
            storagePath: uploadData.path
        });

        try {
            // Get user ID from Supabase auth
            const { data: { user } } = await supabase.auth.getUser();
            const isAuthenticated = !!user;
            let userId = user?.id;

            // For anonymous users, create a temporary profile
            if (!isAuthenticated) {
                // Try to get session ID from request headers or generate new one
                const sessionId = request.headers.get('x-session-id');
                const anonymousId = sessionId || generateAnonymousSessionId();

                try {
                    // Create a temporary profile for anonymous user
                    const profile = await prisma.profile.upsert({
                        where: { userId: anonymousId },
                        update: {},
                        create: {
                            userId: anonymousId,
                            email: `anonymous-${anonymousId}@temp.local`,
                            fullName: `Anonymous User ${anonymousId.substring(0, 8)}`,
                            preferences: {},
                            subscription: { plan: 'free' }
                        }
                    });

                    logger.cvUpload('Anonymous profile created', {
                        profileId: profile.userId,
                        email: profile.email,
                        filename: file.name
                    });

                    userId = anonymousId;
                } catch (profileError) {
                    logger.error('Failed to create anonymous profile', {
                        anonymousId,
                        error: profileError instanceof Error ? profileError.message : String(profileError),
                        filename: file.name
                    });
                    throw new Error('Failed to create anonymous user profile');
                }
            }

            logger.cvUpload('User authentication status', {
                isAuthenticated,
                userId: isAuthenticated ? userId : 'anonymous-session',
                filename: file.name
            });

            // Verify the profile exists before creating CV data
            const profileExists = await prisma.profile.findUnique({
                where: { userId: userId! }
            });

            if (!profileExists) {
                logger.error('Profile not found for user', {
                    userId,
                    isAuthenticated,
                    filename: file.name
                });
                throw new Error('User profile not found');
            }

            logger.cvUpload('Profile verified', {
                userId,
                profileId: profileExists.userId,
                filename: file.name
            });

            // Validate required fields before database insert
            if (!userId || !file.name || !urlData.publicUrl) {
                logger.error('Missing required fields for CV data creation', {
                    userId: !!userId,
                    fileName: !!file.name,
                    fileUrl: !!urlData.publicUrl,
                    filename: file.name
                });
                throw new Error('Missing required fields for CV data creation');
            }

            const fileRecord = await prisma.cvData.create({
                data: {
                    userId: userId,
                    fileName: file.name,
                    fileUrl: urlData.publicUrl,
                    fileSize: file.size,
                    mimeType: file.type,
                    extractedText: extractedText,
                    processingStatus: ProcessingStatus.UPLOADED,
                    processingStartedAt: new Date(),
                    processingCompletedAt: new Date(),
                    viewCount: 0,
                    analysisCount: 0,
                    isPublic: true,
                    isActive: true,
                    isLatest: true,
                    isArchived: false,
                    version: 1,
                    retryCount: 0,
                    gdprConsent: isAuthenticated, // Only authenticated users can give consent
                    dataClassification: 'internal',
                    metadata: {
                        uploadTimestamp: new Date().toISOString(),
                        processingTime: Date.now() - startTime,
                        fileType: 'cv',
                        dateFolder: dateFolder,
                        uploadDate: {
                            year: new Date().getFullYear(),
                            month: String(new Date().getMonth() + 1).padStart(2, '0'),
                            day: String(new Date().getDate()).padStart(2, '0')
                        },
                        isAuthenticated: isAuthenticated,
                        sessionInfo: {
                            isAnonymous: !isAuthenticated,
                            uploadSource: isAuthenticated ? 'authenticated' : 'anonymous'
                        }
                    }
                }
            });

            logger.cvUpload('File upload saved to database successfully', {
                fileId: fileRecord.id,
                filename: file.name
            });

            // Create CVData object for response
            const cvData: CVData = {
                id: fileRecord.id,
                filename: fileRecord.fileName || '',
                size: fileRecord.fileSize || 0,
                uploadDate: fileRecord.createdAt,
                processedContent: fileRecord.extractedText || '',
                status: 'completed',
                fileUrl: fileRecord.fileUrl,
                processingStatus: fileRecord.processingStatus.toLowerCase() as 'uploaded' | 'extracting' | 'analyzing' | 'completed' | 'failed',
                processingStartedAt: fileRecord.processingStartedAt || undefined,
                processingCompletedAt: fileRecord.processingCompletedAt || undefined,
                processingError: fileRecord.processingError || undefined,
                originalFilename: fileRecord.fileName || '',
                viewCount: fileRecord.viewCount,
                lastAnalyzedAt: fileRecord.lastAnalyzedAt || undefined,
                analysisCount: fileRecord.analysisCount,
                isPublic: fileRecord.isPublic || false,
                retentionDate: fileRecord.retentionDate || undefined,
                gdprConsent: fileRecord.gdprConsent,
                dataClassification: fileRecord.dataClassification as 'public' | 'internal' | 'confidential' || undefined,
                isArchived: fileRecord.isArchived || false,
                archiveDate: fileRecord.archiveDate || undefined
            };

            const processingTime = Date.now() - startTime;

            logger.cvUpload('CV upload completed successfully', {
                filename: file.name,
                cvId: cvData.id,
                textLength: extractedText.length,
                processingTime
            });

            return NextResponse.json({
                success: true,
                cvData,
                processingTime
            });

        } catch (dbError: any) {
            logger.error('Database save failed', {
                filename: file.name,
                error: dbError,
                errorCode: dbError?.code,
                errorMessage: dbError?.message
            });

            // Handle specific database constraint violations
            if (dbError?.code === 'P2002') {
                // Unique constraint violation
                logger.error('Duplicate CV data detected', {
                    userId,
                    filename: file.name,
                    constraint: dbError.meta?.target
                });

                // Try to clean up uploaded file from storage
                await supabase.storage
                    .from('pdfs')
                    .remove([uploadData.path]);

                return NextResponse.json(
                    { error: 'CV already exists for this user' },
                    { status: 409 }
                );
            }

            if (dbError?.code === 'P2003') {
                // Foreign key constraint violation
                logger.error('Foreign key constraint violation', {
                    userId,
                    filename: file.name,
                    field: dbError.meta?.field_name
                });

                // Try to clean up uploaded file from storage
                await supabase.storage
                    .from('pdfs')
                    .remove([uploadData.path]);

                return NextResponse.json(
                    { error: 'Invalid user reference' },
                    { status: 400 }
                );
            }

            // Try to clean up uploaded file from storage
            await supabase.storage
                .from('pdfs')
                .remove([uploadData.path]);

            return NextResponse.json(
                { error: 'Failed to save file upload to database' },
                { status: 500 }
            );
        }

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('CV upload failed with unexpected error', {
            error,
            processingTime
        });
        return NextResponse.json(
            { error: 'Failed to process CV upload' },
            { status: 500 }
        );
    }
}
