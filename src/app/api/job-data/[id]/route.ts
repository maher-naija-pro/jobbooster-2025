import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { JobDataService, UpdateJobDataInput } from '@/lib/job-data';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const jobData = await JobDataService.getById(params.id, user.id);

        if (!jobData) {
            return NextResponse.json({ error: 'Job data not found' }, { status: 404 });
        }

        // Increment view count
        await JobDataService.incrementViewCount(params.id);

        return NextResponse.json(jobData);
    } catch (error) {
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
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const updateData: UpdateJobDataInput = { ...body };

        const jobData = await JobDataService.update(params.id, user.id, updateData);

        return NextResponse.json(jobData);
    } catch (error) {
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
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await JobDataService.delete(params.id, user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
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
