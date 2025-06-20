/*
  Warnings:

  - Made the column `image` on table `AvailableTrigger` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AvailableTrigger" ALTER COLUMN "image" SET NOT NULL;
