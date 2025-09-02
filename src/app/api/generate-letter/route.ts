import { openai } from '../../../lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { CVData, JobAnalysis, Language } from '../../../lib/types';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        logger.contentGeneration('Cover letter generation request received', {
            userAgent: request.headers.get('user-agent'),
            contentType: request.headers.get('content-type'),
            timestamp: new Date().toISOString()
        });

        const { cvData, jobOffer, language }: {
            cvData: CVData;
            jobOffer: string;
            language: Language;
        } = await request.json();

        logger.debug('Request data parsed successfully', {
            hasCvData: !!cvData,
            hasJobOffer: !!jobOffer,
            hasLanguage: !!language,
            language: language?.nativeName || 'unknown',
            jobOfferLength: jobOffer?.length || 0
        });

        // Validate required data
        if (!cvData || !jobOffer || !language) {
            logger.warn('Missing required data in cover letter generation request', {
                missingFields: {
                    cvData: !cvData,
                    jobOffer: !jobOffer,
                    language: !language
                }
            });

            return NextResponse.json(
                { error: 'Missing required data: cvData, jobOffer, or language' },
                { status: 400 }
            );
        }

        // Create unified prompt for job analysis and cover letter generation
        const unifiedPrompt = createUnifiedCoverLetterPrompt(cvData, jobOffer, language);

        logger.debug('Unified cover letter prompt created', {
            promptLength: unifiedPrompt.length,
            language: language.nativeName,
            jobOfferLength: jobOffer.length
        });

        // Use OpenAI streaming API with unified prompt
        logger.info('Initiating single OpenAI API call for job analysis and cover letter generation', {
            model: process.env.OPENAI_MODEL || 'gpt-oss',
            language: language.nativeName,
            maxTokens: 3000,
            temperature: 0.7
        });

        const stream = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-oss',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career counselor and job analyst. You will analyze job offers and create compelling cover letters in a single response. Generate professional, personalized cover letters that highlight relevant skills and experiences. Write in ${language.nativeName} language.`
                },
                {
                    role: 'user',
                    content: unifiedPrompt
                }
            ],
            stream: true,
            max_tokens: 3000,
            temperature: 0.7,
        });

        logger.info('OpenAI streaming response initiated successfully');

        // Create a streaming response
        const encoder = new TextEncoder();
        let chunkCount = 0;
        let totalContentLength = 0;

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    logger.debug('Starting to process OpenAI streaming chunks');

                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            chunkCount++;
                            totalContentLength += content.length;

                            // Send the content chunk
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }

                    logger.info('OpenAI streaming completed successfully', {
                        totalChunks: chunkCount,
                        totalContentLength: totalContentLength,
                        processingTime: Date.now() - startTime
                    });

                    // Send completion signal
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                    controller.close();
                } catch (error) {
                    logger.error('Error during OpenAI streaming', {
                        error: error instanceof Error ? error.message : String(error),
                        chunkCount,
                        totalContentLength,
                        processingTime: Date.now() - startTime
                    });
                    controller.error(error);
                }
            },
        });

        logger.contentGeneration('Cover letter generation response prepared successfully', {
            language: language.nativeName,
            processingTime: Date.now() - startTime,
            responseType: 'streaming'
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        const processingTime = Date.now() - startTime;

        logger.error('Failed to generate cover letter', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            processingTime,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent'),
            contentType: request.headers.get('content-type')
        });

        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}

function createUnifiedCoverLetterPrompt(cvData: CVData, jobOffer: string, language: Language): string {
    logger.debug('Creating unified cover letter prompt', {
        language: language.nativeName,
        jobOfferLength: jobOffer.length,
        hasCvData: !!cvData,
        cvSkillsCount: cvData.skills?.technical?.length || 0
    });

    return `
Please analyze the following job offer and create a compelling cover letter based on the candidate's background.

JOB OFFER:
${jobOffer}

CANDIDATE'S BACKGROUND:
- Name: ${cvData.personalInfo?.name || 'Candidate'}
- Email: ${cvData.personalInfo?.email || ''}
- Phone: ${cvData.personalInfo?.phone || ''}
- Location: ${cvData.personalInfo?.location || ''}
- LinkedIn: ${cvData.personalInfo?.linkedin || ''}
- Website: ${cvData.personalInfo?.website || ''}
- Experience Level: ${cvData.experience?.length || 0} years
- Summary: ${cvData.summary || ''}
- Technical Skills: ${cvData.skills?.technical?.join(', ') || ''}
- Soft Skills: ${cvData.skills?.soft?.join(', ') || ''}
- Languages: ${cvData.skills?.languages?.join(', ') || ''}
- Certifications: ${cvData.skills?.certifications?.join(', ') || ''}
- Experience Details: ${cvData.experience?.map(exp => `${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n') || ''}
- Education: ${cvData.education?.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`).join('\n') || ''}
- Projects: ${cvData.projects?.map(proj => `${proj.name}: ${proj.description} (Technologies: ${proj.technologies.join(', ')})`).join('\n') || ''}
- Full CV Content: ${cvData.processedContent}

INSTRUCTIONS:
1. Analyze the job offer to understand the role, company, requirements, and expectations
2. Write a professional cover letter in ${language.nativeName} that directly addresses the job requirements
3. Highlight relevant experience and skills that match the job requirements
4. Keep it concise (250-400 words)
5. Use a professional but engaging tone
6. Include specific examples from the candidate's background that relate to the job
7. End with a strong call to action
8. Use the candidate's actual name and contact information
9. Reference specific projects, experiences, and achievements from their CV that are relevant to this position

Structure the cover letter with:
- Professional greeting
- Introduction paragraph that shows understanding of the role
- 2-3 body paragraphs highlighting relevant experience and skills
- Conclusion with call to action
- Professional sign-off

Focus on creating a personalized cover letter that demonstrates how the candidate's background aligns with the specific job requirements mentioned in the job offer.
`;
}
