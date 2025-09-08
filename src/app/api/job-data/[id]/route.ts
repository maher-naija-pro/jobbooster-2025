import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JobDataService, UpdateJobDataInput } from '@/lib/@job-data/job-data';
import { logger } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const startTime = Date.now();
    logger.info('Job data GET by ID request initiated', {
        action: 'get_job_data_by_id',
        timestamp: new Date().toISOString(),
        jobDataId: params.id,
        url: request.url
    });

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('Unauthorized job data GET by ID request', {
                action: 'get_job_data_by_id',
                step: 'authentication',
                jobDataId: params.id,
                error: authError?.message || 'No user found',
                hasAuthError: !!authError,
                hasUser: !!user
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.debug('User authenticated for job data GET by ID', {
            action: 'get_job_data_by_id',
            step: 'authentication',
            userId: user.id,
            jobDataId: params.id
        });

        const jobData = await JobDataService.getById(params.id, user.id);

        if (!jobData) {
            logger.warn('Job data not found for GET by ID request', {
                action: 'get_job_data_by_id',
                step: 'data_retrieval',
                userId: user.id,
                jobDataId: params.id
            });
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }

        logger.debug('Job data found, incrementing view count', {
            action: 'get_job_data_by_id',
            step: 'view_count_increment',
            userId: user.id,
            jobDataId: params.id,
            currentViewCount: jobData.viewCount || 0
        });

        // Increment view count
        await JobDataService.incrementViewCount(params.id);

        const duration = Date.now() - startTime;
        logger.info('Job data GET by ID request completed successfully', {
            action: 'get_job_data_by_id',
            step: 'completion',
            userId: user.id,
            jobDataId: params.id,
            duration: `${duration}ms`,
            contentLength: jobData.content?.length || 0,
            hasTitle: !!jobData.title,
            hasCompany: !!jobData.companyName,
            viewCount: (jobData.viewCount || 0) + 1
        });

        return NextResponse.json(jobData);
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Error fetching job data by ID', {
            action: 'get_job_data_by_id',
            step: 'error',
            jobDataId: params.id,
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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const startTime = Date.now();
    logger.info('Job data PUT request initiated', {
        action: 'update_job_data',
        timestamp: new Date().toISOString(),
        jobDataId: params.id,
        url: request.url
    });

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('Unauthorized job data PUT request', {
                action: 'update_job_data',
                step: 'authentication',
                jobDataId: params.id,
                error: authError?.message || 'No user found',
                hasAuthError: !!authError,
                hasUser: !!user
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.debug('User authenticated for job data PUT', {
            action: 'update_job_data',
            step: 'authentication',
            userId: user.id,
            jobDataId: params.id
        });

        const body = await request.json();
        const updateData: UpdateJobDataInput = { ...body };

        logger.debug('Job data PUT request body parsed', {
            action: 'update_job_data',
            step: 'body_parsing',
            userId: user.id,
            jobDataId: params.id,
            updateFields: Object.keys(updateData),
            updateFieldsCount: Object.keys(updateData).length,
            hasContent: 'content' in updateData,
            hasTitle: 'title' in updateData,
            hasCompany: 'company' in updateData,
            contentLength: updateData.content?.length || 0,
            titleLength: updateData.title?.length || 0,
            companyLength: updateData.company?.length || 0
        });

        const jobData = await JobDataService.update(params.id, user.id, updateData);

        const duration = Date.now() - startTime;
        logger.info('Job data PUT request completed successfully', {
            action: 'update_job_data',
            step: 'completion',
            userId: user.id,
            jobDataId: params.id,
            duration: `${duration}ms`,
            updatedFields: Object.keys(updateData),
            contentLength: jobData.content?.length || 0,
            hasTitle: !!jobData.title,
            hasCompany: !!jobData.companyName
        });

        return NextResponse.json(jobData);
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Error updating job data', {
            action: 'update_job_data',
            step: 'error',
            jobDataId: params.id,
            duration: `${duration}ms`,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            isNotFoundError: error instanceof Error && error.message === 'Job data not found'
        });
        console.error('Error updating job data:', error);
        if (error instanceof Error && error.message === 'Job data not found') {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Failed to update job data' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const startTime = Date.now();
    logger.info('Job data DELETE request initiated', {
        action: 'delete_job_data',
        timestamp: new Date().toISOString(),
        jobDataId: params.id,
        url: request.url
    });

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            logger.warn('Unauthorized job data DELETE request', {
                action: 'delete_job_data',
                step: 'authentication',
                jobDataId: params.id,
                error: authError?.message || 'No user found',
                hasAuthError: !!authError,
                hasUser: !!user
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.debug('User authenticated for job data DELETE', {
            action: 'delete_job_data',
            step: 'authentication',
            userId: user.id,
            jobDataId: params.id
        });

        await JobDataService.delete(params.id, user.id);

        const duration = Date.now() - startTime;
        logger.info('Job data DELETE request completed successfully', {
            action: 'delete_job_data',
            step: 'completion',
            userId: user.id,
            jobDataId: params.id,
            duration: `${duration}ms`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Error deleting job data', {
            action: 'delete_job_data',
            step: 'error',
            jobDataId: params.id,
            duration: `${duration}ms`,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            isNotFoundError: error instanceof Error && error.message === 'Job data not found'
        });
        console.error('Error deleting job data:', error);
        if (error instanceof Error && error.message === 'Job data not found') {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Failed to delete job data' },
            { status: 500 }
        );
    }
}
