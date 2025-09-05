-- AlterTable
ALTER TABLE "public"."cv_data" ADD COLUMN     "company" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "employment_type" TEXT,
ADD COLUMN     "experience_level" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "job_type" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "preferred_qualifications" JSONB,
ADD COLUMN     "remote_type" TEXT,
ADD COLUMN     "required_qualifications" JSONB,
ADD COLUMN     "salary_range" TEXT;

-- AlterTable
ALTER TABLE "public"."job_data" ADD COLUMN     "extracted_certifications" JSONB,
ADD COLUMN     "extracted_education" JSONB,
ADD COLUMN     "extracted_experience" INTEGER,
ADD COLUMN     "extracted_languages" JSONB,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "original_filename" TEXT;
