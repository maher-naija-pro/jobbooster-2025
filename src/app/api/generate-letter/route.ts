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
        const unifiedPrompt = createUnifiedCoverLetterPrompt(cvData.processedContent, jobOffer, language);

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
                    content: `You are an expert career counselor and job analyst. You will analyze the job offer and CV content, then create a compelling cover letter in a single response. Extract relevant information from the CV and generate professional, personalized cover letters that highlight relevant skills and experiences. Write in ${language.nativeName} language.`
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



function createUnifiedCoverLetterPrompt(cvContent: string, jobOffer: string, language: Language): string {
    logger.debug('Creating unified cover letter prompt', {
        language: language.nativeName,
        jobOfferLength: jobOffer.length,
        cvContentLength: cvContent.length
    });

    return `
Please analyze the following job offer and CV content, then create a compelling cover letter.

JOB OFFER:
${jobOffer}

CANDIDATE'S CV CONTENT:
${cvContent}

Please extract dont display the following information from the CV and use it in the cover letter:

CANDIDATE'S BACKGROUND:

- Name: Extract the candidate's full name
- Email: Extract email address if available
- Phone: Extract phone number if available
- Location: Extract location/address if available
- LinkedIn: Extract LinkedIn profile URL if available
- Website: Extract personal website URL if available
- Total Experience: Calculate total years of experience
- Technical Skills: Extract and list technical skills
- Soft Skills: Extract and list soft skills
- Recent Experience: Summarize most recent work experience
- Education: Extract educational background
- Summary: Extract professional summary or objective
- Languages: Extract languages spoken
- Certifications: Extract certifications and licenses
- Projects: Extract notable projects and achievements

INSTRUCTIONS:
1. First, extract and analyze all the candidate information from the CV content
2. Analyze the job offer to understand the role, company, requirements, and expectations
3. Write a professional cover letter in ${language.nativeName} that directly addresses the job requirements
4. Use the extracted candidate information strategically:
   - Use the candidate's actual NAME 
   - Use the candidate's actual NAME in the greeting and sign-off
   - Reference their TOTAL EXPERIENCE to establish credibility
   - Highlight TECHNICAL SKILLS that match the job requirements
   - Mention SOFT SKILLS that align with the company culture
   - Include specific details from RECENT EXPERIENCE that relate to the role
   - Reference relevant EDUCATION if applicable to the position
   - Mention notable PROJECTS that demonstrate relevant capabilities
   - Include CERTIFICATIONS that add value to the application
   - Reference LANGUAGE skills if relevant to the role
   - Use the PROFESSIONAL SUMMARY as a foundation for the introduction
5. Keep it concise (250-400 words)
6. Use a professional but engaging tone
7. Include specific examples from the candidate's background that relate to the job
8. End with a strong call to action
9. Use the candidate's actual name and contact information (EMAIL, PHONE, LOCATION, LINKEDIN, WEBSITE)
10. Reference specific projects, experiences, and achievements from their CV that are relevant to this position

Structure the cover letter with:
- Professional greeting using the candidate's NAME
- Introduction paragraph that shows understanding of the role and references their SUMMARY
- 2-3 body paragraphs highlighting relevant TECHNICAL SKILLS, SOFT SKILLS, and RECENT EXPERIENCE
- Mention specific PROJECTS and CERTIFICATIONS that demonstrate relevant capabilities
- Conclusion with call to action
- Professional sign-off with the candidate's NAME and contact information

Focus on creating a personalized cover letter that demonstrates how the candidate's extracted background (experience, skills, education, projects) aligns with the specific job requirements mentioned in the job offer.
`;
}
