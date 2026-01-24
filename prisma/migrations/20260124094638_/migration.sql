-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('ANNOUNCEMENT', 'VOCAB', 'HOMEWORK');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'ANNOUNCEMENT';

-- CreateIndex
CREATE INDEX "Post_classId_type_idx" ON "Post"("classId", "type");

-- CreateIndex
CREATE INDEX "Post_dueAt_idx" ON "Post"("dueAt");
