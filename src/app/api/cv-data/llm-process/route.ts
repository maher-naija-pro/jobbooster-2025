import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import { logger } from '@/lib/logger';
import { generateAnonymousSessionId } from '@/lib/anonymous-session';
import { ProcessingStatus } from '@prisma/client';

// Environment validation
const requiredEnvVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables', { missingEnvVars });
}

// POST - Process CV data with LLM to generate AI fields
export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let cvId: string | undefined;

    logger.info('CV Data LLM Processing request started', {
        requestId,
        endpoint: '/api/cv-data/llm-process',
        method: 'POST'
    });

    // Mac-specific logging
    logger.macProcessStart('CV LLM Processing', {
        requestId,
        endpoint: '/api/cv-data/llm-process',
        method: 'POST'
    });

    try {
        type LLMProcessRequestBody = {
            cvId?: string;
            forceReprocess?: boolean;
            sessionId?: string;
        };

        let body: unknown;
        try {
            body = await request.json();
        } catch (parseError) {
            logger.warn('Invalid JSON in request body', {
                requestId,
                error: parseError instanceof Error ? parseError.message : String(parseError)
            });
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        // Validate request body structure
        if (!body || typeof body !== 'object') {
            logger.warn('Invalid request body structure', { requestId });
            return NextResponse.json(
                { error: 'Request body must be a valid JSON object' },
                { status: 400 }
            );
        }

        const { cvId: requestCvId, forceReprocess = false, sessionId } = (body as Partial<LLMProcessRequestBody>);
        cvId = requestCvId;

        logger.info('LLM processing request details', {
            requestId,
            cvId,
            sessionId,
            forceReprocess
        });

        if (!cvId || typeof cvId !== 'string' || cvId.trim() === '') {
            logger.warn('Missing or invalid CV ID for LLM processing', { requestId, cvId });
            return NextResponse.json(
                { error: 'CV ID is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        // Validate forceReprocess parameter
        if (forceReprocess !== undefined && typeof forceReprocess !== 'boolean') {
            logger.warn('Invalid forceReprocess parameter', { requestId, forceReprocess });
            return NextResponse.json(
                { error: 'forceReprocess must be a boolean value' },
                { status: 400 }
            );
        }

        // Check for missing environment variables
        if (missingEnvVars.length > 0) {
            logger.error('Missing required environment variables', {
                requestId,
                missingEnvVars
            });
            return NextResponse.json(
                { error: 'Server configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // Test database connection
        try {
            await prisma.$queryRaw`SELECT 1`;
            logger.macSystemInfo({
                requestId,
                component: 'database',
                status: 'connected'
            });
        } catch (dbError) {
            logger.error('Database connection failed', {
                requestId,
                error: dbError instanceof Error ? dbError.message : String(dbError)
            });
            logger.macError(dbError instanceof Error ? dbError : new Error(String(dbError)), {
                requestId,
                component: 'database',
                operation: 'connection_test'
            });
            return NextResponse.json(
                { error: 'Database connection failed. Please try again later.' },
                { status: 500 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isAuthenticated = !!user;
        let currentUserId = user?.id;

        // For anonymous users, create a temporary profile if needed
        if (!isAuthenticated) {
            const anonymousId = sessionId || generateAnonymousSessionId();

            try {
                // Create a temporary profile for anonymous user if it doesn't exist
                const profile = await prisma.profile.upsert({
                    where: { userId: anonymousId },
                    update: {},
                    create: {
                        userId: anonymousId,
                        email: `anonymous-${anonymousId}@temp.local`,
                        fullName: `Anonymous User ${anonymousId.substring(0, 8)}`,
                        preferences: {},
                        subscription: { plan: 'free' }
                    }
                });

                logger.info('Anonymous profile created for LLM processing', {
                    profileId: profile.userId,
                    email: profile.email,
                    requestId
                });

                currentUserId = anonymousId;
            } catch (profileError) {
                logger.error('Failed to create anonymous profile for LLM processing', {
                    anonymousId,
                    error: profileError instanceof Error ? profileError.message : String(profileError),
                    requestId
                });
                throw new Error('Failed to create anonymous user profile');
            }
        }

        // Get CV data
        logger.info('Looking up CV data', {
            requestId,
            cvId,
            currentUserId,
            isAuthenticated
        });

        interface CvData {
            id: string;
            userId: string;
            fileName?: string | null;
            processingStatus?: ProcessingStatus | string | null;
            professionalSummary?: string | null;
            extractedText?: string | null;
            analysisCount?: number | null;
            lastAnalyzedAt?: Date | null;
            firstName?: string | null;
            lastName?: string | null;
            fullName?: string | null;
            email?: string | null;
            phone?: string | null;
            nationality?: string | null;
            linkedinUrl?: string | null;
            websiteUrl?: string | null;
            githubUrl?: string | null;
            dateOfBirth?: Date | null;
            technicalSkills?: unknown;
            softSkills?: unknown;
            languages?: unknown;
            certifications?: unknown;
            education?: unknown;
            workExperience?: unknown;
            projects?: unknown;
            metadata?: unknown;
        }


        const cvData = await prisma.cvData.findFirst({
            where: {
                id: cvId,
                userId: currentUserId
            }
        }) as CvData | null;

        if (!cvData) {
            logger.warn('CV not found or no permission to process', {
                requestId,
                cvId,
                userId: currentUserId,
                isAuthenticated
            });
            return NextResponse.json(
                { error: 'CV not found or no permission to process' },
                { status: 404 }
            );
        }

        logger.info('CV data found', {
            requestId,
            cvId,
            fileName: cvData.fileName,
            processingStatus: cvData.processingStatus
        });

        // Check if already processed and not forcing reprocess
        if (!forceReprocess && cvData.processingStatus === 'COMPLETED' && cvData.professionalSummary) {
            logger.info('CV already processed, returning existing data', {
                requestId,
                cvId,
                processingStatus: cvData.processingStatus
            });
            return NextResponse.json({
                success: true,
                data: cvData,
                message: 'CV already processed',
                processingTime: Date.now() - startTime
            });
        }

        // Update processing status
        await prisma.cvData.update({
            where: { id: cvId },
            data: {
                processingStatus: ProcessingStatus.PROCESSING,
                processingStartedAt: new Date(),
                processingError: null
            }
        });

        logger.info('Starting LLM processing', {
            requestId,
            cvId,
            extractedTextLength: cvData.extractedText?.length || 0
        });

        // Mac-specific LLM processing start
        logger.macProcessStart('OpenAI LLM Analysis', {
            requestId,
            cvId,
            extractedTextLength: cvData.extractedText?.length || 0,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
        });

        // Prepare the prompt for comprehensive CV analysis
        const analysisPrompt = `
Analyze the following CV data and extract ALL relevant information. Return a JSON response with the following EXACT structure that covers every possible field from the database schema:

{
  "personalInfo": {
    "firstName": "extracted_first_name",
    "lastName": "extracted_last_name", 
    "email": "extracted_email",
    "phone": "extracted_phone",
    "nationality": "extracted_nationality",
    "linkedinUrl": "extracted_linkedin_url",
    "websiteUrl": "extracted_website_url",
    "githubUrl": "extracted_github_url",
    "dateOfBirth": "YYYY-MM-DD or null"
  },
  "technicalSkills": [
    {
      "name": "individual_skill_name",
      "category": "programming|framework|tool|database|cloud|mobile|devops|design|ai_ml|security|testing|other",
      "level": "beginner|intermediate|advanced|expert",
      "yearsOfExperience": number,
      "proficiency": "1-10 scale",
      "certification": "certification_name_or_null"
    }
  ],
  "softSkills": [
    {
      "name": "individual_skill_name",
      "level": "beginner|intermediate|advanced|expert",
      "category": "leadership|communication|problem_solving|teamwork|adaptability|creativity|time_management|negotiation|other",
      "yearsOfExperience": number
    }
  ],
  "languages": [
    {
      "name": "language_name",
      "proficiency": "native|fluent|conversational|basic",
      "certification": "certification_name_or_null"
    }
  ],
  "certifications": [
    {
      "name": "certification_name",
      "issuer": "issuing_organization",
      "date": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD_or_null",
      "credentialId": "credential_id_or_null"
    }
  ],
  "education": [
    {
      "degree": "degree_name",
      "institution": "institution_name",
      "fieldOfStudy": "field_of_study",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD_or_null",
      "location": "location",
      "description": "description_or_null"
    }
  ],
  "workExperience": [
    {
      "title": "job_title",
      "company": "company_name",
      "location": "location",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD_or_null",
      "isCurrent": boolean,
      "description": "job_description",
      "achievements": ["achievement1", "achievement2"],
      "skills": ["individual_skill1", "individual_skill2"],
      "responsibilities": ["responsibility1", "responsibility2"],
      "employmentType": "full_time|part_time|contract|internship|freelance|consultant",
      "companySize": "startup|small|medium|large|enterprise",
      "industry": "industry_name",
      "salary": "salary_range_or_null",
      "teamSize": number,
      "reportingTo": "manager_title_or_null",
      "directReports": number,
      "companyType": "public|private|nonprofit|government|startup",
      "country": "country_name"
    }
  ],
  "projects": [
    {
      "name": "project_name",
      "description": "project_description",
      "technologies": ["individual_tech1", "individual_tech2"],
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD_or_null",
      "url": "project_url_or_null"
    }
  ]
 
}

CRITICAL INSTRUCTIONS:
1. Extract ALL information from the CV text, don't make assumptions
2. If information is not available, use null for optional fields
3. For dates, use YYYY-MM-DD format or null if not available
4. Be thorough in extracting skills, experience, and education
5. Generate a professional summary if not explicitly provided
6. Calculate analysis scores based on content completeness and quality
7. Return ONLY valid JSON, no explanatory text
8. IMPORTANT: List each skill individually, not grouped. For example, instead of "JavaScript, React, Node.js" as one skill, create separate entries for "JavaScript", "React", and "Node.js"
9. Break down any grouped skills or technologies into individual entries
10. For technical skills, work experience skills, and project technologies, ensure each item is listed separately

CV Data:
- ID: ${cvData.id}
- Filename: ${cvData.fileName}
- Extracted Text: ${cvData.extractedText || 'No text available'}

Please provide a comprehensive analysis of this CV with individual skills listed separately.
`;

        const openaiStartTime = Date.now();

        logger.debug('Calling OpenAI API for CV analysis', {
            requestId,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            promptLength: analysisPrompt.length,
            temperature: 0.1,
            maxTokens: 8000
        });

        let openaiResponse;
        try {
            openaiResponse = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert CV analyst. Extract all relevant information from CVs and return structured JSON data. Be thorough and accurate. Return ONLY valid JSON, no explanatory text.'
                    },
                    {
                        role: 'user',
                        content: analysisPrompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 8000,
            });
        } catch (openaiError) {
            logger.error('OpenAI API call failed', {
                requestId,
                error: openaiError instanceof Error ? openaiError.message : String(openaiError),
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
            });

            // Mac-specific error logging
            logger.macError(openaiError instanceof Error ? openaiError : new Error(String(openaiError)), {
                requestId,
                component: 'openai',
                operation: 'api_call',
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
            });

            await prisma.cvData.update({
                where: { id: cvId },
                data: {
                    processingStatus: ProcessingStatus.FAILED,
                    processingError: 'OpenAI service unavailable',
                    processingCompletedAt: new Date()
                }
            });

            return NextResponse.json(
                { error: 'AI service temporarily unavailable. Please try again later.' },
                { status: 503 }
            );
        }

        const openaiProcessingTime = Date.now() - openaiStartTime;

        logger.info('OpenAI API call completed', {
            requestId,
            processingTime: openaiProcessingTime,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            responseLength: openaiResponse.choices[0]?.message?.content?.length || 0
        });

        // Mac-specific performance logging
        logger.macPerformance('OpenAI API Call', openaiProcessingTime, {
            requestId,
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            responseLength: openaiResponse.choices[0]?.message?.content?.length || 0
        });

        const aiResponse = openaiResponse.choices[0]?.message?.content;

        if (!aiResponse) {
            logger.error('No response from AI service', {
                requestId,
                openaiProcessingTime,
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
            });

            await prisma.cvData.update({
                where: { id: cvId },
                data: {
                    processingStatus: ProcessingStatus.FAILED,
                    processingError: 'No response from AI service',
                    processingCompletedAt: new Date()
                }
            });

            return NextResponse.json(
                { error: 'No response from AI service' },
                { status: 500 }
            );
        }

        // Parse the AI response
        interface AnalysisResult {
            personalInfo?: {
                firstName?: string | null;
                lastName?: string | null;
                fullName?: string | null;
                email?: string | null;
                phone?: string | null;
                nationality?: string | null;
                linkedinUrl?: string | null;
                websiteUrl?: string | null;
                githubUrl?: string | null;
                dateOfBirth?: string | null;
            } | null;
            professionalSummary?: string | null;
            technicalSkills?: unknown[] | null;
            softSkills?: unknown[] | null;
            languages?: unknown[] | null;
            certifications?: unknown[] | null;
            education?: unknown[] | null;
            workExperience?: unknown[] | null;
            projects?: unknown[] | null;
            publications?: unknown[] | null;
            awards?: unknown[] | null;
            volunteerWork?: unknown[] | null;
            references?: unknown[] | null;
            interests?: unknown[] | null;
            analysis?: {
                completenessScore?: number | null;
                readabilityScore?: number | null;
                atsScore?: number | null;
                overallQuality?: number | string | null;
                marketability?: unknown;
                skillsGaps?: unknown;
                careerProgression?: unknown;
                careerLevel?: unknown;
                industry?: unknown;
                yearsOfExperience?: unknown;
                keywordDensity?: unknown;
                improvementSuggestions?: unknown;
                templateTags?: unknown;
                dataQuality?: unknown;
            } | null;
            metadata?: {
                extractionVersion?: string | null;
                [key: string]: unknown;
            } | null;
        }

        let analysisResult: AnalysisResult;
        try {
            logger.debug('Parsing AI response', {
                requestId,
                responseLength: aiResponse.length,
                responsePreview: aiResponse.substring(0, 200) + '...'
            });

            // Extract JSON from the response with improved logic
            let jsonString = aiResponse.trim();

            // Find the first complete JSON object
            const jsonStartIndex = jsonString.indexOf('{');
            if (jsonStartIndex === -1) {
                throw new Error('No JSON object found in response');
            }

            jsonString = jsonString.substring(jsonStartIndex);

            // Find the matching closing brace
            let braceCount = 0;
            let lastBraceIndex = -1;

            for (let i = 0; i < jsonString.length; i++) {
                if (jsonString[i] === '{') {
                    braceCount++;
                } else if (jsonString[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        lastBraceIndex = i;
                        break;
                    }
                }
            }

            if (lastBraceIndex === -1) {
                throw new Error('No complete JSON object found in response');
            }

            jsonString = jsonString.substring(0, lastBraceIndex + 1);

            analysisResult = JSON.parse(jsonString) as AnalysisResult;

            // Validate that we have the expected structure
            if (!analysisResult || typeof analysisResult !== 'object') {
                throw new Error('Invalid JSON structure in response');
            }

            logger.info('AI response parsed successfully', {
                requestId,
                hasPersonalInfo: !!analysisResult.personalInfo,
                hasTechnicalSkills: !!analysisResult.technicalSkills,
                hasWorkExperience: !!analysisResult.workExperience,
                skillsCount: analysisResult.technicalSkills?.length || 0,
                experienceCount: analysisResult.workExperience?.length || 0
            });

        } catch (parseError) {
            logger.error('Failed to parse AI response', {
                requestId,
                error: parseError instanceof Error ? parseError.message : String(parseError),
                aiResponse: aiResponse.substring(0, 500) + '...'
            });

            await prisma.cvData.update({
                where: { id: cvId },
                data: {
                    processingStatus: ProcessingStatus.FAILED,
                    processingError: 'Invalid response format from AI service',
                    processingCompletedAt: new Date()
                }
            });

            return NextResponse.json(
                { error: 'Invalid response format from AI service' },
                { status: 500 }
            );
        }

        // Update CV data with LLM-generated fields
        type CvDataUpdateInput = {
            processingStatus: ProcessingStatus;
            processingCompletedAt: Date;
            processingTime: number;
            processingError: null | string;
            analysisCount: number;
            lastAnalyzedAt: Date;
            firstName?: string | null;
            lastName?: string | null;
            fullName?: string | null;
            email?: string | null;
            phone?: string | null;
            nationality?: string | null;
            linkedinUrl?: string | null;
            websiteUrl?: string | null;
            githubUrl?: string | null;
            dateOfBirth?: Date | null;
            professionalSummary?: string | null;
            technicalSkills?: any;
            softSkills?: any;
            languages?: any;
            certifications?: any;
            education?: any;
            workExperience?: any;
            projects?: any;
            metadata?: any;
        };

        const updateData: CvDataUpdateInput = {
            processingStatus: ProcessingStatus.COMPLETED,
            processingCompletedAt: new Date(),
            processingTime: openaiProcessingTime,
            processingError: null,
            analysisCount: (cvData.analysisCount || 0) + 1,
            lastAnalyzedAt: new Date(),

            // Personal information (update if not already set)
            firstName: analysisResult.personalInfo?.firstName || cvData.firstName,
            lastName: analysisResult.personalInfo?.lastName || cvData.lastName,
            fullName: analysisResult.personalInfo?.fullName || cvData.fullName,
            email: analysisResult.personalInfo?.email || cvData.email,
            phone: analysisResult.personalInfo?.phone || cvData.phone,
            nationality: analysisResult.personalInfo?.nationality || cvData.nationality,
            linkedinUrl: analysisResult.personalInfo?.linkedinUrl || cvData.linkedinUrl,
            websiteUrl: analysisResult.personalInfo?.websiteUrl || cvData.websiteUrl,
            githubUrl: analysisResult.personalInfo?.githubUrl || cvData.githubUrl,
            dateOfBirth: analysisResult.personalInfo?.dateOfBirth ? new Date(analysisResult.personalInfo.dateOfBirth) : cvData.dateOfBirth,

            // LLM-generated fields
            professionalSummary: analysisResult.professionalSummary,
            technicalSkills: analysisResult.technicalSkills || [],
            softSkills: analysisResult.softSkills || [],
            languages: analysisResult.languages || [],
            certifications: analysisResult.certifications || [],
            education: analysisResult.education || [],
            workExperience: analysisResult.workExperience || [],
            projects: analysisResult.projects || [],

            // Analysis scores (stored in metadata since they're commented out in schema)
            // completenessScore: analysisResult.analysis?.completenessScore || null,
            // readabilityScore: analysisResult.analysis?.readabilityScore || null,
            // atsScore: analysisResult.analysis?.atsScore || null,

            // Update metadata
            metadata: {
                ...((cvData.metadata as Record<string, unknown>) || {}),
                llmProcessing: {
                    requestId,
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    processingTime: openaiProcessingTime,
                    timestamp: new Date().toISOString(),
                    analysisVersion: '1.0.0'
                },
                lastLLMProcessedAt: new Date().toISOString(),
                // Store analysis scores in metadata since they're commented out in schema
                analysisScores: {
                    completenessScore: analysisResult.analysis?.completenessScore || null,
                    readabilityScore: analysisResult.analysis?.readabilityScore || null,
                    atsScore: analysisResult.analysis?.atsScore || null,
                    overallQuality: analysisResult.analysis?.overallQuality || null
                },
                // Store additional analysis data
                keywordDensity: analysisResult.analysis?.keywordDensity || null,
                improvementSuggestions: analysisResult.analysis?.improvementSuggestions || null,
                templateTags: analysisResult.analysis?.templateTags || null,
                dataQuality: analysisResult.analysis?.dataQuality || null,
                // Store additional extracted data
                publications: analysisResult.publications || null,
                awards: analysisResult.awards || null,
                volunteerWork: analysisResult.volunteerWork || null,
                references: analysisResult.references || null,
                interests: analysisResult.interests || null,
                // Store advanced analysis
                marketability: analysisResult.analysis?.marketability || null,
                skillsGaps: analysisResult.analysis?.skillsGaps || null,
                careerProgression: analysisResult.analysis?.careerProgression || null,
                // Store extraction metadata
                extractionMetadata: analysisResult.metadata || null
            }
        };

        const updatedCvData = await prisma.cvData.update({
            where: { id: cvId },
            data: updateData
        });

        const totalProcessingTime = Date.now() - startTime;

        logger.info('CV LLM processing completed successfully', {
            requestId,
            cvId,
            openaiProcessingTime,
            totalProcessingTime,
            skillsCount: analysisResult.technicalSkills?.length || 0,
            experienceCount: analysisResult.workExperience?.length || 0,
            educationCount: analysisResult.education?.length || 0,
            projectCount: analysisResult.projects?.length || 0,
            certificationCount: analysisResult.certifications?.length || 0,
            publicationCount: analysisResult.publications?.length || 0,
            awardCount: analysisResult.awards?.length || 0,
            completenessScore: analysisResult.analysis?.completenessScore,
            overallQuality: analysisResult.analysis?.overallQuality,
            careerLevel: analysisResult.analysis?.careerLevel,
            industry: analysisResult.analysis?.industry,
            yearsOfExperience: analysisResult.analysis?.yearsOfExperience,
            extractionVersion: analysisResult.metadata?.extractionVersion
        });

        // Mac-specific process completion logging
        logger.macProcessEnd('CV LLM Processing', totalProcessingTime, {
            requestId,
            cvId,
            openaiProcessingTime,
            skillsCount: analysisResult.technicalSkills?.length || 0,
            experienceCount: analysisResult.workExperience?.length || 0,
            educationCount: analysisResult.education?.length || 0,
            projectCount: analysisResult.projects?.length || 0,
            completenessScore: analysisResult.analysis?.completenessScore,
            overallQuality: analysisResult.analysis?.overallQuality,
            careerLevel: analysisResult.analysis?.careerLevel,
            yearsOfExperience: analysisResult.analysis?.yearsOfExperience
        });

        return NextResponse.json({
            success: true,
            data: updatedCvData,
            analysis: analysisResult,
            processingTime: totalProcessingTime,
            openaiProcessingTime
        });

    } catch (error) {
        const totalProcessingTime = Date.now() - startTime;

        logger.error('Error in CV LLM processing', {
            requestId,
            error: error instanceof Error ? error.message : String(error),
            processingTime: totalProcessingTime
        });

        // Mac-specific error logging
        logger.macError(error instanceof Error ? error : new Error(String(error)), {
            requestId,
            component: 'cv_llm_processing',
            operation: 'main_process',
            processingTime: totalProcessingTime
        });

        // Update CV status to failed - use cvId from the outer scope
        try {
            if (typeof cvId !== 'undefined') {
                await prisma.cvData.update({
                    where: { id: cvId },
                    data: {
                        processingStatus: ProcessingStatus.FAILED,
                        processingError: error instanceof Error ? error.message : String(error),
                        processingCompletedAt: new Date()
                    }
                });
            }
        } catch (updateError) {
            logger.error('Failed to update CV status after error', {
                requestId,
                updateError: updateError instanceof Error ? updateError.message : String(updateError)
            });
        }

        return NextResponse.json(
            { error: 'Failed to process CV with LLM' },
            { status: 500 }
        );
    }
}
