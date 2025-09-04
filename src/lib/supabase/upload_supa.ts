import { createClient } from './client';
import { nanoid } from "nanoid";

// Utility function to generate date-based folder structure
export const generateDateFolder = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

export const handleFileUpload = async (file: File, bucket: string = "pdfs") => {
    const supabase = createClient();
    const fileId = nanoid();
    const fileExtension = file.name.split(".").pop();

    // Create date-based folder structure: YYYY/MM/DD/filename
    const dateFolder = generateDateFolder();
    const fullFilename = `${dateFolder}/${fileId}.${fileExtension}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fullFilename, file);

    if (error) {
        console.error("Error uploading file:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
    } else {
        const { data: fileData } = await supabase.storage
            .from(bucket)
            .getPublicUrl(data?.path);

        return {
            path: data?.path,
            publicUrl: fileData?.publicUrl,
            filename: fullFilename,
            originalFilename: file.name,
            fileSize: file.size,
            mimeType: file.type
        };
    }
};

// Legacy function for backward compatibility
export const handleUpload = async (files: File[]) => {
    if (files && files.length > 0) {
        return await handleFileUpload(files[0]);
    }
};