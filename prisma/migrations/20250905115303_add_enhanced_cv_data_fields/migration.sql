-- Add enhanced fields to cv_data table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'processing_status') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "processing_status" TEXT NOT NULL DEFAULT 'uploaded';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'processing_started_at') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "processing_started_at" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'processing_completed_at') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "processing_completed_at" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'processing_error') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "processing_error" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'analysis_id') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "analysis_id" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'analysis_version') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "analysis_version" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'original_filename') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "original_filename" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'view_count') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "view_count" INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'last_analyzed_at') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "last_analyzed_at" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'analysis_count') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "analysis_count" INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'is_public') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "is_public" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'retention_date') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "retention_date" TIMESTAMP(3);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'gdpr_consent') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "gdpr_consent" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'data_classification') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "data_classification" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'is_archived') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "is_archived" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cv_data' AND column_name = 'archive_date') THEN
        ALTER TABLE "public"."cv_data" ADD COLUMN "archive_date" TIMESTAMP(3);
    END IF;
END $$;