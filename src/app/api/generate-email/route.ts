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

        // Log detailed parameters that will be used in the prompt
        if (cvData) {
            logger.info('CV Data parameters for prompt', {
                requestId,
                personalInfo: {
                    name: cvData.personalInfo?.name || 'Not provided',
                    email: cvData.personalInfo?.email ? 'Provided' : 'Not provided',
                    phone: cvData.personalInfo?.phone ? 'Provided' : 'Not provided'
                },
                experience: {
                    count: cvData.experience?.length || 0,
                    totalYears: cvData.experience?.reduce((total, exp) => {
                        const duration = exp.duration.toLowerCase();
                        const yearsMatch = duration.match(/(\d+)\s*year/);
                        const monthsMatch = duration.match(/(\d+)\s*month/);
                        let years = 0;
                        if (yearsMatch) years += parseInt(yearsMatch[1]);
                        if (monthsMatch) years += parseInt(monthsMatch[1]) / 12;
                        return total + years;
                    }, 0) || 0,
                    recentTitles: cvData.experience?.slice(0, 2).map(exp => exp.title) || []
                },
                skills: {
                    technicalCount: cvData.skills?.technical?.length || 0,
                    softCount: cvData.skills?.soft?.length || 0,
                    technicalSkills: cvData.skills?.technical?.slice(0, 5) || [], // Log first 5 technical skills
                    softSkills: cvData.skills?.soft?.slice(0, 5) || [] // Log first 5 soft skills
                },
                education: {
                    count: cvData.education?.length || 0,
                    degrees: cvData.education?.map(edu => edu.degree) || []
                },
                summary: {
                    hasSummary: !!cvData.summary,
                    summaryLength: cvData.summary?.length || 0,
                    processedContentLength: cvData.processedContent?.length || 0
                }
            });
        }

        logger.info('Job offer parameters for prompt', {
            requestId,
            jobOffer: {
                length: jobOffer?.length || 0,
                preview: jobOffer?.substring(0, 200) + (jobOffer?.length > 200 ? '...' : ''),
                wordCount: jobOffer?.split(/\s+/).length || 0
            }
        });

        logger.info('Language and type parameters for prompt', {
            requestId,
            language: {
                code: language?.code || 'unknown',
                name: language?.name || 'unknown',
                nativeName: language?.nativeName || 'unknown'
            },
            emailType: {
                type,
                description: type === 'application' ? 'job application submission' :
                    type === 'follow-up' ? 'follow-up after application submission' :
                        type === 'inquiry' ? 'inquiry about job opportunities' : 'unknown'
            }
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
        const unifiedPrompt = createUnifiedEmailPrompt(cvData, jobOffer, language, type);

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

function createUnifiedEmailPrompt(cvData: CVData, jobOffer: string, language: Language, type: string): string {
    const emailTypes = {
        application: 'job application submission',
        'follow-up': 'follow-up after application submission',
        inquiry: 'inquiry about job opportunities'
    };

    // Calculate total years of experience from CV data
    const totalExperience = cvData.experience?.reduce((total, exp) => {
        // Extract years from duration string (e.g., "2 years", "1 year", "6 months")
        const duration = exp.duration.toLowerCase();
        const yearsMatch = duration.match(/(\d+)\s*year/);
        const monthsMatch = duration.match(/(\d+)\s*month/);

        let years = 0;
        if (yearsMatch) years += parseInt(yearsMatch[1]);
        if (monthsMatch) years += parseInt(monthsMatch[1]) / 12;

        return total + years;
    }, 0) || 0;

    // Get candidate's name from personal info
    const candidateName = cvData.personalInfo?.name || 'the candidate';

    // Get relevant skills from CV
    const technicalSkills = cvData.skills?.technical?.join(', ') || '';
    const softSkills = cvData.skills?.soft?.join(', ') || '';

    logger.debug('Creating unified email prompt', {
        type,
        language: language.nativeName,
        jobOfferLength: jobOffer.length,
        candidateName,
        totalExperience: Math.round(totalExperience * 10) / 10
    });

    // Log all calculated values that will be used in the prompt
    logger.info('Prompt parameters calculated', {
        emailType: emailTypes[type as keyof typeof emailTypes],
        candidateName,
        totalExperience: Math.round(totalExperience * 10) / 10,
        technicalSkills: technicalSkills || 'Not specified',
        softSkills: softSkills || 'Not specified',
        recentExperience: cvData.experience?.slice(0, 2).map(exp => `${exp.title} at ${exp.company}`).join(', ') || 'Not specified',
        education: cvData.education?.map(edu => `${edu.degree} from ${edu.institution}`).join(', ') || 'Not specified',
        summaryPreview: cvData.summary || cvData.processedContent.substring(0, 500),
        fullCvContentLength: cvData.processedContent.length,
        language: language.nativeName
    });

    return `
Please analyze the following job offer and create a professional email for ${emailTypes[type as keyof typeof emailTypes]} based on the candidate's background.

JOB OFFER:
${jobOffer}

CANDIDATE'S BACKGROUND:
- Name: ${candidateName}
- Total Experience: ${Math.round(totalExperience * 10) / 10} years
- Technical Skills: ${technicalSkills || 'Not specified'}
- Soft Skills: ${softSkills || 'Not specified'}
- Recent Experience: ${cvData.experience?.slice(0, 2).map(exp => `${exp.title} at ${exp.company}`).join(', ') || 'Not specified'}
- Education: ${cvData.education?.map(edu => `${edu.degree} from ${edu.institution}`).join(', ') || 'Not specified'}
- CV Summary: ${cvData.summary || cvData.processedContent.substring(0, 500)}...
- Full CV Content: ${cvData.processedContent}

INSTRUCTIONS:
1. Analyze the job offer to understand the role, company, requirements, and expectations
2. Write a professional email in ${language.nativeName} that directly addresses the job requirements
3. Include an appropriate subject line
4. Keep the email concise and impactful (150-300 words)
5. Reference the attached cover letter and CV
6. Show enthusiasm for the position and company
7. Include a professional sign-off
8. Use the candidate's actual name: ${candidateName}
9. Highlight relevant experience and skills that match the job requirements

Structure the email with:
- Clear, professional subject line
- Polite greeting
- Brief introduction mentioning how you found the position
- 1-2 paragraphs highlighting relevant qualifications and experience that match the job requirements
- Mention of attached documents
- Call to action or next steps
- Professional closing

Focus on creating a personalized email that demonstrates how the candidate's background aligns with the specific job requirements mentioned in the job offer.
`;
}
