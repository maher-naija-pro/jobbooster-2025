/**
 * CV Display Component
 * 
 * This component displays a list of uploaded CVs with their processing status,
 * metadata, and action buttons. It handles fetching CV data from the database,
 * displaying loading states, error handling, and CV removal functionality.
 * 
 * Features:
 * - Fetches CV data from the database via API
 * - Displays CV metadata (filename, upload date, processing status, view count, analysis count)
 * - Provides refresh functionality
 * - Handles CV removal with confirmation
 * - Shows loading and error states
 * - Responsive design for mobile and desktop
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/types';
import { Icons } from '@/components/icons';
import { ExternalLink, BarChart3 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { RefreshButton } from '@/components/buttons/refresh-button';
import { CVDisplaySkeleton } from './cv-skeleton';

/**
 * Props interface for the CVDisplay component
 */
interface CVDisplayProps {
  /** Callback function called when a CV is removed */
  onFileRemove?: (cvId: string) => void;
  /** Additional CSS classes to apply to the component */
  className?: string;
  /** Trigger value that causes the component to refresh when changed */
  refreshTrigger?: number;
}

/**
 * Interface representing CV data as stored in the database
 * This matches the structure returned by the API endpoint
 */
interface DatabaseCVData {
  /** Unique identifier for the CV */
  id: string;
  /** Original filename of the uploaded file */
  fileName: string | null;
  /** URL to access the uploaded file */
  fileUrl: string | null;
  /** Size of the file in bytes */
  fileSize: number | null;
  /** MIME type of the file */
  mimeType: string | null;
  /** Current processing status of the CV */
  processingStatus: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  /** Timestamp when the CV was created */
  createdAt: string;
  /** Timestamp when the CV was last updated */
  updatedAt: string;
  /** Timestamp when processing started */
  processingStartedAt: string | null;
  /** Timestamp when processing completed */
  processingCompletedAt: string | null;
  /** Error message if processing failed */
  processingError: string | null;
  /** First name extracted from CV */
  firstName: string | null;
  /** Last name extracted from CV */
  lastName: string | null;
  /** Full name extracted from CV */
  fullName: string | null;
  /** Email extracted from CV */
  email: string | null;
  /** Phone number extracted from CV */
  phone: string | null;
  /** Number of times the CV has been viewed */
  viewCount: number;
  /** Number of times the CV has been analyzed */
  analysisCount: number;
  /** Whether the CV is currently active */
  isActive: boolean | null;
  /** Whether the CV is archived */
  isArchived: boolean | null;
  /** Whether the CV is marked as deleted */
  isDeleted: boolean | null;
  /** Whether the CV is publicly accessible */
  isPublic: boolean | null;
  /** Whether this is the latest version of the CV */
  isLatest: boolean | null;
  /** Version number of the CV */
  version: number;
  /** Additional metadata stored with the CV */
  metadata: any;
}

/**
 * Main CVDisplay component that renders a list of uploaded CVs
 * 
 * @param onFileRemove - Optional callback when a CV is removed
 * @param className - Optional additional CSS classes
 * @param refreshTrigger - Optional trigger value to refresh the component
 * @returns JSX element containing the CV display interface
 */
