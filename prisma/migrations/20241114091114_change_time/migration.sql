/*
  Warnings:

  - You are about to alter the column `time` on the `Class` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `time` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "time" SET NOT NULL,
ALTER COLUMN "time" SET DATA TYPE VARCHAR(255);
