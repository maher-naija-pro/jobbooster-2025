'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CVUpload } from '../cv-upload';
import { CVData } from '@/lib/types';
import { Icons } from '@/components/icons';

interface CVDisplayProps {
  cvData: CVData | null;
  onFileUpload: (file: File) => Promise<void>;
  onFileRemove: () => void;
  isProcessing: boolean;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
  className?: string;
}

export function CVDisplay({
  cvData,
  onFileUpload,
  onFileRemove,
  isProcessing,
  error,
  uploadProgress,
  isUploading,
  className
}: CVDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.eye className="h-5 w-5" />
          CV Display
        </CardTitle>
        <CardDescription>
          View and manage your uploaded CVs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Show existing CVs if any */}
          {cvData && cvData.status === 'completed' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{cvData.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cvData.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          )}

          {/* CV Upload Component */}
          <CVUpload
            onFileUpload={onFileUpload}
            onFileRemove={onFileRemove}
            cvData={cvData}
            isProcessing={isProcessing}
            error={error}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