export function CVDisplay({
  onFileRemove,
  className,
  refreshTrigger
}: CVDisplayProps) {
  // State management for CV data and UI states
  const [cvDataList, setCvDataList] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingCvId, setRemovingCvId] = useState<string | null>(null);

  /**
   * Formats a date consistently to avoid hydration issues between server and client
   * @param date - The date to format
   * @returns Formatted date string in YYYY-MM-DD format
   */
  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  /**
   * Converts database CV data format to frontend CVData format
   * Maps database fields to the expected frontend interface
   * @param dbCv - CV data from the database
   * @returns CVData object formatted for frontend use
   */
  const convertDatabaseToCVData = useCallback((dbCv: DatabaseCVData): CVData => {
    return {
      id: dbCv.id,
      filename: dbCv.fileName || 'Unknown file',
      size: dbCv.fileSize || 0,
      uploadDate: new Date(dbCv.createdAt),
      processedContent: '', // This would come from extractedText if needed
      status: dbCv.processingStatus === 'COMPLETED' ? 'completed' :
        dbCv.processingStatus === 'PROCESSING' ? 'processing' :
          dbCv.processingStatus === 'UPLOADED' ? 'completed' : 'completed',
      fileUrl: dbCv.fileUrl || undefined,
      processingStatus: dbCv.processingStatus.toLowerCase() as any,
      processingStartedAt: dbCv.processingStartedAt ? new Date(dbCv.processingStartedAt) : undefined,
      processingCompletedAt: dbCv.processingCompletedAt ? new Date(dbCv.processingCompletedAt) : undefined,
      processingError: dbCv.processingError || undefined,
      originalFilename: dbCv.fileName || undefined,
      viewCount: dbCv.viewCount,
      analysisCount: dbCv.analysisCount,
      isActive: dbCv.isActive || false,
      isArchived: dbCv.isArchived || false,
      isPublic: dbCv.isPublic || false,
      // Note: Some database fields are excluded as they don't exist in CVData type
      // isLatest: dbCv.isLatest || false,
      // version: dbCv.version,
      // metadata: dbCv.metadata
    };
  }, []);

  /**
   * Fetches CV data from the database via API
   * Handles loading states, error handling, and data conversion
   */
  const fetchCVs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Fetching CVs from database');

      const response = await fetch('/api/cv-data');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch CVs');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const convertedCVs = result.data.map(convertDatabaseToCVData);
        setCvDataList(convertedCVs);

        logger.info('CVs fetched successfully', {
          count: convertedCVs.length,
          processingTime: result.processingTime
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CVs';
      setError(errorMessage);
      logger.error('Failed to fetch CVs', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [convertDatabaseToCVData]);

  /**
   * Handles CV removal from the database
   * Updates local state and calls parent callback on success
   * @param cvId - ID of the CV to remove
   */
  const handleFileRemove = useCallback(async (cvId: string) => {
    try {
      setRemovingCvId(cvId);

      logger.info('Removing CV from database', { cvId });

      const response = await fetch(`/api/cv-data?id=${cvId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove CV');
      }

      // Remove from local state
      setCvDataList(prev => prev.filter(cv => cv.id !== cvId));

      // Call parent callback if provided
      if (onFileRemove) {
        onFileRemove(cvId);
      }

      logger.info('CV removed successfully', { cvId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove CV';
      setError(errorMessage);
      logger.error('Failed to remove CV', { cvId, error: errorMessage });
    } finally {
      setRemovingCvId(null);
    }
  }, [onFileRemove]);

  /**
   * Effect hook to load CVs when component mounts or refresh trigger changes
   */
  useEffect(() => {
    fetchCVs();
  }, [fetchCVs, refreshTrigger]);

  return (
    <Card className={`h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
      {/* Header section with title, description, and refresh button */}
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Icons.eye className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          CV Display
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          View and manage your uploaded CVs
        </CardDescription>
        <div className="flex justify-end">
          <RefreshButton
            onRefresh={fetchCVs}
            isLoading={loading}
            text="Refresh"
            size="sm"
            variant="primary-outline"
            tooltip="Refresh CV list"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading state - shows skeleton while fetching data */}
          {loading && <CVDisplaySkeleton />}

          {/* Error state - displays error message with retry button */}
          {error && (
            <div className="text-center py-8">
              <Icons.clean className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchCVs}
                className="text-blue-600 hover:text-blue-700"
              >
                <Icons.arrowRight className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          )}

          {/* CVs list - displays all uploaded CVs with their metadata and actions */}
          {!loading && !error && cvDataList.length > 0 && (
            <div className="space-y-3">
              {cvDataList.map((cv) => (
                <div
                  key={cv.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Left section: File icon and CV details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icons.fileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate mb-1">
                        {cv.filename}
                      </p>
                      {/* CV metadata display */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 min-w-0">
                          <Icons.calendar className="h-3 w-3" />
                          <span>{formatDate(cv.uploadDate)}</span>
                        </span>
                        {/* Processing status indicators */}
                        {cv.status === 'completed' && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Icons.FaCheck className="h-3 w-3" />
                            <span>Processed</span>
                          </span>
                        )}
                        {cv.status === 'processing' && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Icons.Loader2 className="h-3 w-3 animate-spin" />
                            <span>Processing</span>
                          </span>
                        )}
                   
                      
                      </div>
                
                    </div>
                  </div>
                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Handle view CV action
                        console.log('Viewing CV:', cv);
                      }}
                      className="h-8 px-3 flex items-center gap-2"
                      title="View CV details"
                    >
                      <Icons.eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleFileRemove(cv.id)}
                      disabled={removingCvId === cv.id}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete CV"
                    >
                      {removingCvId === cv.id ? (
                        <Icons.Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icons.trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && cvDataList.length === 0 && (
            <div className="text-center py-8">
              <Icons.fileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No CVs uploaded yet</p>
              <p className="text-sm text-muted-foreground">Use the Upload CV card to add your first CV</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
