-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- Initialize comment levels based on parent relationship
UPDATE "Comment" 
SET "level" = CASE 
    WHEN "parentId" IS NULL THEN 1 
    ELSE 2 
END;

-- CreateIndex
CREATE INDEX "Comment_level_idx" ON "Comment"("level");
