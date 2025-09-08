import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JobDataService, CreateJobDataInput } from '@/lib/job-data';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || undefined;
        const archived = searchParams.get('archived') === 'true' ? true : searchParams.get('archived') === 'false' ? false : undefined;

        const result = await JobDataService.getByUserId(user.id, {
            page,
            limit,
            status,
            isArchived: archived,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching job data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, title, company, ...otherFields } = body;

        if (!content || content.trim().length < 100) {
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

        const jobData = await JobDataService.create(jobDataInput);

        return NextResponse.json(jobData);
    } catch (error) {
        console.error('Error creating job data:', error);
        return NextResponse.json(
            { error: 'Failed to create job data' },
            { status: 500 }
        );
    }
}
