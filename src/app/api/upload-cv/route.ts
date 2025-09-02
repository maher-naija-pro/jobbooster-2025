import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '../../../lib/types';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import { logger } from '../../../lib/logger';

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

        // Basic CV data structure with extracted content
        const cvData: CVData = {
            id: `cv_${Date.now()}`,
            filename: file.name,
            size: file.size,
            uploadDate: new Date(),
            experience: [],
            education: [],
            processedContent: extractedText,
            status: 'completed'
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
