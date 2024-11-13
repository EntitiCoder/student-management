/*
  Warnings:

  - You are about to drop the column `postId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_lessonId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "postId";
