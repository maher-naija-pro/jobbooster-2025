import supabase from "@/config/supabase";
import { nanoid } from "nanoid";
export const handleUpload = async (files: File[]) => {
    if (files) {
        const filename = files[0].name + '-' + nanoid();;
        const { data, error } = await supabase.storage
            .from("pdfs")
            .upload(
                `${filename}.${files[0].name.split(".").pop()}`,
                files[0]
            );

        if (error) {
            console.error("Error uploading file:", error.message);
        } else {
            const { data: file } = await supabase.storage
                .from("pdfs")
                .getPublicUrl(data?.path);
            console.log(file);
        }
    }
};