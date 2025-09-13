import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JobDataService, CreateJobDataInput } from '@/lib/@job-data/job-data';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    logger.info('Job data GET request initiated', {
        action: 'get_job_data',
        timestamp: new Date().toISOString(),
        url: request.url
    });

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('Unauthorized job data GET request', {
                action: 'get_job_data',
                step: 'authentication',
                error: authError?.message || 'No user found',
                hasAuthError: !!authError,
                hasUser: !!user
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.debug('User authenticated for job data GET', {
            action: 'get_job_data',
            step: 'authentication',
            userId: user.id
        });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || undefined;
        const archived = searchParams.get('archived') === 'true' ? true : searchParams.get('archived') === 'false' ? false : undefined;

        logger.debug('Job data GET request parameters', {
            action: 'get_job_data',
            step: 'parameter_extraction',
            userId: user.id,
            page,
            limit,
            status,
            archived,
            hasStatus: !!status,
            hasArchived: archived !== undefined
        });

        const result = await JobDataService.getByUserId(user.id, {
            page,
            limit,
            status,
            isArchived: archived,
        });

        // Debug logging
        console.log('API - user.id:', user.id);
        console.log('API - result.data.length:', result.data?.length);
        console.log('API - result.pagination:', result.pagination);

        const duration = Date.now() - startTime;
        logger.info('Job data GET request completed successfully', {
            action: 'get_job_data',
            step: 'completion',
            userId: user.id,
            duration: `${duration}ms`,
            resultCount: result.data?.length || 0,
            totalCount: result.pagination?.total || 0,
            page,
            limit
        });

        return NextResponse.json(result);
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Error fetching job data', {
            action: 'get_job_data',
            step: 'error',
            duration: `${duration}ms`,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        console.error('Error fetching job data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    logger.info('Job data POST request initiated', {
        action: 'create_job_data',
        timestamp: new Date().toISOString(),
        url: request.url
    });

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('Unauthorized job data POST request', {
                action: 'create_job_data',
                step: 'authentication',
                error: authError?.message || 'No user found',
                hasAuthError: !!authError,
                hasUser: !!user
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.debug('User authenticated for job data POST', {
            action: 'create_job_data',
            step: 'authentication',
            userId: user.id
        });

        const body = await request.json();
        const { content, title, company, ...otherFields } = body;

        logger.debug('Job data POST request body parsed', {
            action: 'create_job_data',
            step: 'body_parsing',
            userId: user.id,
            hasContent: !!content,
            contentLength: content?.length || 0,
            hasTitle: !!title,
            hasCompany: !!company,
            otherFieldsCount: Object.keys(otherFields).length
        });

        if (!content || content.trim().length < 100) {
            logger.warn('Job data POST validation failed - content too short', {
                action: 'create_job_data',
                step: 'validation',
                userId: user.id,
                contentLength: content?.length || 0,
                contentProvided: !!content
            });
            return NextResponse.json(
                { error: 'Job content must be at least 100 characters long' },
                { status: 400 }
            );
        }

        const jobDataInput: CreateJobDataInput = {
            userId: user.id,
            content: content.trim(),
            title: title?.trim() || undefined,
            company: company?.trim() || undefined,
            ...otherFields,
        };

        logger.debug('Job data input prepared for creation', {
            action: 'create_job_data',
            step: 'input_preparation',
            userId: user.id,
            contentLength: jobDataInput.content.length,
            hasTitle: !!jobDataInput.title,
            hasCompany: !!jobDataInput.company,
            titleLength: jobDataInput.title?.length || 0,
            companyLength: jobDataInput.company?.length || 0
        });

        logger.debug('Attempting to create job data', {
            action: 'create_job_data',
            step: 'database_creation',
            userId: user.id,
            jobDataInput: {
                userId: jobDataInput.userId,
                contentLength: jobDataInput.content?.length || 0,
                hasTitle: !!jobDataInput.title,
                hasCompany: !!jobDataInput.company,
                title: jobDataInput.title,
                company: jobDataInput.company
            }
        });

        const jobData = await JobDataService.create(jobDataInput);

        const duration = Date.now() - startTime;
        logger.info('Job data POST request completed successfully', {
            action: 'create_job_data',
            step: 'completion',
            userId: user.id,
            jobDataId: jobData.id,
            duration: `${duration}ms`,
            contentLength: jobData.content?.length || 0,
            hasTitle: !!jobData.title,
            hasCompany: !!jobData.companyName
        });

        return NextResponse.json(jobData);
    } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;

        logger.error('Error creating job data', {
            action: 'create_job_data',
            step: 'error',
            duration: `${duration}ms`,
            error: errorMessage,
            stack: errorStack,
            errorType: error?.constructor?.name || 'Unknown',
            errorString: String(error)
        });

        console.error('Error creating job data:', {
            message: errorMessage,
            stack: errorStack,
            error: error
        });

        return NextResponse.json(
            {
                error: 'Failed to create job data',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}
