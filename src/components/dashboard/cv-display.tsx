'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CVData } from '@/lib/types';
import { Icons } from '@/components/icons';

interface CVDisplayProps {
  cvData: CVData | null;
  onFileRemove: () => void;
  className?: string;
}

export function CVDisplay({
  cvData,
  onFileRemove,
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
          {cvData && cvData.status === 'completed' ? (
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
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onFileRemove}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
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
