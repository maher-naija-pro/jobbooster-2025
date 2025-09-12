-- AlterTable
ALTER TABLE "public"."contact_messages" ADD COLUMN     "consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dataRetentionConsent" BOOLEAN NOT NULL DEFAULT false;
