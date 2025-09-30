/**
 * Save job offer data to the database using the API route
 * @param jobOfferContent - The job offer content to save
 * @param title - Optional job title
 * @param company - Optional company name
 * @returns Promise<{ success: boolean; jobData?: { id?: string; content?: string; title?: string; company?: string } | undefined; error?: string }>
 */
export async function saveJobOfferToDatabase(
    jobOfferContent: string,
    title?: string,
    company?: string
): Promise<{ success: boolean; jobData?: { id?: string; content?: string; title?: string; company?: string } | undefined; error?: string }> {
    try {
        console.log('Saving job offer to database', {
            action: 'save_job_offer',
            contentLength: jobOfferContent?.length || 0,
            hasTitle: !!title,
            hasCompany: !!company,
            timestamp: new Date().toISOString()
        });

        // Validate job offer content
        if (!jobOfferContent || jobOfferContent.trim().length < 100) {
            console.warn('Job offer validation failed - content too short', {
                action: 'save_job_offer',
                contentLength: jobOfferContent?.length || 0,
                contentProvided: !!jobOfferContent
            });
            return { success: false, error: 'Job offer content must be at least 100 characters long' };
        }

        // Prepare request data
        const requestData = {
            content: jobOfferContent.trim(),
            title: title?.trim() || undefined,
            company: company?.trim() || undefined,
        };

        console.log('Sending request to API:', {
            action: 'save_job_offer',
            step: 'api_request',
            requestData: {
                contentLength: requestData.content?.length || 0,
                hasTitle: !!requestData.title,
                hasCompany: !!requestData.company,
                title: requestData.title,
                company: requestData.company
            }
        });

        // Call the existing API route to save job data
        const response = await fetch('/api/job-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
                errorData = {};
            }

            console.error('Failed to save job offer via API:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
            });

            return {
                success: false,
                error: errorData?.error || `HTTP ${response.status}: ${response.statusText}` || 'Failed to save job offer'
            };
        }

        const jobData: { id?: string; content?: string; title?: string; company?: string } = await response.json();
        console.log('Job offer saved successfully via API:', {
            action: 'save_job_offer',
            step: 'success',
            jobData: {
                id: jobData.id,
                contentLength: jobData.content?.length || 0,
                hasTitle: !!jobData.title,
                hasCompany: !!jobData.company,
                title: jobData.title,
                company: jobData.company
            }
        });

        return { success: true, jobData };

    } catch (error) {
        console.error('Error saving job offer to database', {
            action: 'save_job_offer',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save job offer'
        };
    }
}

/**
 * Check if a job offer is already saved in the database using the API route
 * @param jobOfferContent - The job offer content to check
 * @returns Promise<boolean>
 */
export async function isJobOfferAlreadySaved(jobOfferContent: string): Promise<boolean> {
    try {
        // Call the existing API route to get user's job data
        const response = await fetch('/api/job-data?limit=100');

        if (!response.ok) {
            console.error('Failed to fetch job data for duplicate check');
            return false;
        }

        const result: { data?: Array<{ content?: string }> } = await response.json();
        const existingJobs = result.data || [];

        // Check if any existing job has the same content
        const isDuplicate = existingJobs.some((job) => job.content === jobOfferContent.trim());

        console.log('Duplicate check result:', { isDuplicate, totalJobs: existingJobs.length });
        return isDuplicate;

    } catch (error) {
        console.error('Error checking if job offer is already saved', {
            action: 'check_job_offer_exists',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return false;
    }
}
