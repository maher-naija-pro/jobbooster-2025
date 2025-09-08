'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/types';
import { Icons } from '@/components/icons';
import { logger } from '@/lib/logger';

interface CVDisplayProps {
  onFileRemove?: (cvId: string) => void;
  className?: string;
  refreshTrigger?: number; // Add refresh trigger prop
}

interface DatabaseCVData {
  id: string;
  fileName: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  processingStatus: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  processingError: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  viewCount: number;
  analysisCount: number;
  isActive: boolean | null;
  isArchived: boolean | null;
  isDeleted: boolean | null;
  isPublic: boolean | null;
  isLatest: boolean | null;
  version: number;
  metadata: any;
}

export function CVDisplay({
  onFileRemove,
  className,
  refreshTrigger
}: CVDisplayProps) {
  const [cvDataList, setCvDataList] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingCvId, setRemovingCvId] = useState<string | null>(null);

  // Convert database CV data to frontend CVData format
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
      // isLatest: dbCv.isLatest || false, // Remove this as it's not in CVData type
      // version: dbCv.version, // Remove this as it's not in CVData type
      // metadata: dbCv.metadata // Remove this as it's not in CVData type
    };
  }, []);

  // Fetch CVs from database
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

  // Remove CV from database
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

  // Load CVs on component mount and when refresh trigger changes
  useEffect(() => {
    fetchCVs();
  }, [fetchCVs, refreshTrigger]);

  return (
    <Card className={`h-full border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
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
          <Button
            size="sm"
            variant="outline"
            onClick={fetchCVs}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700"
          >
            <Icons.arrowRight className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-8">
              <Icons.Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading CVs...</p>
            </div>
          )}

          {/* Error state */}
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

          {/* CVs list */}
          {!loading && !error && cvDataList.length > 0 && (
            <div className="space-y-3">
              {cvDataList.map((cv) => (
                <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{cv.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {cv.uploadDate.toLocaleDateString()}
                        {cv.status === 'completed' && (
                          <span className="ml-2 text-green-600">✓ Processed</span>
                        )}
                        {cv.status === 'processing' && (
                          <span className="ml-2 text-blue-600">⏳ Processing</span>
                        )}
                        {cv.viewCount && cv.viewCount > 0 && (
                          <span className="ml-2 text-gray-500">👁 {cv.viewCount}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Icons.eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFileRemove(cv.id)}
                      disabled={removingCvId === cv.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
