-- CreateIndex
CREATE INDEX "analysis_templates_type_idx" ON "public"."analysis_templates"("type");

-- CreateIndex
CREATE INDEX "analysis_templates_is_active_idx" ON "public"."analysis_templates"("is_active");

-- CreateIndex
CREATE INDEX "analysis_templates_is_default_idx" ON "public"."analysis_templates"("is_default");

-- CreateIndex
CREATE INDEX "analysis_templates_created_by_idx" ON "public"."analysis_templates"("created_by");

-- CreateIndex
CREATE INDEX "cv_data_user_id_idx" ON "public"."cv_data"("user_id");

-- CreateIndex
CREATE INDEX "cv_data_status_idx" ON "public"."cv_data"("status");

-- CreateIndex
CREATE INDEX "cv_data_processing_status_idx" ON "public"."cv_data"("processing_status");

-- CreateIndex
CREATE INDEX "cv_data_is_active_idx" ON "public"."cv_data"("is_active");

-- CreateIndex
CREATE INDEX "cv_data_is_archived_idx" ON "public"."cv_data"("is_archived");

-- CreateIndex
CREATE INDEX "cv_data_created_at_idx" ON "public"."cv_data"("created_at");

-- CreateIndex
CREATE INDEX "cv_data_version_is_latest_idx" ON "public"."cv_data"("version", "is_latest");

-- CreateIndex
CREATE INDEX "cv_job_matches_user_id_idx" ON "public"."cv_job_matches"("user_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_cv_data_id_idx" ON "public"."cv_job_matches"("cv_data_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_job_data_id_idx" ON "public"."cv_job_matches"("job_data_id");

-- CreateIndex
CREATE INDEX "cv_job_matches_overall_match_score_idx" ON "public"."cv_job_matches"("overall_match_score");

-- CreateIndex
CREATE INDEX "cv_job_matches_status_idx" ON "public"."cv_job_matches"("status");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_bookmarked_idx" ON "public"."cv_job_matches"("is_bookmarked");

-- CreateIndex
CREATE INDEX "cv_job_matches_is_applied_idx" ON "public"."cv_job_matches"("is_applied");

-- CreateIndex
CREATE INDEX "cv_job_matches_analysis_date_idx" ON "public"."cv_job_matches"("analysis_date");

-- CreateIndex
CREATE INDEX "job_categories_parent_id_idx" ON "public"."job_categories"("parent_id");

-- CreateIndex
CREATE INDEX "job_categories_is_active_idx" ON "public"."job_categories"("is_active");

-- CreateIndex
CREATE INDEX "job_categories_sort_order_idx" ON "public"."job_categories"("sort_order");

-- CreateIndex
CREATE INDEX "job_data_user_id_idx" ON "public"."job_data"("user_id");

-- CreateIndex
CREATE INDEX "job_data_status_idx" ON "public"."job_data"("status");

-- CreateIndex
CREATE INDEX "job_data_processing_status_idx" ON "public"."job_data"("processing_status");

-- CreateIndex
CREATE INDEX "job_data_is_active_idx" ON "public"."job_data"("is_active");

-- CreateIndex
CREATE INDEX "job_data_is_archived_idx" ON "public"."job_data"("is_archived");

-- CreateIndex
CREATE INDEX "job_data_created_at_idx" ON "public"."job_data"("created_at");

-- CreateIndex
CREATE INDEX "job_data_industry_idx" ON "public"."job_data"("industry");

-- CreateIndex
CREATE INDEX "job_data_job_type_idx" ON "public"."job_data"("job_type");

-- CreateIndex
CREATE INDEX "job_data_location_idx" ON "public"."job_data"("location");

-- CreateIndex
CREATE INDEX "job_data_experience_level_idx" ON "public"."job_data"("experience_level");

-- CreateIndex
CREATE INDEX "job_data_version_is_latest_idx" ON "public"."job_data"("version", "is_latest");

-- CreateIndex
CREATE INDEX "skills_category_idx" ON "public"."skills"("category");

-- CreateIndex
CREATE INDEX "skills_is_active_idx" ON "public"."skills"("is_active");

-- CreateIndex
CREATE INDEX "skills_popularity_idx" ON "public"."skills"("popularity");
