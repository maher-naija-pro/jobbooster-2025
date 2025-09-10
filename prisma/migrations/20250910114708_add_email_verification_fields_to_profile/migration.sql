-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "email_verification_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "email_verification_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "last_verification_sent" TIMESTAMP(3);
