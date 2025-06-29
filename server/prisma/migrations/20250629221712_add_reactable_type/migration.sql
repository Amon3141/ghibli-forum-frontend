/*
  Warnings:

  - Added the required column `reactableType` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReactableType" AS ENUM ('COMMENT', 'THREAD');

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "reactableType" "ReactableType" NOT NULL;

-- CreateIndex
CREATE INDEX "Reaction_reactableType_idx" ON "Reaction"("reactableType");
