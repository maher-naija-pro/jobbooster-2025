-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ANALYZING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "RemoteType" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'JOB_MATCH', 'ANALYSIS_COMPLETE', 'REMINDER', 'PROMOTIONAL', 'SECURITY');

-- CreateEnum
CREATE TYPE "GeneratedContentType" AS ENUM ('COVER_LETTER', 'CV_OPTIMIZATION', 'INTERVIEW_PREP', 'SKILL_ANALYSIS', 'JOB_RECOMMENDATIONS', 'CAREER_ADVICE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'VIEWED', 'INTERVIEWED', 'REJECTED', 'OFFERED', 'ACCEPTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "CareerLevel" AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE', 'C_LEVEL');

-- CreateEnum
CREATE TYPE "CareerStage" AS ENUM ('EARLY_CAREER', 'MID_CAREER', 'LATE_CAREER', 'TRANSITION');

-- CreateEnum
CREATE TYPE "CompanyGrowthStage" AS ENUM ('STARTUP', 'SCALE_UP', 'MATURE', 'DECLINING');

-- CreateEnum
CREATE TYPE "LearningGoalType" AS ENUM ('SKILL_DEVELOPMENT', 'CERTIFICATION', 'DEGREE', 'COURSE', 'WORKSHOP', 'CONFERENCE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "username" VARCHAR(50),
    "avatar_url" VARCHAR(500),
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "subscription" JSONB NOT NULL DEFAULT '{"plan": "free"}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "archive_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "last_password_change" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "account_locked_until" TIMESTAMP(3),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "security_questions" JSONB,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "email_verification_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "email_verification_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_verification_sent" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER NOT NULL DEFAULT 1,
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "retention_policy" VARCHAR(100),
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),
    "last_login_at" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "total_session_time" INTEGER NOT NULL DEFAULT 0,
    "average_session_duration" INTEGER,
    "feature_usage_stats" JSONB,
    "last_active_at" TIMESTAMP(3),
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "preferred_job_types" JSONB,
    "preferred_locations" JSONB,
    "salary_expectations" JSONB,
    "career_goals" TEXT,
    "skill_interests" JSONB,
    "industry_preferences" JSONB,
    "career_stage" "CareerStage",
    "skill_gaps" JSONB,
    "subscription_status" VARCHAR(50),
    "subscription_start_date" TIMESTAMP(3),
    "subscription_end_date" TIMESTAMP(3),
    "billing_cycle" VARCHAR(20),
    "payment_method" VARCHAR(50),
    "trial_ends_at" TIMESTAMP(3),
    "is_trial_user" BOOLEAN NOT NULL DEFAULT false,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "device_info" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_url" VARCHAR(500),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "processing_status" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "is_active" BOOLEAN DEFAULT true,
    "is_archived" BOOLEAN DEFAULT false,
    "is_deleted" BOOLEAN DEFAULT false,
    "is_public" BOOLEAN DEFAULT false,
    "is_latest" BOOLEAN DEFAULT true,
    "archive_date" TIMESTAMP(3),
    "retention_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "processing_started_at" TIMESTAMP(3),
    "processing_completed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "processing_time" INTEGER,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "last_analyzed_at" TIMESTAMP(3),
    "analysis_count" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "data_classification" VARCHAR(50),
    "retention_policy" VARCHAR(100),
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "average_match_score" DECIMAL(5,2),
    "best_match_score" DECIMAL(5,2),
    "total_job_matches" INTEGER NOT NULL DEFAULT 0,
    "extracted_text" TEXT,
    "metadata" JSONB,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "full_name" VARCHAR(255),
    "date_of_birth" TIMESTAMP(3),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "nationality" VARCHAR(100),
    "linkedin_url" VARCHAR(500),
    "website_url" VARCHAR(500),
    "github_url" VARCHAR(500),
    "technical_skills" JSONB,
    "soft_skills" JSONB,
    "languages" JSONB,
    "certifications" JSONB,
    "education" JSONB,
    "work_experience" JSONB,
    "projects" JSONB,

    CONSTRAINT "cv_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_content" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cv_data_id" TEXT,
    "job_data_id" TEXT,
    "type" "GeneratedContentType" NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "metadata" JSONB,
    "confidence_score" DECIMAL(3,2),
    "quality_score" DECIMAL(3,2),
    "word_count" INTEGER,
    "reading_time" INTEGER,
    "processing_status" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_latest" BOOLEAN NOT NULL DEFAULT true,
    "archive_date" TIMESTAMP(3),
    "archived_by" VARCHAR(50),
    "archive_reason" VARCHAR(100),
    "retention_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER NOT NULL DEFAULT 1,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "copy_count" INTEGER NOT NULL DEFAULT 0,
    "last_copied_at" TIMESTAMP(3),
    "effectiveness_score" DECIMAL(3,2),
    "user_rating" DECIMAL(3,2),
    "feedback" TEXT,
    "improvement_suggestions" JSONB,
    "readability_score" DECIMAL(3,2),
    "keyword_optimization" JSONB,
    "tone_analysis" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "processing_started_at" TIMESTAMP(3),
    "processing_completed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "processing_time" INTEGER,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "data_classification" VARCHAR(50),
    "retention_policy" VARCHAR(100),
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),
    "last_health_check" TIMESTAMP(3),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "generated_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_providers" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_auth_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT,
    "title" VARCHAR(255),
    "company_name" VARCHAR(255),
    "company_description" TEXT,
    "company_logo_url" VARCHAR(500),
    "company_size" "CompanySize",
    "industry" VARCHAR(100),
    "department" VARCHAR(100),
    "job_type" "JobType",
    "remote_type" "RemoteType",
    "location" VARCHAR(255),
    "salary_range" VARCHAR(100),
    "experience_level" "ExperienceLevel",
    "application_deadline" TIMESTAMP(3),
    "benefits" JSONB,
    "recruiter_info" JSONB,
    "education_requirements" JSONB,
    "experience_requirements" JSONB,
    "hard_requirements" JSONB,
    "soft_requirements" JSONB,
    "soft_skill_requirements" JSONB,
    "technical_requirements" JSONB,
    "processing_status" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_latest" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER DEFAULT 0,
    "archive_date" TIMESTAMP(3),
    "archived_by" VARCHAR(50),
    "archive_reason" VARCHAR(100),
    "retention_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "processing_started_at" TIMESTAMP(3),
    "processing_completed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "processing_time" INTEGER,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "analysis_count" INTEGER NOT NULL DEFAULT 0,
    "last_analyzed_at" TIMESTAMP(3),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "data_classification" VARCHAR(50),
    "retention_policy" VARCHAR(100),
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "market_demand" DECIMAL(3,2),
    "competition_level" DECIMAL(3,2),
    "average_salary" DECIMAL(10,2),
    "salary_percentile" INTEGER,
    "growth_trend" VARCHAR(20),
    "skill_trends" JSONB,
    "location_demand" JSONB,
    "job_quality_score" DECIMAL(3,2),
    "description_clarity" DECIMAL(3,2),
    "requirements_clarity" DECIMAL(3,2),
    "benefits_score" DECIMAL(3,2),
    "company_rating" DECIMAL(3,2),
    "company_size_category" VARCHAR(50),
    "company_growth_stage" "CompanyGrowthStage",
    "company_culture" JSONB,
    "diversity_score" DECIMAL(3,2),
    "last_health_check" TIMESTAMP(3),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_job_matches" (
    "id" TEXT NOT NULL,
    "cv_data_id" TEXT NOT NULL,
    "job_data_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "overall_match_score" DECIMAL(5,2),
    "skills_match_score" DECIMAL(5,2),
    "experience_match_score" DECIMAL(5,2),
    "education_match_score" DECIMAL(5,2),
    "location_match_score" DECIMAL(5,2),
    "salary_match_score" DECIMAL(5,2),
    "analysis_confidence" DECIMAL(3,2),
    "completeness_score" DECIMAL(3,2),
    "consistency_score" DECIMAL(3,2),
    "matched_skills" JSONB,
    "missing_skills" JSONB,
    "extra_skills" JSONB,
    "match_reasons" JSONB,
    "improvement_suggestions" JSONB,
    "last_downloaded_at" TIMESTAMP(3),
    "analysis_version" TEXT,
    "model_used" TEXT,
    "analysis_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysis_duration" INTEGER,
    "processing_status" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "archive_date" TIMESTAMP(3),
    "archived_by" VARCHAR(50),
    "archive_reason" VARCHAR(100),
    "retention_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER NOT NULL DEFAULT 1,
    "processing_started_at" TIMESTAMP(3),
    "processing_completed_at" TIMESTAMP(3),
    "processing_error" TEXT,
    "processing_time" INTEGER,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "data_classification" VARCHAR(50),
    "retention_policy" VARCHAR(100),
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_health_check" TIMESTAMP(3),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "warning_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cv_job_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feature_name" VARCHAR(100) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "last_used_at" TIMESTAMP(3),
    "total_time_spent" INTEGER NOT NULL DEFAULT 0,
    "average_session_time" INTEGER,
    "success_rate" DECIMAL(5,2),
    "satisfaction_score" DECIMAL(3,2),
    "created_by" VARCHAR(50),
    "updated_by" VARCHAR(50),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "retention_policy" VARCHAR(100),
    "data_classification" VARCHAR(50),
    "gdpr_consent" BOOLEAN NOT NULL DEFAULT false,
    "consent_date" TIMESTAMP(3),
    "consent_version" VARCHAR(20),

    CONSTRAINT "feature_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_trends" (
    "id" TEXT NOT NULL,
    "skill" VARCHAR(100) NOT NULL,
    "industry" VARCHAR(100),
    "location" VARCHAR(100),
    "demand_score" DECIMAL(5,2) NOT NULL,
    "salary_trend" VARCHAR(20),
    "growth_rate" DECIMAL(5,2),
    "period" VARCHAR(20) NOT NULL,
    "data_source" VARCHAR(100),
    "sample_size" INTEGER,
    "confidence" DECIMAL(3,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_trends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "operation" VARCHAR(50) NOT NULL,
    "execution_time" INTEGER NOT NULL,
    "record_count" INTEGER,
    "query_hash" VARCHAR(64),
    "user_id" VARCHAR(50),
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archived_cv_data" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_url" VARCHAR(500),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "processing_status" "ProcessingStatus" NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL,
    "archive_reason" VARCHAR(100) NOT NULL,
    "archived_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "full_name" VARCHAR(255),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "archived_cv_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archived_job_data" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(255),
    "company_name" VARCHAR(255),
    "archived_at" TIMESTAMP(3) NOT NULL,
    "archive_reason" VARCHAR(100) NOT NULL,
    "archived_by" VARCHAR(50),
    "retention_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "archived_job_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_versions" (
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
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE INDEX "profiles_last_login_at_idx" ON "profiles"("last_login_at");

-- CreateIndex
CREATE INDEX "profiles_subscription_status_idx" ON "profiles"("subscription_status");

-- CreateIndex
CREATE INDEX "profiles_is_trial_user_idx" ON "profiles"("is_trial_user");

-- CreateIndex
CREATE INDEX "profiles_last_active_at_idx" ON "profiles"("last_active_at");

-- CreateIndex
CREATE INDEX "profiles_is_active_idx" ON "profiles"("is_active");

-- CreateIndex
CREATE INDEX "profiles_is_deleted_idx" ON "profiles"("is_deleted");

-- CreateIndex
CREATE INDEX "profiles_last_login_at_is_active_idx" ON "profiles"("last_login_at", "is_active");

-- CreateIndex
CREATE INDEX "profiles_subscription_status_subscription_end_date_idx" ON "profiles"("subscription_status", "subscription_end_date");

-- CreateIndex
CREATE INDEX "profiles_is_trial_user_trial_ends_at_idx" ON "profiles"("is_trial_user", "trial_ends_at");

-- CreateIndex
CREATE INDEX "profiles_is_active_is_deleted_created_at_idx" ON "profiles"("is_active", "is_deleted", "created_at");

-- CreateIndex
CREATE INDEX "profiles_last_active_at_is_active_idx" ON "profiles"("last_active_at", "is_active");

-- CreateIndex
CREATE INDEX "profiles_career_stage_is_active_idx" ON "profiles"("career_stage", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_token_key" ON "user_sessions"("session_token");

-- CreateIndex
CREATE INDEX "user_sessions_is_deleted_idx" ON "user_sessions"("is_deleted");

-- CreateIndex
CREATE INDEX "user_sessions_deleted_at_idx" ON "user_sessions"("deleted_at");

-- CreateIndex
CREATE INDEX "user_sessions_retention_date_idx" ON "user_sessions"("retention_date");

-- CreateIndex
CREATE INDEX "user_activity_is_deleted_idx" ON "user_activity"("is_deleted");

-- CreateIndex
CREATE INDEX "user_activity_deleted_at_idx" ON "user_activity"("deleted_at");

-- CreateIndex
CREATE INDEX "user_activity_retention_date_idx" ON "user_activity"("retention_date");

-- CreateIndex
CREATE INDEX "cv_data_user_id_idx" ON "cv_data"("user_id");

-- CreateIndex
CREATE INDEX "cv_data_created_at_idx" ON "cv_data"("created_at");

-- CreateIndex
CREATE INDEX "generated_content_user_id_idx" ON "generated_content"("user_id");

-- CreateIndex
CREATE INDEX "generated_content_cv_data_id_idx" ON "generated_content"("cv_data_id");

-- CreateIndex
CREATE INDEX "generated_content_job_data_id_idx" ON "generated_content"("job_data_id");

-- CreateIndex
CREATE INDEX "generated_content_type_idx" ON "generated_content"("type");

-- CreateIndex
CREATE INDEX "generated_content_is_active_idx" ON "generated_content"("is_active");

-- CreateIndex
CREATE INDEX "generated_content_is_archived_idx" ON "generated_content"("is_archived");

-- CreateIndex
CREATE INDEX "generated_content_is_deleted_idx" ON "generated_content"("is_deleted");

-- CreateIndex
CREATE INDEX "generated_content_created_at_idx" ON "generated_content"("created_at");

-- CreateIndex
CREATE INDEX "generated_content_is_latest_idx" ON "generated_content"("is_latest");

-- CreateIndex
CREATE INDEX "generated_content_confidence_score_idx" ON "generated_content"("confidence_score");

-- CreateIndex
CREATE INDEX "generated_content_quality_score_idx" ON "generated_content"("quality_score");

-- CreateIndex
CREATE INDEX "generated_content_effectiveness_score_idx" ON "generated_content"("effectiveness_score");

-- CreateIndex
CREATE INDEX "generated_content_user_rating_idx" ON "generated_content"("user_rating");

-- CreateIndex
CREATE INDEX "generated_content_user_id_is_active_created_at_idx" ON "generated_content"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_processing_status_created_at_idx" ON "generated_content"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_is_active_is_archived_created_at_idx" ON "generated_content"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_confidence_score_quality_score_created_at_idx" ON "generated_content"("confidence_score", "quality_score", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_type_is_active_created_at_idx" ON "generated_content"("type", "is_active", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_provider_key" ON "auth_providers"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_methods_user_id_provider_key" ON "user_auth_methods"("user_id", "provider");

-- CreateIndex
CREATE INDEX "user_notifications_is_deleted_idx" ON "user_notifications"("is_deleted");

-- CreateIndex
CREATE INDEX "user_notifications_deleted_at_idx" ON "user_notifications"("deleted_at");

-- CreateIndex
CREATE INDEX "user_notifications_retention_date_idx" ON "user_notifications"("retention_date");

-- CreateIndex
CREATE INDEX "contact_messages_is_deleted_idx" ON "contact_messages"("is_deleted");

-- CreateIndex
CREATE INDEX "contact_messages_deleted_at_idx" ON "contact_messages"("deleted_at");

-- CreateIndex
CREATE INDEX "contact_messages_retention_date_idx" ON "contact_messages"("retention_date");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- CreateIndex
CREATE INDEX "newsletter_is_deleted_idx" ON "newsletter"("is_deleted");

-- CreateIndex
CREATE INDEX "newsletter_deleted_at_idx" ON "newsletter"("deleted_at");

-- CreateIndex
CREATE INDEX "newsletter_retention_date_idx" ON "newsletter"("retention_date");

-- CreateIndex
CREATE INDEX "job_data_user_id_idx" ON "job_data"("user_id");

-- CreateIndex
CREATE INDEX "job_data_processing_status_idx" ON "job_data"("processing_status");

-- CreateIndex
CREATE INDEX "job_data_is_active_idx" ON "job_data"("is_active");

-- CreateIndex
CREATE INDEX "job_data_is_archived_idx" ON "job_data"("is_archived");

-- CreateIndex
CREATE INDEX "job_data_is_deleted_idx" ON "job_data"("is_deleted");

-- CreateIndex
CREATE INDEX "job_data_created_at_idx" ON "job_data"("created_at");

-- CreateIndex
CREATE INDEX "job_data_industry_idx" ON "job_data"("industry");

-- CreateIndex
CREATE INDEX "job_data_job_type_idx" ON "job_data"("job_type");

-- CreateIndex
CREATE INDEX "job_data_location_idx" ON "job_data"("location");

-- CreateIndex
CREATE INDEX "job_data_experience_level_idx" ON "job_data"("experience_level");

-- CreateIndex
CREATE INDEX "job_data_version_is_latest_idx" ON "job_data"("version", "is_latest");

-- CreateIndex
CREATE INDEX "job_data_company_name_idx" ON "job_data"("company_name");

-- CreateIndex
CREATE INDEX "job_data_title_idx" ON "job_data"("title");

-- CreateIndex
CREATE INDEX "job_data_application_deadline_idx" ON "job_data"("application_deadline");

-- CreateIndex
CREATE INDEX "job_data_market_demand_idx" ON "job_data"("market_demand");

-- CreateIndex
CREATE INDEX "job_data_competition_level_idx" ON "job_data"("competition_level");

-- CreateIndex
CREATE INDEX "job_data_job_quality_score_idx" ON "job_data"("job_quality_score");

-- CreateIndex
CREATE INDEX "job_data_company_rating_idx" ON "job_data"("company_rating");

-- CreateIndex
CREATE INDEX "job_data_company_growth_stage_idx" ON "job_data"("company_growth_stage");

-- CreateIndex
CREATE INDEX "job_data_user_id_is_active_created_at_idx" ON "job_data"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "job_data_processing_status_priority_created_at_idx" ON "job_data"("processing_status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "job_data_is_active_is_archived_created_at_idx" ON "job_data"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "job_data_processing_status_created_at_idx" ON "job_data"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_user_id_idx" ON "cv_job_matches"("user_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_cv_data_id_idx" ON "cv_job_matches"("cv_data_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_job_data_id_idx" ON "cv_job_matches"("job_data_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_overall_match_score_idx" ON "cv_job_matches"("overall_match_score");

-- CreateIndex
CREATE INDEX "cv_job_matches_analysis_date_idx" ON "cv_job_matches"("analysis_date");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_active_idx" ON "cv_job_matches"("is_active");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_archived_idx" ON "cv_job_matches"("is_archived");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_deleted_idx" ON "cv_job_matches"("is_deleted");

-- CreateIndex
CREATE INDEX "cv_job_matches_user_id_is_active_created_at_idx" ON "cv_job_matches"("user_id", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_processing_status_created_at_idx" ON "cv_job_matches"("processing_status", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_active_is_archived_created_at_idx" ON "cv_job_matches"("is_active", "is_archived", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_overall_match_score_is_active_created_at_idx" ON "cv_job_matches"("overall_match_score", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_analysis_date_overall_match_score_idx" ON "cv_job_matches"("analysis_date", "overall_match_score");

-- CreateIndex
CREATE UNIQUE INDEX "cv_job_matches_cv_data_id_job_data_id_key" ON "cv_job_matches"("cv_data_id", "job_data_id");

-- CreateIndex
CREATE INDEX "feature_usage_user_id_idx" ON "feature_usage"("user_id");

-- CreateIndex
CREATE INDEX "feature_usage_feature_name_idx" ON "feature_usage"("feature_name");

-- CreateIndex
CREATE INDEX "feature_usage_is_deleted_idx" ON "feature_usage"("is_deleted");

-- CreateIndex
CREATE INDEX "feature_usage_deleted_at_idx" ON "feature_usage"("deleted_at");

-- CreateIndex
CREATE INDEX "feature_usage_retention_date_idx" ON "feature_usage"("retention_date");

-- CreateIndex
CREATE UNIQUE INDEX "feature_usage_user_id_feature_name_key" ON "feature_usage"("user_id", "feature_name");

-- CreateIndex
CREATE INDEX "market_trends_skill_industry_location_idx" ON "market_trends"("skill", "industry", "location");

-- CreateIndex
CREATE INDEX "market_trends_period_created_at_idx" ON "market_trends"("period", "created_at");

-- CreateIndex
CREATE INDEX "market_trends_demand_score_created_at_idx" ON "market_trends"("demand_score", "created_at");

-- CreateIndex
CREATE INDEX "performance_metrics_table_name_operation_idx" ON "performance_metrics"("table_name", "operation");

-- CreateIndex
CREATE INDEX "performance_metrics_execution_time_created_at_idx" ON "performance_metrics"("execution_time", "created_at");

-- CreateIndex
CREATE INDEX "performance_metrics_user_id_created_at_idx" ON "performance_metrics"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "archived_cv_data_original_id_idx" ON "archived_cv_data"("original_id");

-- CreateIndex
CREATE INDEX "archived_cv_data_user_id_archived_at_idx" ON "archived_cv_data"("user_id", "archived_at");

-- CreateIndex
CREATE INDEX "archived_cv_data_archive_reason_archived_at_idx" ON "archived_cv_data"("archive_reason", "archived_at");

-- CreateIndex
CREATE INDEX "archived_job_data_original_id_idx" ON "archived_job_data"("original_id");

-- CreateIndex
CREATE INDEX "archived_job_data_user_id_archived_at_idx" ON "archived_job_data"("user_id", "archived_at");

-- CreateIndex
CREATE INDEX "archived_job_data_archive_reason_archived_at_idx" ON "archived_job_data"("archive_reason", "archived_at");

-- CreateIndex
CREATE UNIQUE INDEX "schema_versions_version_key" ON "schema_versions"("version");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_data" ADD CONSTRAINT "cv_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_content" ADD CONSTRAINT "generated_content_cv_data_id_fkey" FOREIGN KEY ("cv_data_id") REFERENCES "cv_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_content" ADD CONSTRAINT "generated_content_job_data_id_fkey" FOREIGN KEY ("job_data_id") REFERENCES "job_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_content" ADD CONSTRAINT "generated_content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_data" ADD CONSTRAINT "job_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_job_matches" ADD CONSTRAINT "cv_job_matches_cv_data_id_fkey" FOREIGN KEY ("cv_data_id") REFERENCES "cv_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_job_matches" ADD CONSTRAINT "cv_job_matches_job_data_id_fkey" FOREIGN KEY ("job_data_id") REFERENCES "job_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_job_matches" ADD CONSTRAINT "cv_job_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_usage" ADD CONSTRAINT "feature_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
