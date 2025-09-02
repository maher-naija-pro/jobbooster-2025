import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '../../../lib/types';
import { openai } from '../../../lib/openai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cvContent, filename } = body;

        if (!cvContent) {
            return NextResponse.json(
                { error: 'CV content is required' },
                { status: 400 }
            );
        }

        // Use AI to extract structured data from CV content
        const extractionPrompt = `
        Analyze the following CV content and extract structured information. Return a JSON response with the following structure:

        {
            "personalInfo": {
                "name": "Full Name",
                "email": "email@example.com",
                "phone": "phone number",
                "location": "city, country",
                "linkedin": "linkedin profile",
                "website": "personal website"
            },
            "summary": "Professional summary or objective",
            "experiences": [
                {
                    "title": "Job Title",
                    "company": "Company Name",
                    "duration": "Start Date - End Date",
                    "description": "Job description and responsibilities",
                    "achievements": ["achievement 1", "achievement 2"],
                    "skills": ["skill 1", "skill 2"]
                }
            ],
            "educations": [
                {
                    "degree": "Degree Name",
                    "institution": "Institution Name",
                    "year": "Graduation Year",
                    "field": "Field of Study",
                    "gpa": "GPA if mentioned"
                }
            ],
            "skills": {
                "technical": ["skill1", "skill2"],
                "soft": ["skill1", "skill2"],
                "languages": ["language1", "language2"],
                "certifications": ["cert1", "cert2"]
            },
            "projects": [
                {
                    "name": "Project Name",
                    "description": "Project description",
                    "technologies": ["tech1", "tech2"],
                    "url": "project URL if available"
                }
            ]
        }

        CV Content:
        ${cvContent}

        Please extract all available information from the CV. If some information is not available, use null or empty arrays as appropriate.
        Return only valid JSON without any additional text or formatting.
        `;

        const openaiResponse = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert CV parser. Extract structured information from CV content and return it as valid JSON. Be thorough and accurate in your extraction.'
                },
                {
                    role: 'user',
                    content: extractionPrompt
                }
            ],
            temperature: 0.1,
            max_tokens: 3000,
        });

        const aiResponse = openaiResponse.choices[0]?.message?.content;

        if (!aiResponse) {
            return NextResponse.json(
                { error: 'No response from AI service' },
                { status: 500 }
            );
        }

        // Parse the AI response
        let extractedData;
        try {
            extractedData = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            console.error('AI Response:', aiResponse);
            return NextResponse.json(
                { error: 'Invalid response format from AI service' },
                { status: 500 }
            );
        }

        // Create structured CV data
        const cvData: CVData = {
            id: `cv_${Date.now()}`,
            filename: filename || 'uploaded_cv',
            size: cvContent.length,
            uploadDate: new Date(),
            experience: extractedData.experience || [],
            education: extractedData.education || [],
            processedContent: cvContent,
            status: 'completed',
            personalInfo: extractedData.personalInfo,
            summary: extractedData.summary,
            skills: extractedData.skills,
            projects: extractedData.projects
        };

        return NextResponse.json({
            success: true,
            cvData,
            extractedData,
            processingTime: Date.now() - Date.now()
        });

    } catch (error) {
        console.error('Error extracting CV content:', error);
        return NextResponse.json(
            { error: 'Failed to extract CV content' },
            { status: 500 }
        );
    }
}
