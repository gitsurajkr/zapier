/*
  Warnings:

  - Made the column `image` on table `AvailableAction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AvailableAction" ALTER COLUMN "image" SET NOT NULL;
