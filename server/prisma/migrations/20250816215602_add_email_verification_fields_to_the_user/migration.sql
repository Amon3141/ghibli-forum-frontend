-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

UPDATE "public"."User" SET "isEmailVerified" = true WHERE "isEmailVerified" = false;