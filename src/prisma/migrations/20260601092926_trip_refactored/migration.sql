/*
  Warnings:

  - You are about to alter the column `seat_bitmap` on the `trip_segments` table. The data in that column could be lost. The data in that column will be cast from `VarBit` to `Unsupported("varbit")`.

*/
-- AlterTable
ALTER TABLE "trip_segments" ALTER COLUMN "seat_bitmap" SET DATA TYPE varbit;
