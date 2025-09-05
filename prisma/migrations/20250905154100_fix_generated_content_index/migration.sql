/*
  Warnings:

  - You are about to drop the column `analysis_count` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_latest` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `last_analyzed_at` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `cv_job_matches` table. All the data in the column will be lost.
  - You are about to drop the column `analysis_count` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `last_analyzed_at` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `analysis_count` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `data_classification` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `is_archived` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `is_latest` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_analyzed_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_retry_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_viewed_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `processing_completed_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `processing_error` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `processing_started_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `processing_status` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `processing_time` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `retention_date` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `retry_count` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."generated_content_version_is_latest_idx";

-- AlterTable
ALTER TABLE "public"."cv_job_matches" DROP COLUMN "analysis_count",
DROP COLUMN "is_latest",
DROP COLUMN "is_public",
DROP COLUMN "last_analyzed_at",
DROP COLUMN "priority",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "public"."generated_content" DROP COLUMN "analysis_count",
DROP COLUMN "last_analyzed_at",
DROP COLUMN "priority",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "public"."profiles" DROP COLUMN "analysis_count",
DROP COLUMN "data_classification",
DROP COLUMN "is_archived",
DROP COLUMN "is_latest",
DROP COLUMN "is_public",
DROP COLUMN "last_analyzed_at",
DROP COLUMN "last_retry_at",
DROP COLUMN "last_viewed_at",
DROP COLUMN "priority",
DROP COLUMN "processing_completed_at",
DROP COLUMN "processing_error",
DROP COLUMN "processing_started_at",
DROP COLUMN "processing_status",
DROP COLUMN "processing_time",
DROP COLUMN "retention_date",
DROP COLUMN "retry_count",
DROP COLUMN "version",
DROP COLUMN "view_count";

-- CreateIndex
CREATE INDEX "generated_content_is_latest_idx" ON "public"."generated_content"("is_latest");
