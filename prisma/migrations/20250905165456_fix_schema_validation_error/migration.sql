-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "career_stage" "public"."CareerStage",
ADD COLUMN     "skill_gaps" JSONB;

-- CreateTable
CREATE TABLE "public"."market_trends" (
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
CREATE TABLE "public"."performance_metrics" (
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
CREATE TABLE "public"."archived_cv_data" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_url" VARCHAR(500),
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "processing_status" "public"."ProcessingStatus" NOT NULL,
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
CREATE TABLE "public"."archived_job_data" (
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

-- CreateIndex
CREATE INDEX "market_trends_skill_industry_location_idx" ON "public"."market_trends"("skill", "industry", "location");

-- CreateIndex
CREATE INDEX "market_trends_period_created_at_idx" ON "public"."market_trends"("period", "created_at");

-- CreateIndex
CREATE INDEX "market_trends_demand_score_created_at_idx" ON "public"."market_trends"("demand_score", "created_at");

-- CreateIndex
CREATE INDEX "performance_metrics_table_name_operation_idx" ON "public"."performance_metrics"("table_name", "operation");

-- CreateIndex
CREATE INDEX "performance_metrics_execution_time_created_at_idx" ON "public"."performance_metrics"("execution_time", "created_at");

-- CreateIndex
CREATE INDEX "performance_metrics_user_id_created_at_idx" ON "public"."performance_metrics"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "archived_cv_data_original_id_idx" ON "public"."archived_cv_data"("original_id");

-- CreateIndex
CREATE INDEX "archived_cv_data_user_id_archived_at_idx" ON "public"."archived_cv_data"("user_id", "archived_at");

-- CreateIndex
CREATE INDEX "archived_cv_data_archive_reason_archived_at_idx" ON "public"."archived_cv_data"("archive_reason", "archived_at");

-- CreateIndex
CREATE INDEX "archived_job_data_original_id_idx" ON "public"."archived_job_data"("original_id");

-- CreateIndex
CREATE INDEX "archived_job_data_user_id_archived_at_idx" ON "public"."archived_job_data"("user_id", "archived_at");

-- CreateIndex
CREATE INDEX "archived_job_data_archive_reason_archived_at_idx" ON "public"."archived_job_data"("archive_reason", "archived_at");

-- CreateIndex
CREATE INDEX "cv_data_average_match_score_is_active_created_at_idx" ON "public"."cv_data"("average_match_score", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_overall_match_score_is_active_created_at_idx" ON "public"."cv_job_matches"("overall_match_score", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "cv_job_matches_analysis_date_overall_match_score_idx" ON "public"."cv_job_matches"("analysis_date", "overall_match_score");

-- CreateIndex
CREATE INDEX "generated_content_confidence_score_quality_score_created_at_idx" ON "public"."generated_content"("confidence_score", "quality_score", "created_at");

-- CreateIndex
CREATE INDEX "generated_content_type_is_active_created_at_idx" ON "public"."generated_content"("type", "is_active", "created_at");

-- CreateIndex
CREATE INDEX "profiles_career_stage_is_active_idx" ON "public"."profiles"("career_stage", "is_active");
