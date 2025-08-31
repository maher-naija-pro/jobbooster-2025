import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { openai } from '../../../lib/openai';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        logger.contentGeneration('Starting cover letter generation');

        const body = await request.json();
        const { cvData, jobAnalysis, language = 'en', tone = 'professional' } = body;

        // Validate required fields
        if (!cvData) {
            logger.contentGeneration('Missing CV data', { error: 'missing_cv_data' });
            return NextResponse.json(
                { error: 'CV data is required' },
                { status: 400 }
            );
        }

        if (!jobAnalysis) {
            logger.contentGeneration('Missing job analysis', { error: 'missing_job_analysis' });
            return NextResponse.json(
                { error: 'Job analysis is required' },
                { status: 400 }
            );
        }

        logger.contentGeneration('Validation passed, starting AI generation', {
            language,
            tone,
            cvSkillsCount: cvData.extractedSkills?.length || 0,
            jobSkillsCount: jobAnalysis.skills?.length || 0
        });

        const processingStartTime = Date.now();

        // Create comprehensive cover letter generation prompt
        const cvSkills = cvData.extractedSkills?.join(', ') || 'JavaScript, React, TypeScript';
        const cvExperience = cvData.experience?.length || 3;
        const jobRequirements = jobAnalysis.requirements?.join(', ') || 'modern web development technologies';
        const jobSkills = jobAnalysis.skills?.join(', ') || 'frontend development skills';

        const coverLetterPrompt = `
You are a professional career counselor and expert copywriter. Create a compelling, ATS-optimized cover letter for a job application.

CANDIDATE INFORMATION:
- Skills: ${cvSkills}
- Years of Experience: ${cvExperience} years
- Key Experience: ${cvData.experience?.map((exp: any) => `${exp.position} at ${exp.company} (${exp.duration})`).join(', ') || 'Frontend development experience'}

JOB INFORMATION:
- Skills Required: ${jobSkills}
- Requirements: ${jobRequirements}
- Industry: ${jobAnalysis.industry || 'Technology'}
- Company Size: ${jobAnalysis.companySize || 'Unknown'}
- Location: ${jobAnalysis.location || 'Remote'}
- Job Type: ${jobAnalysis.jobType || 'Full-time'}

INSTRUCTIONS:
- Write in ${language} language
- Use a ${tone} tone
- Keep it professional and concise (300-400 words)
- Highlight relevant skills and experience that match the job requirements
- Include specific examples where possible
- Make it ATS-friendly with keywords from the job description
- Structure: Introduction, Body (2-3 paragraphs), Conclusion
- End with a call to action

Generate a complete, ready-to-use cover letter that will help the candidate stand out from other applicants.`;

        logger.contentGeneration('Starting Ollama generation for cover letter generation');

        // Use Ollama for cover letter generation via OpenAI compatible API
        const completion = await openai.chat.completions.create({
            model: 'gpt-oss',
            messages: [
                {
                    role: 'user',
                    content: coverLetterPrompt
                }
            ],
            temperature: 0.7,
        });

        const generatedContent = completion.choices[0]?.message?.content || '';

        logger.contentGeneration('Ollama generation completed for cover letter');

        // Return the result as JSON
        return NextResponse.json({
            content: generatedContent,
            usage: completion.usage
        });

    } catch (error) {
        const totalTime = Date.now() - startTime;
        logger.apiRequest('/api/generate-letter', 'POST', totalTime, { error: error instanceof Error ? error.message : 'Unknown error' });
        logger.contentGeneration('Cover letter generation failed', { error: error instanceof Error ? error.message : 'Unknown error' });

        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
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
