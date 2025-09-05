import { useState, useEffect } from 'react';
import { JobData } from '@/lib/types';

interface UseJobDataOptions {
    page?: number;
    limit?: number;
    status?: string;
    archived?: boolean;
}

interface JobDataResponse {
    data: JobData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function useJobData(options: UseJobDataOptions = {}) {
    const [jobData, setJobData] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });

    const fetchJobData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (options.page) params.append('page', options.page.toString());
            if (options.limit) params.append('limit', options.limit.toString());
            if (options.status) params.append('status', options.status);
            if (options.archived !== undefined) params.append('archived', options.archived.toString());

            const response = await fetch(`/api/job-data?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch job data');
            }

            const result: JobDataResponse = await response.json();
            setJobData(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobData();
    }, [options.page, options.limit, options.status, options.archived]);

    const createJobData = async (data: Partial<JobData>) => {
        try {
            const response = await fetch('/api/job-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create job data');
            }

            const newJobData = await response.json();
            setJobData(prev => [newJobData, ...prev]);
            return newJobData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create job data');
            throw err;
        }
    };

    const updateJobData = async (id: string, data: Partial<JobData>) => {
        try {
            const response = await fetch(`/api/job-data/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update job data');
            }

            const updatedJobData = await response.json();
            setJobData(prev =>
                prev.map(job => job.id === id ? updatedJobData : job)
            );
            return updatedJobData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update job data');
            throw err;
        }
    };

    const deleteJobData = async (id: string) => {
        try {
            const response = await fetch(`/api/job-data/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job data');
            }

            setJobData(prev => prev.filter(job => job.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete job data');
            throw err;
        }
    };

    const archiveJobData = async (id: string) => {
        return updateJobData(id, { isArchived: true });
    };

    const unarchiveJobData = async (id: string) => {
        return updateJobData(id, { isArchived: false });
    };

    return {
        jobData,
        loading,
        error,
        pagination,
        refetch: fetchJobData,
        createJobData,
        updateJobData,
        deleteJobData,
        archiveJobData,
        unarchiveJobData,
    };
}

export function useJobDataById(id: string) {
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/job-data/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Job data not found');
                }
                throw new Error('Failed to fetch job data');
            }

            const result = await response.json();
            setJobData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchJobData();
        }
    }, [id]);

    const updateJobData = async (data: Partial<JobData>) => {
        try {
            const response = await fetch(`/api/job-data/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update job data');
            }

            const updatedJobData = await response.json();
            setJobData(updatedJobData);
            return updatedJobData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update job data');
            throw err;
        }
    };

    return {
        jobData,
        loading,
        error,
        refetch: fetchJobData,
        updateJobData,
    };
}
