import { openai } from '../../../lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { CVData, JobAnalysis, Language } from '../../../lib/types';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    logger.apiRequest('/api/generate-email', 'POST', 0, { requestId, startTime });

    try {
        const { cvData, jobOffer, language, type = 'application' }: {
            cvData: CVData;
            jobOffer: string;
            language: Language;
            type?: 'application' | 'follow-up' | 'inquiry';
        } = await request.json();

        logger.info('Email generation request received', {
            requestId,
            type,
            language: language?.nativeName || 'unknown',
            jobOfferLength: jobOffer?.length || 0,
            hasCvData: !!cvData,
            hasJobOffer: !!jobOffer
        });



        // Validate required data
        if (!cvData || !jobOffer || !language) {
            logger.warn('Email generation request failed validation', {
                requestId,
                missingData: {
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

        // Create unified prompt for job analysis and email generation
        const unifiedPrompt = createUnifiedEmailPrompt(cvData.processedContent, jobOffer, language, type);

        logger.contentGeneration('Unified email prompt created', {
            requestId,
            promptLength: unifiedPrompt.length,
            type,
            language: language.nativeName
        });

        // Use OpenAI streaming API with unified prompt
        const openaiStartTime = Date.now();
        logger.info('Starting single OpenAI API call for job analysis and email generation', {
            requestId,
            model: process.env.OPENAI_MODEL || 'gpt-oss'
        });

        const stream = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-oss',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert career counselor and job analyst helping create professional job application emails. You will analyze job offers and create compelling, personalized emails that complement the candidate's application. Write in ${language.nativeName} language.`
                },
                {
                    role: 'user',
                    content: unifiedPrompt
                }
            ],
            stream: true,
            max_tokens: 2000,
            temperature: 0.7,
        });

        // Create a streaming response
        const encoder = new TextEncoder();
        let chunkCount = 0;
        let totalContentLength = 0;

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    logger.info('Starting email content streaming', { requestId });

                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            chunkCount++;
                            totalContentLength += content.length;
                            // Send the content chunk
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }

                    const openaiDuration = Date.now() - openaiStartTime;
                    logger.info('Email content streaming completed', {
                        requestId,
                        chunkCount,
                        totalContentLength,
                        openaiDuration
                    });

                    // Send completion signal
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                    controller.close();
                } catch (error) {
                    logger.error('Error during email content streaming', {
                        requestId,
                        error: error instanceof Error ? error.message : String(error),
                        chunkCount,
                        totalContentLength
                    });
                    controller.error(error);
                }
            },
        });

        const totalDuration = Date.now() - startTime;
        logger.apiRequest('/api/generate-email', 'POST', totalDuration, {
            requestId,
            success: true,
            totalDuration
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        const totalDuration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);

        logger.error('Email generation failed', {
            requestId,
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            totalDuration
        });

        return NextResponse.json(
            { error: 'Failed to generate email' },
            { status: 500 }
        );
    }
}

function createUnifiedEmailPrompt(cvContent: string, jobOffer: string, language: Language, type: string): string {


    const emailTypes = {
        application: 'job application submission',
        'follow-up': 'follow-up after application submission',
        inquiry: 'inquiry about job opportunities'
    };

    return `

JOB OFFER:
${jobOffer}

CANDIDATE'S CV CONTENT:
${cvContent}
Please extract dont display the following information from the CV and use it in the email:

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
1. First, extract and analyze dont display all the candidate information from the CV content
2. Analyze the job offer to understand the role, company, requirements, and expectations
3. Write a professional email in ${language.nativeName} that directly addresses the job requirements
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
5. Keep it concise (150-300 words)
6. Use a professional but engaging tone
7. Include specific examples from the candidate's background that relate to the job
8. End with a strong call to action
9. Use the candidate's actual name and contact information (EMAIL, PHONE, LOCATION, LINKEDIN, WEBSITE)
10. Reference specific projects, experiences, and achievements from their CV that are relevant to this position

Structure the email with:
- Professional subject line that captures attention
- Professional greeting using the candidate's NAME
- Introduction paragraph that shows understanding of the role and references their SUMMARY
- 1-2 body paragraphs highlighting relevant TECHNICAL SKILLS, SOFT SKILLS, and RECENT EXPERIENCE
- Mention specific PROJECTS and CERTIFICATIONS that demonstrate relevant capabilities
- Reference attached documents (CV and cover letter)
- Conclusion with call to action
- Professional sign-off with the candidate's NAME and contact information

Focus on creating a personalized email that demonstrates how the candidate's extracted background (experience, skills, education, projects) aligns with the specific job requirements mentioned in the job offer.
`;
}
