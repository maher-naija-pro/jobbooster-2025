-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('APPLIED', 'VIEWED', 'INTERVIEWED', 'REJECTED', 'OFFERED', 'ACCEPTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "public"."CareerLevel" AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE', 'C_LEVEL');

-- CreateEnum
CREATE TYPE "public"."CareerStage" AS ENUM ('EARLY_CAREER', 'MID_CAREER', 'LATE_CAREER', 'TRANSITION');

-- CreateEnum
CREATE TYPE "public"."CompanyGrowthStage" AS ENUM ('STARTUP', 'SCALE_UP', 'MATURE', 'DECLINING');

-- CreateEnum
CREATE TYPE "public"."LearningGoalType" AS ENUM ('SKILL_DEVELOPMENT', 'CERTIFICATION', 'DEGREE', 'COURSE', 'WORKSHOP', 'CONFERENCE');

-- AlterTable
ALTER TABLE "public"."cv_data" ADD COLUMN     "ats_score" DECIMAL(3,2),
ADD COLUMN     "average_match_score" DECIMAL(5,2),
ADD COLUMN     "best_match_score" DECIMAL(5,2),
ADD COLUMN     "completeness_score" DECIMAL(3,2),
ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimated_processing_time" INTEGER,
ADD COLUMN     "improvement_suggestions" JSONB,
ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keyword_density" JSONB,
ADD COLUMN     "last_downloaded_at" TIMESTAMP(3),
ADD COLUMN     "last_shared_at" TIMESTAMP(3),
ADD COLUMN     "parent_cv_id" TEXT,
ADD COLUMN     "priority_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processing_queue_position" INTEGER,
ADD COLUMN     "readability_score" DECIMAL(3,2),
ADD COLUMN     "share_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skill_gaps" JSONB,
ADD COLUMN     "template_category" VARCHAR(100),
ADD COLUMN     "template_tags" JSONB,
ADD COLUMN     "total_job_matches" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."generated_content" ADD COLUMN     "download_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "edit_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "effectiveness_score" DECIMAL(3,2),
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "improvement_suggestions" JSONB,
ADD COLUMN     "keyword_optimization" JSONB,
ADD COLUMN     "last_downloaded_at" TIMESTAMP(3),
ADD COLUMN     "last_edited_at" TIMESTAMP(3),
ADD COLUMN     "last_shared_at" TIMESTAMP(3),
ADD COLUMN     "performance_metrics" JSONB,
ADD COLUMN     "readability_score" DECIMAL(3,2),
ADD COLUMN     "seo_score" DECIMAL(3,2),
ADD COLUMN     "share_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "test_group" TEXT,
ADD COLUMN     "tone_analysis" JSONB,
ADD COLUMN     "user_rating" DECIMAL(3,2),
ADD COLUMN     "variant_id" TEXT;

-- AlterTable
ALTER TABLE "public"."job_data" ADD COLUMN     "application_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "average_salary" DECIMAL(10,2),
ADD COLUMN     "benefits_score" DECIMAL(3,2),
ADD COLUMN     "company_culture" JSONB,
ADD COLUMN     "company_growth_stage" "public"."CompanyGrowthStage",
ADD COLUMN     "company_rating" DECIMAL(3,2),
ADD COLUMN     "company_size_category" VARCHAR(50),
ADD COLUMN     "competition_level" DECIMAL(3,2),
ADD COLUMN     "description_clarity" DECIMAL(3,2),
ADD COLUMN     "diversity_score" DECIMAL(3,2),
ADD COLUMN     "growth_trend" VARCHAR(20),
ADD COLUMN     "job_quality_score" DECIMAL(3,2),
ADD COLUMN     "last_application_at" TIMESTAMP(3),
ADD COLUMN     "location_demand" JSONB,
ADD COLUMN     "market_demand" DECIMAL(3,2),
ADD COLUMN     "requirements_clarity" DECIMAL(3,2),
ADD COLUMN     "salary_percentile" INTEGER,
ADD COLUMN     "save_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "share_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skill_trends" JSONB;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "average_session_duration" INTEGER,
ADD COLUMN     "billing_cycle" VARCHAR(20),
ADD COLUMN     "career_goals" TEXT,
ADD COLUMN     "feature_usage_stats" JSONB,
ADD COLUMN     "industry_preferences" JSONB,
ADD COLUMN     "is_trial_user" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_active_at" TIMESTAMP(3),
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "login_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longest_streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboarding_step" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "payment_method" VARCHAR(50),
ADD COLUMN     "preferred_job_types" JSONB,
ADD COLUMN     "preferred_locations" JSONB,
ADD COLUMN     "salary_expectations" JSONB,
ADD COLUMN     "skill_interests" JSONB,
ADD COLUMN     "streak_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription_end_date" TIMESTAMP(3),
ADD COLUMN     "subscription_start_date" TIMESTAMP(3),
ADD COLUMN     "subscription_status" VARCHAR(50),
ADD COLUMN     "total_session_time" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trial_ends_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."user_insights" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "career_level" "public"."CareerLevel",
    "career_stage" "public"."CareerStage",
    "career_progression" JSONB,
    "skill_development" JSONB,
    "market_position" JSONB,
    "application_success_rate" DECIMAL(5,2),
    "interview_rate" DECIMAL(5,2),
    "offer_rate" DECIMAL(5,2),
    "average_response_time" INTEGER,
    "learning_goals" JSONB,
    "skill_gaps" JSONB,
    "recommended_courses" JSONB,
    "completed_courses" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feature_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feature_name" VARCHAR(100) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "last_used_at" TIMESTAMP(3),
    "total_time_spent" INTEGER NOT NULL DEFAULT 0,
    "average_session_time" INTEGER,
    "success_rate" DECIMAL(5,2),
    "satisfaction_score" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."application_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_data_id" TEXT NOT NULL,
    "cv_data_id" TEXT NOT NULL,
    "application_date" TIMESTAMP(3) NOT NULL,
    "application_method" VARCHAR(50),
    "application_status" "public"."ApplicationStatus" NOT NULL,
    "response_date" TIMESTAMP(3),
    "interview_date" TIMESTAMP(3),
    "offer_date" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "response_time" INTEGER,
    "interview_score" DECIMAL(3,2),
    "offer_amount" DECIMAL(10,2),
    "negotiation_status" VARCHAR(50),
    "notes" TEXT,
    "feedback" TEXT,
    "follow_up_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_insights_user_id_idx" ON "public"."user_insights"("user_id");

