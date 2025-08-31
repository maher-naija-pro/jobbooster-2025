import { openai } from '../../../lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { CVData, JobAnalysis, Language } from '../../../lib/types';

export async function POST(request: NextRequest) {
    try {
        const { cvData, jobAnalysis, language, type = 'application' }: {
            cvData: CVData;
            jobAnalysis: JobAnalysis;
            language: Language;
            type?: 'application' | 'follow-up' | 'inquiry';
        } = await request.json();

        // Validate required data
        if (!cvData || !jobAnalysis || !language) {
            return NextResponse.json(
                { error: 'Missing required data: cvData, jobAnalysis, or language' },
                { status: 400 }
            );
        }

        // Create the prompt for email generation
        const prompt = createEmailPrompt(cvData, jobAnalysis, language, type);

        // Use OpenAI streaming API
        const stream = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-oss',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career counselor helping create professional job application emails.
          Generate compelling, personalized emails that complement the candidate's application.
          Write in ${language.nativeName} language.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: true,
            max_tokens: 1500,
            temperature: 0.7,
        });

        // Create a streaming response
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            // Send the content chunk
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }

                    // Send completion signal
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Error generating email:', error);
        return NextResponse.json(
            { error: 'Failed to generate email' },
            { status: 500 }
        );
    }
}

function createEmailPrompt(cvData: CVData, jobAnalysis: JobAnalysis, language: Language, type: string): string {
    const emailTypes = {
        application: 'job application submission',
        'follow-up': 'follow-up after application submission',
        inquiry: 'inquiry about job opportunities'
    };

    return `
Please create a professional email for ${emailTypes[type as keyof typeof emailTypes]} based on the following information:

JOB POSITION DETAILS:
- Title: ${jobAnalysis.industry || 'Position'}
- Company: ${jobAnalysis.companySize || 'Company'}
- Location: ${jobAnalysis.location || 'Location'}
- Key Requirements: ${jobAnalysis.requirements.join(', ')}

CANDIDATE'S BACKGROUND:
- Experience Level: ${cvData.experience?.length || 0} years
- Skills from CV: ${cvData.processedContent.substring(0, 300)}...

INSTRUCTIONS:
1. Write a professional email in ${language.nativeName}
2. Include an appropriate subject line
3. Keep the email concise and impactful (150-300 words)
4. Reference the attached cover letter and CV
5. Show enthusiasm for the position and company
6. Include a professional sign-off

Structure the email with:
- Clear, professional subject line
- Polite greeting
- Brief introduction mentioning how you found the position
- 1-2 paragraphs highlighting relevant qualifications
- Mention of attached documents
- Call to action or next steps
- Professional closing
`;
}
