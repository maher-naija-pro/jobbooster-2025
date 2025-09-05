-- AlterTable
ALTER TABLE "public"."cv_data" ADD COLUMN     "analysis_confidence" DECIMAL(3,2),
ADD COLUMN     "categories" JSONB,
ADD COLUMN     "certifications" JSONB,
ADD COLUMN     "completeness_score" DECIMAL(3,2),
ADD COLUMN     "consistency_score" DECIMAL(3,2),
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "education" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "extraction_quality" JSONB,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "personal_info" JSONB,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "priority_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "professional_summary" TEXT,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "soft_skills" JSONB,
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "technical_skills" JSONB,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "website_url" TEXT,
ADD COLUMN     "work_experience" JSONB;

-- AlterTable
ALTER TABLE "public"."job_data" ADD COLUMN     "application_deadline" TIMESTAMP(3),
ADD COLUMN     "application_url" TEXT,
ADD COLUMN     "benefits" JSONB,
ADD COLUMN     "categories" JSONB,
ADD COLUMN     "company_description" TEXT,
ADD COLUMN     "company_logo_url" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "company_size" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "education_match_score" DECIMAL(5,2),
ADD COLUMN     "education_requirements" JSONB,
ADD COLUMN     "experience_match_score" DECIMAL(5,2),
ADD COLUMN     "experience_requirements" JSONB,
ADD COLUMN     "hard_requirements" JSONB,
ADD COLUMN     "is_latest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "job_id" TEXT,
ADD COLUMN     "job_posting_url" TEXT,
ADD COLUMN     "keywords" JSONB,
ADD COLUMN     "location_match_score" DECIMAL(5,2),
ADD COLUMN     "match_score" DECIMAL(5,2),
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "posted_date" TIMESTAMP(3),
ADD COLUMN     "priority_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recruiter_info" JSONB,
ADD COLUMN     "requirements" JSONB,
ADD COLUMN     "skills_match_score" DECIMAL(5,2),
ADD COLUMN     "soft_requirements" JSONB,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "tags" JSONB,
ADD COLUMN     "technical_requirements" JSONB,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."cv_job_matches" (
    "id" TEXT NOT NULL,
    "cv_data_id" TEXT NOT NULL,
    "job_data_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "overall_match_score" DECIMAL(5,2) NOT NULL,
    "skills_match_score" DECIMAL(5,2) NOT NULL,
    "experience_match_score" DECIMAL(5,2) NOT NULL,
    "education_match_score" DECIMAL(5,2) NOT NULL,
    "location_match_score" DECIMAL(5,2) NOT NULL,
    "salary_match_score" DECIMAL(5,2),
    "matched_skills" JSONB,
    "missing_skills" JSONB,
    "extra_skills" JSONB,
    "match_reasons" JSONB,
    "improvement_suggestions" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "is_applied" BOOLEAN NOT NULL DEFAULT false,
    "application_date" TIMESTAMP(3),
    "notes" TEXT,
    "analysis_version" TEXT,
    "model_used" TEXT,
    "analysis_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_job_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "synonyms" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analysis_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_job_matches_cv_data_id_job_data_id_key" ON "public"."cv_job_matches"("cv_data_id", "job_data_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_categories_name_key" ON "public"."job_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "public"."skills"("name");

-- AddForeignKey
ALTER TABLE "public"."cv_job_matches" ADD CONSTRAINT "cv_job_matches_cv_data_id_fkey" FOREIGN KEY ("cv_data_id") REFERENCES "public"."cv_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cv_job_matches" ADD CONSTRAINT "cv_job_matches_job_data_id_fkey" FOREIGN KEY ("job_data_id") REFERENCES "public"."job_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cv_job_matches" ADD CONSTRAINT "cv_job_matches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_categories" ADD CONSTRAINT "job_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."job_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
