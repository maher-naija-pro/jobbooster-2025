/*
  Warnings:

  - You are about to alter the column `email` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `full_name` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."contact_messages" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."cv_data" ADD COLUMN     "completeness_percentage" DECIMAL(5,2),
ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "data_quality_score" DECIMAL(3,2),
ADD COLUMN     "deleted_by" VARCHAR(50),
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "warning_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "file_name" DROP NOT NULL,
ALTER COLUMN "file_url" DROP NOT NULL,
ALTER COLUMN "file_size" DROP NOT NULL,
ALTER COLUMN "mime_type" DROP NOT NULL,
ALTER COLUMN "is_archived" DROP NOT NULL,
ALTER COLUMN "is_public" DROP NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "is_latest" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."cv_job_matches" ADD COLUMN     "archive_reason" VARCHAR(100),
ADD COLUMN     "archived_by" VARCHAR(50),
ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "deleted_by" VARCHAR(50),
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_health_check" TIMESTAMP(3),
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "warning_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "overall_match_score" DROP NOT NULL,
ALTER COLUMN "skills_match_score" DROP NOT NULL,
ALTER COLUMN "experience_match_score" DROP NOT NULL,
ALTER COLUMN "education_match_score" DROP NOT NULL,
ALTER COLUMN "location_match_score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."feature_usage" ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."generated_content" ADD COLUMN     "archive_reason" VARCHAR(100),
ADD COLUMN     "archived_by" VARCHAR(50),
ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "deleted_by" VARCHAR(50),
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_health_check" TIMESTAMP(3),
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "warning_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."job_data" ADD COLUMN     "archive_reason" VARCHAR(100),
ADD COLUMN     "archived_by" VARCHAR(50),
ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "deleted_by" VARCHAR(50),
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_health_check" TIMESTAMP(3),
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "warning_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" DROP NOT NULL;

-- Update NULL full_name values before making the column required
UPDATE "public"."profiles" SET "full_name" = 'Unknown User' WHERE "full_name" IS NULL;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "account_locked_until" TIMESTAMP(3),
ADD COLUMN     "created_by" VARCHAR(50),
ADD COLUMN     "deleted_by" VARCHAR(50),
ADD COLUMN     "error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_password_change" TIMESTAMP(3),
ADD COLUMN     "security_questions" JSONB,
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_by" VARCHAR(50),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "warning_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "full_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_activity" ALTER COLUMN "action" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_notifications" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."schema_versions" (
    "id" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "migration_id" VARCHAR(50),
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_by" VARCHAR(50),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "schema_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schema_versions_version_key" ON "public"."schema_versions"("version");

-- CreateIndex
CREATE INDEX "cv_data_is_deleted_idx" ON "public"."cv_data"("is_deleted");

-- CreateIndex
CREATE INDEX "cv_data_user_id_is_latest_created_at_idx" ON "public"."cv_data"("user_id", "is_latest", "created_at");

-- CreateIndex
CREATE INDEX "cv_data_processing_status_created_at_idx" ON "public"."cv_data"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "cv_data_data_quality_score_is_active_idx" ON "public"."cv_data"("data_quality_score", "is_active");

-- CreateIndex
CREATE INDEX "cv_data_is_active_is_archived_created_at_idx" ON "public"."cv_data"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_active_idx" ON "public"."cv_job_matches"("is_active");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_archived_idx" ON "public"."cv_job_matches"("is_archived");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_deleted_idx" ON "public"."cv_job_matches"("is_deleted");

-- CreateIndex
CREATE INDEX "cv_job_matches_user_id_is_active_created_at_idx" ON "public"."cv_job_matches"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_processing_status_created_at_idx" ON "public"."cv_job_matches"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_active_is_archived_created_at_idx" ON "public"."cv_job_matches"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_is_deleted_idx" ON "public"."generated_content"("is_deleted");

-- CreateIndex
CREATE INDEX "generated_content_user_id_is_active_created_at_idx" ON "public"."generated_content"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_processing_status_created_at_idx" ON "public"."generated_content"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_is_active_is_archived_created_at_idx" ON "public"."generated_content"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "job_data_is_deleted_idx" ON "public"."job_data"("is_deleted");

-- CreateIndex
CREATE INDEX "job_data_user_id_is_active_created_at_idx" ON "public"."job_data"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "job_data_processing_status_priority_created_at_idx" ON "public"."job_data"("processing_status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "job_data_is_active_is_archived_created_at_idx" ON "public"."job_data"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "job_data_processing_status_created_at_idx" ON "public"."job_data"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "profiles_is_active_idx" ON "public"."profiles"("is_active");

-- CreateIndex
CREATE INDEX "profiles_is_deleted_idx" ON "public"."profiles"("is_deleted");

-- CreateIndex
CREATE INDEX "profiles_last_login_at_is_active_idx" ON "public"."profiles"("last_login_at", "is_active");

-- CreateIndex
CREATE INDEX "profiles_subscription_status_subscription_end_date_idx" ON "public"."profiles"("subscription_status", "subscription_end_date");

-- CreateIndex
CREATE INDEX "profiles_is_trial_user_trial_ends_at_idx" ON "public"."profiles"("is_trial_user", "trial_ends_at");

-- CreateIndex
CREATE INDEX "profiles_is_active_is_deleted_created_at_idx" ON "public"."profiles"("is_active", "is_deleted", "created_at");

-- CreateIndex
CREATE INDEX "profiles_last_active_at_is_active_idx" ON "public"."profiles"("last_active_at", "is_active");
