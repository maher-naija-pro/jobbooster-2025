import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '../../../lib/types';

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

        // For now, create a mock CV data structure
        // In a real implementation, you would:
        // 1. Save the file to a storage service
        // 2. Extract text content using a PDF/DOC parser
        // 3. Use AI to analyze and structure the CV data

        const cvData: CVData = {
            id: `cv_${Date.now()}`,
            filename: file.name,
            size: file.size,
            uploadDate: new Date(),
            experience: [
                {
                    title: 'Software Developer',
                    company: 'Previous Company',
                    duration: '2 years',
                    description: 'Developed web applications using modern technologies'
                }
            ],
            education: [
                {
                    degree: 'Bachelor of Computer Science',
                    institution: 'University',
                    year: '2020'
                }
            ],
            processedContent: `Mock CV content extracted from ${file.name}. This would normally contain the full text content of the CV for analysis.`,
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