-- CreateIndex
CREATE INDEX "feature_usage_user_id_idx" ON "public"."feature_usage"("user_id");

-- CreateIndex
CREATE INDEX "feature_usage_feature_name_idx" ON "public"."feature_usage"("feature_name");

-- CreateIndex
CREATE UNIQUE INDEX "feature_usage_user_id_feature_name_key" ON "public"."feature_usage"("user_id", "feature_name");

-- CreateIndex
CREATE INDEX "application_tracking_user_id_idx" ON "public"."application_tracking"("user_id");

-- CreateIndex
CREATE INDEX "application_tracking_job_data_id_idx" ON "public"."application_tracking"("job_data_id");

-- CreateIndex
CREATE INDEX "application_tracking_cv_data_id_idx" ON "public"."application_tracking"("cv_data_id");

-- CreateIndex
CREATE INDEX "cv_data_average_match_score_idx" ON "public"."cv_data"("average_match_score");

-- CreateIndex
CREATE INDEX "cv_data_best_match_score_idx" ON "public"."cv_data"("best_match_score");

-- CreateIndex
CREATE INDEX "cv_data_is_template_idx" ON "public"."cv_data"("is_template");

-- CreateIndex
CREATE INDEX "cv_data_template_category_idx" ON "public"."cv_data"("template_category");

-- CreateIndex
CREATE INDEX "cv_data_priority_score_idx" ON "public"."cv_data"("priority_score");

-- CreateIndex
CREATE INDEX "generated_content_effectiveness_score_idx" ON "public"."generated_content"("effectiveness_score");

-- CreateIndex
CREATE INDEX "generated_content_user_rating_idx" ON "public"."generated_content"("user_rating");

-- CreateIndex
CREATE INDEX "generated_content_variant_id_idx" ON "public"."generated_content"("variant_id");

-- CreateIndex
CREATE INDEX "generated_content_test_group_idx" ON "public"."generated_content"("test_group");

-- CreateIndex
CREATE INDEX "job_data_market_demand_idx" ON "public"."job_data"("market_demand");

-- CreateIndex
CREATE INDEX "job_data_competition_level_idx" ON "public"."job_data"("competition_level");

-- CreateIndex
CREATE INDEX "job_data_job_quality_score_idx" ON "public"."job_data"("job_quality_score");

-- CreateIndex
CREATE INDEX "job_data_company_rating_idx" ON "public"."job_data"("company_rating");

-- CreateIndex
CREATE INDEX "job_data_company_growth_stage_idx" ON "public"."job_data"("company_growth_stage");

-- CreateIndex
CREATE INDEX "profiles_last_login_at_idx" ON "public"."profiles"("last_login_at");

-- CreateIndex
CREATE INDEX "profiles_onboarding_completed_idx" ON "public"."profiles"("onboarding_completed");

-- CreateIndex
CREATE INDEX "profiles_subscription_status_idx" ON "public"."profiles"("subscription_status");

-- CreateIndex
CREATE INDEX "profiles_is_trial_user_idx" ON "public"."profiles"("is_trial_user");

-- CreateIndex
CREATE INDEX "profiles_last_active_at_idx" ON "public"."profiles"("last_active_at");

-- AddForeignKey
ALTER TABLE "public"."user_insights" ADD CONSTRAINT "user_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feature_usage" ADD CONSTRAINT "feature_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_tracking" ADD CONSTRAINT "application_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_tracking" ADD CONSTRAINT "application_tracking_job_data_id_fkey" FOREIGN KEY ("job_data_id") REFERENCES "public"."job_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_tracking" ADD CONSTRAINT "application_tracking_cv_data_id_fkey" FOREIGN KEY ("cv_data_id") REFERENCES "public"."cv_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
