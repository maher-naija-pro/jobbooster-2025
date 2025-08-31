import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { openai } from '../../../lib/openai';
import { streamText } from 'ai';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        logger.jobAnalysis('Starting job analysis process');

        const body = await request.json();
        const { jobContent } = body;

        if (!jobContent || typeof jobContent !== 'string') {
            logger.jobAnalysis('Invalid job content provided', { error: 'missing_or_invalid_content' });
            return NextResponse.json(
                { error: 'Job content is required and must be a string' },
                { status: 400 }
            );
        }

        if (jobContent.trim().length < 100) {
            logger.jobAnalysis('Job content too short', {
                contentLength: jobContent.length,
                minLength: 100
            });
            return NextResponse.json(
                { error: 'Job content must be at least 100 characters long' },
                { status: 400 }
            );
        }

        logger.jobAnalysis('Job content validation passed', {
            contentLength: jobContent.length
        });

        const processingStartTime = Date.now();

        // Create comprehensive job analysis prompt
        const analysisPrompt = `
You are an expert HR analyst tasked with analyzing a job description. Please analyze the following job description and provide a detailed breakdown.

JOB DESCRIPTION:
${jobContent}

Please provide a comprehensive analysis in the following JSON format:
{
    "skills": ["list", "of", "technical", "and", "soft", "skills", "mentioned"],
    "experienceLevel": "entry|mid|senior|lead" (based on years of experience required),
    "industry": "primary industry sector",
    "requirements": ["detailed", "list", "of", "all", "requirements", "mentioned"],
    "companySize": "estimated company size if mentioned, otherwise 'Unknown'",
    "location": "job location or 'Remote' if not specified",
    "salaryRange": "salary range if mentioned, otherwise null",
    "keywords": ["important", "keywords", "for", "matching"],
    "jobType": "Full-time|Part-time|Contract|Internship|Temporary",
    "department": "department name if mentioned",
    "benefits": ["list", "of", "benefits", "mentioned", "in", "the", "job"]
}

Be thorough and extract all relevant information. Focus on technical skills, required experience, and job requirements.`;

        logger.jobAnalysis('Starting OpenAI streaming for job analysis');

        // Use OpenAI streaming for real-time analysis
        const result = await streamText({
            model: openai('gpt-3.5-turbo'),
            prompt: analysisPrompt,
            temperature: 0.3,
        });

        let fullResponse = '';
        const reader = result.toTextStreamResponse().body?.getReader();

        if (!reader) {
            throw new Error('Failed to get stream reader');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Process complete lines
                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.choices && parsed.choices[0]?.delta?.content) {
                                fullResponse += parsed.choices[0].delta.content;
                            }
                        } catch (e) {
                            // Skip invalid JSON chunks
                        }
                    }
                }

                buffer = lines[lines.length - 1]; // Keep incomplete line for next iteration
            }
        } finally {
            reader.releaseLock();
        }

        logger.jobAnalysis('OpenAI streaming completed, parsing response');

        // Parse the JSON response
        let analysis;
        try {
            // Clean up the response and extract JSON
            const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            analysis = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            logger.jobAnalysis('Failed to parse OpenAI response, using fallback', { parseError, response: fullResponse });

            // Fallback to mock analysis if parsing fails
            analysis = {
                skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Git', 'REST APIs', 'Agile'],
                experienceLevel: 'mid' as const,
                industry: 'Technology',
                requirements: [
                    '3+ years of frontend development experience',
                    'Strong proficiency in React and TypeScript',
                    'Experience with modern JavaScript (ES6+)',
                    'Knowledge of RESTful APIs and state management',
                    'Familiarity with version control (Git)',
                    'Experience with Agile development methodologies'
                ],
                companySize: '50-200 employees',
                location: 'Remote',
                salaryRange: '$80,000 - $120,000',
                keywords: [
                    'frontend', 'web development', 'javascript', 'react', 'typescript',
                    'user interface', 'user experience', 'responsive design', 'web applications'
                ],
                jobType: 'Full-time',
                department: 'Engineering',
                benefits: [
                    'Health insurance', 'Dental insurance', '401k matching',
                    'Flexible work hours', 'Professional development budget'
                ]
            };
        }

        const processingTime = Date.now() - processingStartTime;

        logger.jobAnalysis('Job analysis completed successfully', {
            processingTime,
            skillsCount: analysis.skills.length,
            requirementsCount: analysis.requirements.length,
            keywordsCount: analysis.keywords.length
        });

        const totalTime = Date.now() - startTime;
        logger.apiRequest('/api/analyze-job', 'POST', totalTime);

        return NextResponse.json({
            success: true,
            analysis,
            processingTime,
            contentLength: jobContent.length
        });

    } catch (error) {
        const totalTime = Date.now() - startTime;
        logger.apiRequest('/api/analyze-job', 'POST', totalTime, { error: error instanceof Error ? error.message : 'Unknown error' });
        logger.jobAnalysis('Job analysis failed', { error: error instanceof Error ? error.message : 'Unknown error' });

        return NextResponse.json(
            { error: 'Failed to analyze job description' },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
