import { openai } from '../../../lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { CVData, JobAnalysis, Language } from '../../../lib/types';

export async function POST(request: NextRequest) {
    try {
        const { cvData, jobAnalysis, language }: {
            cvData: CVData;
            jobAnalysis: JobAnalysis;
            language: Language;
        } = await request.json();

        // Validate required data
        if (!cvData || !jobAnalysis || !language) {
            return NextResponse.json(
                { error: 'Missing required data: cvData, jobAnalysis, or language' },
                { status: 400 }
            );
        }

        // Create the prompt for cover letter generation
        const prompt = createCoverLetterPrompt(cvData, jobAnalysis, language);

        // Use OpenAI streaming API
        const stream = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-oss',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career counselor helping create compelling cover letters.
          Generate professional, personalized cover letters that highlight relevant skills and experiences.
          Write in ${language.nativeName} language.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            stream: true,
            max_tokens: 2000,
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
        console.error('Error generating cover letter:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}

function createCoverLetterPrompt(cvData: CVData, jobAnalysis: JobAnalysis, language: Language): string {
    return `
Please create a compelling cover letter based on the following information:

JOB POSITION DETAILS:
- Title: ${jobAnalysis.industry || 'Position'}
- Company: ${jobAnalysis.companySize || 'Company'}
- Location: ${jobAnalysis.location || 'Location'}
- Key Requirements: ${jobAnalysis.requirements.join(', ')}
- Keywords: ${jobAnalysis.keywords.join(', ')}

CANDIDATE'S BACKGROUND:
- Experience Level: ${cvData.experience?.length || 0} years
- Skills from CV: ${cvData.processedContent.substring(0, 500)}...

INSTRUCTIONS:
1. Write a professional cover letter in ${language.nativeName}
2. Highlight relevant experience and skills that match the job requirements
3. Keep it concise (250-400 words)
4. Use a professional but engaging tone
5. Include specific examples from the candidate's background
6. End with a strong call to action

Structure the cover letter with:
- Professional greeting
- Introduction paragraph
- 2-3 body paragraphs highlighting relevant experience
- Conclusion with call to action
- Professional sign-off
`;
}
