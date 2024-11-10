/*
  Warnings:

  - You are about to drop the column `classId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_classId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "classId";
