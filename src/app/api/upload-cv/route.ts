import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '../../../lib/types';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Only PDF, DOC, and DOCX files are allowed' },
                { status: 400 }
            );
        }

        // Extract text content from the uploaded file
        let extractedText = '';
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        try {
            if (file.type === 'application/pdf') {
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
            } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                extractedText = result.value;
            } else {
                return NextResponse.json(
                    { error: 'Unsupported file type' },
                    { status: 400 }
                );
            }
        } catch (extractionError) {
            console.error('Error extracting text from file:', extractionError);
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
            experience: [], // Will be populated by AI analysis
            education: [], // Will be populated by AI analysis
            processedContent: extractedText,
            status: 'completed'
        };

        return NextResponse.json({
            success: true,
            cvData,
            processingTime: 1500 // Mock processing time in ms
        });

    } catch (error) {
        console.error('Error uploading CV:', error);
        return NextResponse.json(
            { error: 'Failed to process CV upload' },
            { status: 500 }
        );
    }
}
