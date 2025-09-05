-- AlterTable
ALTER TABLE "public"."cv_data" ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "extracted_certifications" JSONB,
ADD COLUMN     "extracted_education" JSONB,
ADD COLUMN     "extracted_experience" INTEGER,
ADD COLUMN     "extracted_languages" JSONB,
ADD COLUMN     "extracted_skills" JSONB,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "model_used" TEXT,
ADD COLUMN     "parameters" JSONB,
ADD COLUMN     "processing_time" INTEGER;
