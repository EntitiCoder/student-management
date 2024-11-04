/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "thumbnail",
ALTER COLUMN "photo" SET DEFAULT '/avatar.png';
