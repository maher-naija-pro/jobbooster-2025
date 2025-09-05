/*
  Warnings:

  - You are about to drop the column `analysis_confidence` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `analysis_id` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `analysis_version` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `completeness_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `consistency_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `employment_type` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `error_message` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `experience_level` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_certifications` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_education` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_experience` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_languages` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_skills` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `extraction_quality` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `job_type` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `model_used` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `original_filename` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `parameters` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_qualifications` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `priority_level` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `remote_type` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `required_qualifications` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `cv_data` table. All the data in the column will be lost.
  - You are about to alter the column `file_name` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `file_url` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `mime_type` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `data_classification` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The `processing_status` column on the `cv_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `email` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `first_name` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `full_name` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `last_name` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `linkedin_url` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `nationality` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `phone` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `website_url` on the `cv_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `application_date` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_applied` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_bookmarked` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `generated_content` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `analysis_id` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `analysis_version` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `application_url` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `education_match_score` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `employment_type` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `error_message` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `experience_match_score` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_certifications` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_education` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_experience` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_languages` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `extracted_skills` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `job_id` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `job_posting_url` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `location_match_score` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `match_score` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `model_used` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `original_filename` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `parameters` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `posted_date` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_qualifications` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `priority_level` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `required_qualifications` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `skills_match_score` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `job_data` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `processing_status` column on the `job_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `job_type` column on the `job_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `location` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `remote_type` column on the `job_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `salary_range` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - The `experience_level` column on the `job_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `industry` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `department` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `data_classification` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `company_logo_url` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `company_name` on the `job_data` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The `company_size` column on the `job_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `full_name` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `username` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `avatar_url` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `analysis_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `generated_content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `user_notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."MatchStatus" AS ENUM ('PENDING', 'ANALYZING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "public"."RemoteType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "public"."ExperienceLevel" AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "public"."CompanySize" AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('SYSTEM', 'JOB_MATCH', 'ANALYSIS_COMPLETE', 'REMINDER', 'PROMOTIONAL', 'SECURITY');

-- CreateEnum
CREATE TYPE "public"."GeneratedContentType" AS ENUM ('COVER_LETTER', 'CV_OPTIMIZATION', 'INTERVIEW_PREP', 'SKILL_ANALYSIS', 'JOB_RECOMMENDATIONS', 'CAREER_ADVICE');

-- DropForeignKey
ALTER TABLE "public"."generated_content" DROP CONSTRAINT "generated_content_cv_data_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."job_categories" DROP CONSTRAINT "job_categories_parent_id_fkey";

-- DropIndex
DROP INDEX "public"."cv_data_status_idx";

-- DropIndex
DROP INDEX "public"."cv_job_matches_is_applied_idx";

-- DropIndex
DROP INDEX "public"."cv_job_matches_is_bookmarked_idx";

-- DropIndex
DROP INDEX "public"."cv_job_matches_status_idx";

-- DropIndex
DROP INDEX "public"."job_data_status_idx";

-- AlterTable
ALTER TABLE "public"."cv_data" DROP COLUMN "analysis_confidence",
DROP COLUMN "analysis_id",
DROP COLUMN "analysis_version",
DROP COLUMN "categories",
DROP COLUMN "company",
DROP COLUMN "completeness_score",
DROP COLUMN "consistency_score",
DROP COLUMN "department",
DROP COLUMN "employment_type",
DROP COLUMN "error_message",
DROP COLUMN "experience_level",
DROP COLUMN "extracted_certifications",
DROP COLUMN "extracted_education",
DROP COLUMN "extracted_experience",
DROP COLUMN "extracted_languages",
DROP COLUMN "extracted_skills",
DROP COLUMN "extraction_quality",
DROP COLUMN "industry",
DROP COLUMN "job_type",
DROP COLUMN "location",
DROP COLUMN "model_used",
DROP COLUMN "original_filename",
DROP COLUMN "parameters",
DROP COLUMN "parent_id",
DROP COLUMN "preferred_qualifications",
DROP COLUMN "priority_level",
DROP COLUMN "remote_type",
DROP COLUMN "required_qualifications",
DROP COLUMN "status",
DROP COLUMN "tags",
ADD COLUMN     "consent_date" TIMESTAMP(3),
ADD COLUMN     "consent_version" VARCHAR(20),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "github_url" VARCHAR(500),
ADD COLUMN     "last_retry_at" TIMESTAMP(3),
ADD COLUMN     "last_viewed_at" TIMESTAMP(3),
ADD COLUMN     "retention_policy" VARCHAR(100),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "file_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "file_url" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "mime_type" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "data_classification" SET DATA TYPE VARCHAR(50),
DROP COLUMN "processing_status",
ADD COLUMN     "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "linkedin_url" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "nationality" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "website_url" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."cv_job_matches" DROP COLUMN "application_date",
DROP COLUMN "is_applied",
DROP COLUMN "is_bookmarked",
DROP COLUMN "notes",
DROP COLUMN "status",
ADD COLUMN     "analysis_confidence" DECIMAL(3,2),
ADD COLUMN     "analysis_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "analysis_duration" INTEGER,
ADD COLUMN     "archive_date" TIMESTAMP(3),
ADD COLUMN     "completeness_score" DECIMAL(3,2),
ADD COLUMN     "consent_date" TIMESTAMP(3),
ADD COLUMN     "consent_version" VARCHAR(20),
ADD COLUMN     "consistency_score" DECIMAL(3,2),
ADD COLUMN     "data_classification" VARCHAR(50),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_analyzed_at" TIMESTAMP(3),
ADD COLUMN     "last_downloaded_at" TIMESTAMP(3),
ADD COLUMN     "last_retry_at" TIMESTAMP(3),
ADD COLUMN     "last_viewed_at" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER DEFAULT 0,
ADD COLUMN     "processing_completed_at" TIMESTAMP(3),
ADD COLUMN     "processing_error" TEXT,
ADD COLUMN     "processing_started_at" TIMESTAMP(3),
ADD COLUMN     "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "processing_time" INTEGER,
ADD COLUMN     "retention_date" TIMESTAMP(3),
ADD COLUMN     "retention_policy" VARCHAR(100),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."generated_content" ADD COLUMN     "analysis_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "archive_date" TIMESTAMP(3),
ADD COLUMN     "confidence_score" DECIMAL(3,2),
ADD COLUMN     "consent_date" TIMESTAMP(3),
ADD COLUMN     "consent_version" VARCHAR(20),
ADD COLUMN     "copy_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "data_classification" VARCHAR(50),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "job_data_id" TEXT,
ADD COLUMN     "last_analyzed_at" TIMESTAMP(3),
ADD COLUMN     "last_copied_at" TIMESTAMP(3),
ADD COLUMN     "last_retry_at" TIMESTAMP(3),
ADD COLUMN     "last_viewed_at" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER DEFAULT 0,
ADD COLUMN     "processing_completed_at" TIMESTAMP(3),
ADD COLUMN     "processing_error" TEXT,
ADD COLUMN     "processing_started_at" TIMESTAMP(3),
ADD COLUMN     "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "processing_time" INTEGER,
ADD COLUMN     "quality_score" DECIMAL(3,2),
ADD COLUMN     "reading_time" INTEGER,
ADD COLUMN     "retention_date" TIMESTAMP(3),
ADD COLUMN     "retention_policy" VARCHAR(100),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "word_count" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."GeneratedContentType" NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."job_data" DROP COLUMN "analysis_id",
DROP COLUMN "analysis_version",
DROP COLUMN "application_url",
DROP COLUMN "categories",
DROP COLUMN "company",
DROP COLUMN "description",
DROP COLUMN "education_match_score",
DROP COLUMN "employment_type",
DROP COLUMN "error_message",
DROP COLUMN "experience_match_score",
DROP COLUMN "extracted_certifications",
DROP COLUMN "extracted_education",
DROP COLUMN "extracted_experience",
DROP COLUMN "extracted_languages",
DROP COLUMN "extracted_skills",
DROP COLUMN "job_id",
DROP COLUMN "job_posting_url",
DROP COLUMN "keywords",
DROP COLUMN "location_match_score",
DROP COLUMN "match_score",
DROP COLUMN "metadata",
DROP COLUMN "model_used",
DROP COLUMN "original_filename",
DROP COLUMN "parameters",
DROP COLUMN "parent_id",
DROP COLUMN "posted_date",
DROP COLUMN "preferred_qualifications",
DROP COLUMN "priority_level",
DROP COLUMN "required_qualifications",
DROP COLUMN "requirements",
DROP COLUMN "skills_match_score",
DROP COLUMN "source",
DROP COLUMN "start_date",
DROP COLUMN "status",
DROP COLUMN "tags",
ADD COLUMN     "consent_date" TIMESTAMP(3),
ADD COLUMN     "consent_version" VARCHAR(20),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "last_retry_at" TIMESTAMP(3),
ADD COLUMN     "last_viewed_at" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER DEFAULT 0,
ADD COLUMN     "retention_policy" VARCHAR(100),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "soft_skill_requirements" JSONB,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
DROP COLUMN "processing_status",
ADD COLUMN     "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
DROP COLUMN "job_type",
ADD COLUMN     "job_type" "public"."JobType",
ALTER COLUMN "location" SET DATA TYPE VARCHAR(255),
DROP COLUMN "remote_type",
ADD COLUMN     "remote_type" "public"."RemoteType",
ALTER COLUMN "salary_range" SET DATA TYPE VARCHAR(100),
DROP COLUMN "experience_level",
ADD COLUMN     "experience_level" "public"."ExperienceLevel",
ALTER COLUMN "industry" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "department" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "data_classification" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "company_logo_url" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "company_name" SET DATA TYPE VARCHAR(255),
DROP COLUMN "company_size",
ADD COLUMN     "company_size" "public"."CompanySize";

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "analysis_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "archive_date" TIMESTAMP(3),
ADD COLUMN     "consent_date" TIMESTAMP(3),
ADD COLUMN     "consent_version" VARCHAR(20),
ADD COLUMN     "data_classification" VARCHAR(50),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_analyzed_at" TIMESTAMP(3),
ADD COLUMN     "last_retry_at" TIMESTAMP(3),
ADD COLUMN     "last_viewed_at" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER DEFAULT 0,
ADD COLUMN     "processing_completed_at" TIMESTAMP(3),
ADD COLUMN     "processing_error" TEXT,
ADD COLUMN     "processing_started_at" TIMESTAMP(3),
ADD COLUMN     "processing_status" "public"."ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "processing_time" INTEGER,
ADD COLUMN     "retention_date" TIMESTAMP(3),
ADD COLUMN     "retention_policy" VARCHAR(100),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "avatar_url" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."user_notifications" DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL;

-- DropTable
DROP TABLE "public"."analysis_templates";

-- DropTable
DROP TABLE "public"."job_categories";

-- DropTable
DROP TABLE "public"."skills";

-- CreateIndex
CREATE INDEX "cv_data_processing_status_idx" ON "public"."cv_data"("processing_status");

-- CreateIndex
CREATE INDEX "cv_data_email_idx" ON "public"."cv_data"("email");

-- CreateIndex
CREATE INDEX "cv_data_full_name_idx" ON "public"."cv_data"("full_name");

-- CreateIndex
CREATE INDEX "generated_content_user_id_idx" ON "public"."generated_content"("user_id");

-- CreateIndex
CREATE INDEX "generated_content_cv_data_id_idx" ON "public"."generated_content"("cv_data_id");

-- CreateIndex
CREATE INDEX "generated_content_job_data_id_idx" ON "public"."generated_content"("job_data_id");

-- CreateIndex
CREATE INDEX "generated_content_type_idx" ON "public"."generated_content"("type");

-- CreateIndex
CREATE INDEX "generated_content_is_active_idx" ON "public"."generated_content"("is_active");

-- CreateIndex
CREATE INDEX "generated_content_is_archived_idx" ON "public"."generated_content"("is_archived");

-- CreateIndex
CREATE INDEX "generated_content_created_at_idx" ON "public"."generated_content"("created_at");

-- CreateIndex
CREATE INDEX "generated_content_version_is_latest_idx" ON "public"."generated_content"("version", "is_latest");

-- CreateIndex
CREATE INDEX "generated_content_confidence_score_idx" ON "public"."generated_content"("confidence_score");

-- CreateIndex
CREATE INDEX "generated_content_quality_score_idx" ON "public"."generated_content"("quality_score");

-- CreateIndex
CREATE INDEX "job_data_processing_status_idx" ON "public"."job_data"("processing_status");

-- CreateIndex
CREATE INDEX "job_data_job_type_idx" ON "public"."job_data"("job_type");

-- CreateIndex
CREATE INDEX "job_data_experience_level_idx" ON "public"."job_data"("experience_level");

-- CreateIndex
CREATE INDEX "job_data_company_name_idx" ON "public"."job_data"("company_name");

-- CreateIndex
CREATE INDEX "job_data_title_idx" ON "public"."job_data"("title");

-- CreateIndex
CREATE INDEX "job_data_application_deadline_idx" ON "public"."job_data"("application_deadline");

-- AddForeignKey
ALTER TABLE "public"."generated_content" ADD CONSTRAINT "generated_content_cv_data_id_fkey" FOREIGN KEY ("cv_data_id") REFERENCES "public"."cv_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generated_content" ADD CONSTRAINT "generated_content_job_data_id_fkey" FOREIGN KEY ("job_data_id") REFERENCES "public"."job_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
