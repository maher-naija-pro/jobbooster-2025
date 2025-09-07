/*
  Warnings:

  - You are about to drop the column `ats_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `completeness_percentage` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `completeness_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `data_quality_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `error_count` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `improvement_suggestions` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `keyword_density` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `personal_info` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `professional_summary` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `readability_score` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `salary_range` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `template_tags` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `cv_data` table. All the data in the column will be lost.
  - You are about to drop the column `warning_count` on the `cv_data` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."cv_data_average_match_score_idx";

-- DropIndex
DROP INDEX "public"."cv_data_average_match_score_is_active_created_at_idx";

-- DropIndex
DROP INDEX "public"."cv_data_best_match_score_idx";

-- DropIndex
DROP INDEX "public"."cv_data_data_quality_score_is_active_idx";

-- DropIndex
DROP INDEX "public"."cv_data_email_idx";

-- DropIndex
DROP INDEX "public"."cv_data_full_name_idx";

-- DropIndex
DROP INDEX "public"."cv_data_is_active_idx";

-- DropIndex
DROP INDEX "public"."cv_data_is_active_is_archived_created_at_idx";

-- DropIndex
DROP INDEX "public"."cv_data_is_archived_idx";

-- DropIndex
DROP INDEX "public"."cv_data_is_deleted_idx";

-- DropIndex
DROP INDEX "public"."cv_data_processing_status_created_at_idx";

-- DropIndex
DROP INDEX "public"."cv_data_processing_status_idx";

-- DropIndex
DROP INDEX "public"."cv_data_user_id_is_latest_created_at_idx";

-- DropIndex
DROP INDEX "public"."cv_data_version_is_latest_idx";

-- AlterTable
ALTER TABLE "public"."cv_data" DROP COLUMN "ats_score",
DROP COLUMN "completeness_percentage",
DROP COLUMN "completeness_score",
DROP COLUMN "created_by",
DROP COLUMN "data_quality_score",
DROP COLUMN "deleted_by",
DROP COLUMN "error_count",
DROP COLUMN "file_size",
DROP COLUMN "improvement_suggestions",
DROP COLUMN "keyword_density",
DROP COLUMN "mime_type",
DROP COLUMN "personal_info",
DROP COLUMN "professional_summary",
DROP COLUMN "readability_score",
DROP COLUMN "salary_range",
DROP COLUMN "template_tags",
DROP COLUMN "updated_by",
DROP COLUMN "warning_count";

-- AlterTable
ALTER TABLE "public"."profiles" ALTER COLUMN "full_name" DROP NOT NULL;
