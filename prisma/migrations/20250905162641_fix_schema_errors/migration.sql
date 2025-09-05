/*
  Warnings:

  - You are about to drop the column `download_count` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_processing_time` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `is_template` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `last_downloaded_at` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `last_shared_at` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `parent_cv_id` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `priority_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `processing_queue_position` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `share_count` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `skill_gaps` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `template_category` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `download_count` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `edit_count` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `last_downloaded_at` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `last_edited_at` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `last_shared_at` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `performance_metrics` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `seo_score` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `share_count` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `test_group` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `generated_content` table. All the data in the column will be lost.
  - You are about to drop the column `application_count` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `last_application_at` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `save_count` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `share_count` on the `job_data` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding_completed` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding_step` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the `application_tracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_insights` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."application_tracking" DROP CONSTRAINT "application_tracking_cv_data_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_tracking" DROP CONSTRAINT "application_tracking_job_data_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_tracking" DROP CONSTRAINT "application_tracking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_insights" DROP CONSTRAINT "user_insights_user_id_fkey";

-- DropIndex
DROP INDEX "public"."cv_data_is_template_idx";

-- DropIndex
DROP INDEX "public"."cv_data_priority_score_idx";

-- DropIndex
DROP INDEX "public"."cv_data_template_category_idx";

-- DropIndex
DROP INDEX "public"."generated_content_test_group_idx";

-- DropIndex
DROP INDEX "public"."generated_content_variant_id_idx";

-- DropIndex
DROP INDEX "public"."profiles_onboarding_completed_idx";

-- AlterTable
ALTER TABLE "public"."cv_data" DROP COLUMN "download_count",
DROP COLUMN "estimated_processing_time",
DROP COLUMN "is_template",
DROP COLUMN "last_downloaded_at",
DROP COLUMN "last_shared_at",
DROP COLUMN "parent_cv_id",
DROP COLUMN "priority_score",
DROP COLUMN "processing_queue_position",
DROP COLUMN "share_count",
DROP COLUMN "skill_gaps",
DROP COLUMN "template_category";

-- AlterTable
ALTER TABLE "public"."generated_content" DROP COLUMN "download_count",
DROP COLUMN "edit_count",
DROP COLUMN "last_downloaded_at",
DROP COLUMN "last_edited_at",
DROP COLUMN "last_shared_at",
DROP COLUMN "performance_metrics",
DROP COLUMN "seo_score",
DROP COLUMN "share_count",
DROP COLUMN "test_group",
DROP COLUMN "variant_id";

-- AlterTable
ALTER TABLE "public"."job_data" DROP COLUMN "application_count",
DROP COLUMN "last_application_at",
DROP COLUMN "save_count",
DROP COLUMN "share_count";

-- AlterTable
ALTER TABLE "public"."profiles" DROP COLUMN "onboarding_completed",
DROP COLUMN "onboarding_step";

-- DropTable
DROP TABLE "public"."application_tracking";

-- DropTable
DROP TABLE "public"."user_insights";
