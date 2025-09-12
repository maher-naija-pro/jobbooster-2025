-- Add missing retention and deletion fields to all tables

-- Add missing fields to ContactMessage
ALTER TABLE "contact_messages" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to Newsletter
ALTER TABLE "newsletter" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to UserNotification
ALTER TABLE "user_notifications" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to FeatureUsage
ALTER TABLE "feature_usage" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to UserActivity
ALTER TABLE "user_activity" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to UserSession
ALTER TABLE "user_sessions" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to PasswordResetToken
ALTER TABLE "password_reset_tokens" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to AuthProvider
ALTER TABLE "auth_providers" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to UserAuthMethod
ALTER TABLE "user_auth_methods" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to CvUpload
ALTER TABLE "cv_uploads" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to MarketTrends
ALTER TABLE "market_trends" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to PerformanceMetrics
ALTER TABLE "performance_metrics" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to ArchivedCvData
ALTER TABLE "archived_cv_data" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to ArchivedJobData
ALTER TABLE "archived_job_data" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Add missing fields to SchemaVersion
ALTER TABLE "schema_versions" 
ADD COLUMN "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" VARCHAR(50),
ADD COLUMN "retention_date" TIMESTAMP(3),
ADD COLUMN "retention_policy" VARCHAR(100),
ADD COLUMN "data_classification" VARCHAR(50),
ADD COLUMN "gdpr_consent" BOOLEAN DEFAULT false,
ADD COLUMN "consent_date" TIMESTAMP(3),
ADD COLUMN "consent_version" VARCHAR(20);

-- Create indexes for the new fields
CREATE INDEX "idx_contact_messages_is_deleted" ON "contact_messages"("is_deleted");
CREATE INDEX "idx_contact_messages_deleted_at" ON "contact_messages"("deleted_at");
CREATE INDEX "idx_contact_messages_retention_date" ON "contact_messages"("retention_date");

CREATE INDEX "idx_newsletter_is_deleted" ON "newsletter"("is_deleted");
CREATE INDEX "idx_newsletter_deleted_at" ON "newsletter"("deleted_at");
CREATE INDEX "idx_newsletter_retention_date" ON "newsletter"("retention_date");

CREATE INDEX "idx_user_notifications_is_deleted" ON "user_notifications"("is_deleted");
CREATE INDEX "idx_user_notifications_deleted_at" ON "user_notifications"("deleted_at");
CREATE INDEX "idx_user_notifications_retention_date" ON "user_notifications"("retention_date");

CREATE INDEX "idx_feature_usage_is_deleted" ON "feature_usage"("is_deleted");
CREATE INDEX "idx_feature_usage_deleted_at" ON "feature_usage"("deleted_at");
CREATE INDEX "idx_feature_usage_retention_date" ON "feature_usage"("retention_date");

CREATE INDEX "idx_user_activity_is_deleted" ON "user_activity"("is_deleted");
CREATE INDEX "idx_user_activity_deleted_at" ON "user_activity"("deleted_at");
CREATE INDEX "idx_user_activity_retention_date" ON "user_activity"("retention_date");

CREATE INDEX "idx_user_sessions_is_deleted" ON "user_sessions"("is_deleted");
CREATE INDEX "idx_user_sessions_deleted_at" ON "user_sessions"("deleted_at");
CREATE INDEX "idx_user_sessions_retention_date" ON "user_sessions"("retention_date");

CREATE INDEX "idx_password_reset_tokens_is_deleted" ON "password_reset_tokens"("is_deleted");
CREATE INDEX "idx_password_reset_tokens_deleted_at" ON "password_reset_tokens"("deleted_at");
CREATE INDEX "idx_password_reset_tokens_retention_date" ON "password_reset_tokens"("retention_date");

CREATE INDEX "idx_auth_providers_is_deleted" ON "auth_providers"("is_deleted");
CREATE INDEX "idx_auth_providers_deleted_at" ON "auth_providers"("deleted_at");
CREATE INDEX "idx_auth_providers_retention_date" ON "auth_providers"("retention_date");

CREATE INDEX "idx_user_auth_methods_is_deleted" ON "user_auth_methods"("is_deleted");
CREATE INDEX "idx_user_auth_methods_deleted_at" ON "user_auth_methods"("deleted_at");
CREATE INDEX "idx_user_auth_methods_retention_date" ON "user_auth_methods"("retention_date");

CREATE INDEX "idx_cv_uploads_is_deleted" ON "cv_uploads"("is_deleted");
CREATE INDEX "idx_cv_uploads_deleted_at" ON "cv_uploads"("deleted_at");
CREATE INDEX "idx_cv_uploads_retention_date" ON "cv_uploads"("retention_date");

CREATE INDEX "idx_market_trends_is_deleted" ON "market_trends"("is_deleted");
CREATE INDEX "idx_market_trends_deleted_at" ON "market_trends"("deleted_at");
CREATE INDEX "idx_market_trends_retention_date" ON "market_trends"("retention_date");

CREATE INDEX "idx_performance_metrics_is_deleted" ON "performance_metrics"("is_deleted");
CREATE INDEX "idx_performance_metrics_deleted_at" ON "performance_metrics"("deleted_at");
CREATE INDEX "idx_performance_metrics_retention_date" ON "performance_metrics"("retention_date");

CREATE INDEX "idx_archived_cv_data_is_deleted" ON "archived_cv_data"("is_deleted");
CREATE INDEX "idx_archived_cv_data_deleted_at" ON "archived_cv_data"("deleted_at");
CREATE INDEX "idx_archived_cv_data_retention_date" ON "archived_cv_data"("retention_date");

CREATE INDEX "idx_archived_job_data_is_deleted" ON "archived_job_data"("is_deleted");
CREATE INDEX "idx_archived_job_data_deleted_at" ON "archived_job_data"("deleted_at");
CREATE INDEX "idx_archived_job_data_retention_date" ON "archived_job_data"("retention_date");

CREATE INDEX "idx_schema_versions_is_deleted" ON "schema_versions"("is_deleted");
CREATE INDEX "idx_schema_versions_deleted_at" ON "schema_versions"("deleted_at");
CREATE INDEX "idx_schema_versions_retention_date" ON "schema_versions"("retention_date");
