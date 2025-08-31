import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { openai } from '../../../lib/openai';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        logger.contentGeneration('Starting email generation');

        const body = await request.json();
        const { cvData, jobAnalysis, language = 'en', type = 'application' } = body;

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
            type,
            cvSkillsCount: cvData.extractedSkills?.length || 0,
            jobSkillsCount: jobAnalysis.skills?.length || 0
        });

        const processingStartTime = Date.now();

        // Prepare data for email generation
        const cvSkills = cvData.extractedSkills?.join(', ') || 'JavaScript, React, TypeScript';
        const cvExperience = cvData.experience?.length || 3;
        const jobRequirements = jobAnalysis.requirements?.join(', ') || 'modern web development technologies';
        const jobSkills = jobAnalysis.skills?.join(', ') || 'frontend development skills';

        // Create email generation prompt based on type
        let emailPrompt: string;
        let subject: string;

        switch (type) {
            case 'follow-up':
                subject = `Follow-up: Software Developer Position Application`;
                emailPrompt = `
You are a professional career counselor. Write a polite and professional follow-up email for a job application.

CANDIDATE INFORMATION:
- Skills: ${cvSkills}
- Years of Experience: ${cvExperience} years
- Key Skills: ${cvData.extractedSkills?.slice(0, 3).join(', ') || 'JavaScript, React, TypeScript'}

JOB INFORMATION:
- Position: Software Developer
- Company: ${jobAnalysis.industry || 'Technology company'}
- Skills Required: ${jobSkills}

INSTRUCTIONS:
- Write in ${language} language
- Keep it concise and professional (150-200 words)
- Express continued interest
- Politely ask for updates
- Include contact information placeholder
- Professional tone appropriate for follow-up communication

Generate a complete follow-up email ready to send.`;
                break;

            case 'inquiry':
                subject = `Inquiry About Software Developer Opportunities`;
                emailPrompt = `
You are a professional career counselor. Write a professional inquiry email about potential job opportunities.

CANDIDATE INFORMATION:
- Skills: ${cvSkills}
- Years of Experience: ${cvExperience} years
- Key Experience: ${cvData.experience?.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ') || 'Frontend development experience'}

JOB INFORMATION:
- Industry: ${jobAnalysis.industry || 'Technology'}
- Company Size: ${jobAnalysis.companySize || 'Unknown'}
- Skills Required: ${jobSkills}

INSTRUCTIONS:
- Write in ${language} language
- Keep it concise and professional (200-250 words)
- Express interest in the company
- Highlight relevant skills and experience
- Mention resume attachment
- Professional and enthusiastic tone
- Include call to action for discussion

Generate a complete inquiry email ready to send.`;
                break;

            default: // application
                subject = `Application for Software Developer Position`;
                emailPrompt = `
You are a professional career counselor. Write a compelling job application email.

CANDIDATE INFORMATION:
- Skills: ${cvSkills}
- Years of Experience: ${cvExperience} years
- Key Experience: ${cvData.experience?.map((exp: any) => `${exp.position} at ${exp.company} (${exp.duration})`).join(', ') || 'Frontend development experience'}

JOB INFORMATION:
- Skills Required: ${jobSkills}
- Requirements: ${jobRequirements}
- Industry: ${jobAnalysis.industry || 'Technology'}
- Location: ${jobAnalysis.location || 'Remote'}

INSTRUCTIONS:
- Write in ${language} language
- Keep it professional and concise (250-350 words)
- Highlight matching skills and experience
- Mention resume and cover letter attachments
- Express enthusiasm for the role
- Include call to action for interview
- Professional and confident tone

Generate a complete application email with proper structure and attachments mentioned.`;
        }

        logger.contentGeneration(`Starting Ollama generation for ${type} email generation`);

        // Use Ollama for email generation via OpenAI compatible API
        const completion = await openai.chat.completions.create({
            model: 'gpt-oss',
            messages: [
                {
                    role: 'user',
                    content: emailPrompt
                }
            ],
            temperature: 0.7,
        });

        const generatedContent = completion.choices[0]?.message?.content || '';

        logger.contentGeneration(`Ollama generation completed for ${type} email`);

        // Return the result as JSON
        return NextResponse.json({
            content: generatedContent,
            usage: completion.usage,
            subject: subject
        });

    } catch (error) {
        const totalTime = Date.now() - startTime;
        logger.apiRequest('/api/generate-mail', 'POST', totalTime, { error: error instanceof Error ? error.message : 'Unknown error' });
        logger.contentGeneration('Email generation failed', { error: error instanceof Error ? error.message : 'Unknown error' });

        return NextResponse.json(
            { error: 'Failed to generate email' },
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
