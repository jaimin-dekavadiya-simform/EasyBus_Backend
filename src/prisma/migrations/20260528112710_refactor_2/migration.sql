/*
  Warnings:

  - You are about to drop the column `distance_from_prev_stop_km` on the `route_stops` table. All the data in the column will be lost.
  - You are about to drop the column `travel_time_from_prev_stop_min` on the `route_stops` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `trips` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[route_id,sequence_order]` on the table `route_stops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `distance_from_origin_km` to the `route_stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travel_time_from_origin_min` to the `route_stops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "route_stops" DROP COLUMN "distance_from_prev_stop_km",
DROP COLUMN "travel_time_from_prev_stop_min",
ADD COLUMN     "distance_from_origin_km" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "travel_time_from_origin_min" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "label" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "route_stops_route_id_sequence_order_key" ON "route_stops"("route_id", "sequence_order");
