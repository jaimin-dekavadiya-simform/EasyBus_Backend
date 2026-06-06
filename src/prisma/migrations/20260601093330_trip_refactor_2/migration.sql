/*
  Warnings:

  - You are about to alter the column `seat_bitmap` on the `trip_segments` table. The data in that column could be lost. The data in that column will be cast from `VarBit` to `Unsupported("varbit")`.
  - Added the required column `total_seats` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trip_segments" ALTER COLUMN "seat_bitmap" SET DATA TYPE varbit;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "total_seats" INTEGER NOT NULL;
