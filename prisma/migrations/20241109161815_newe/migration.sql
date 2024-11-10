/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
