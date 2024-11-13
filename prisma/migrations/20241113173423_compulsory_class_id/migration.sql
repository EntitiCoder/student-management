/*
  Warnings:

  - Made the column `classId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "classId" SET NOT NULL;
