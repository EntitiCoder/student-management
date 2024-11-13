/*
  Warnings:

  - You are about to drop the column `mockupImages` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `pathToMoney` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Post` table. All the data in the column will be lost.
  - Added the required column `media` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mockupImages",
DROP COLUMN "pathToMoney",
DROP COLUMN "upvotes",
ADD COLUMN     "media" TEXT NOT NULL;
