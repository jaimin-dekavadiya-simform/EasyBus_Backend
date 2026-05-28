/*
  Warnings:

  - Added the required column `label` to the `buses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buses" ADD COLUMN     "label" TEXT NOT NULL;
