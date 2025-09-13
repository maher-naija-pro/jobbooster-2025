/**
 * Delete Confirmation Modal Component
 * 
 * A reusable modal component for confirming deletion actions.
 * Provides a consistent UI for delete confirmations across the application.
 * 
 * Features:
 * - Customizable title and description
 * - Warning icon and styling
 * - Cancel and Delete buttons
 * - Proper accessibility attributes
 * - Loading state support
 */

'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MetaButton } from '@/components/buttons/meta-button';

/**
 * Props interface for the DeleteConfirmationModal component
 */
interface DeleteConfirmationModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal should be closed */
    onClose: () => void;
    /** Callback when deletion is confirmed */
    onConfirm: () => void;
    /** Title of the item being deleted */
    itemTitle?: string;
    /** Type of item being deleted (e.g., "CV", "Job Offer") */
    itemType?: string;
    /** Whether the deletion is in progress */
    isDeleting?: boolean;
    /** Custom title for the modal */
    title?: string;
    /** Custom description for the modal */
    description?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Delete Confirmation Modal Component
 * 
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal should be closed
 * @param onConfirm - Callback when deletion is confirmed
 * @param itemTitle - Title of the item being deleted
 * @param itemType - Type of item being deleted
 * @param isDeleting - Whether the deletion is in progress
 * @param title - Custom title for the modal
 * @param description - Custom description for the modal
 * @param className - Additional CSS classes
 * @returns JSX element containing the delete confirmation modal
 */
export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemTitle,
    itemType = 'item',
    isDeleting = false,
    title,
    description,
    className
}: DeleteConfirmationModalProps) {
    // Generate default title and description if not provided
    const modalTitle = title || `Delete ${itemType}`;
    const modalDescription = description ||
        (itemTitle
            ? `Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`
            : `Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone.`
        );

    /**
     * Handles the confirm action
     * Calls the onConfirm callback and closes the modal
     */
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    /**
     * Handles the cancel action
     * Closes the modal without performing deletion
     */
    const handleCancel = () => {
        if (!isDeleting) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-md ${className}`}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                            <Icons.alertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {modalTitle}
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-slate-600 dark:text-slate-300 mt-2">
                        {modalDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <Icons.alertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                            <p className="font-medium mb-1">Warning</p>
                            <p>This action cannot be undone. The {itemType.toLowerCase()} will be permanently removed from your account.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isDeleting}
                        className="flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <MetaButton
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        variant="danger"
                        className="flex-1 sm:flex-none"
                    >
                        {isDeleting ? (
                            <>
                                <Icons.Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Icons.trash className="h-4 w-4 mr-2" />
                                Delete {itemType}
                            </>
                        )}
                    </MetaButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
