/*
  Warnings:

  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteStops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seat_layout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_org_id_fkey";

-- DropForeignKey
ALTER TABLE "RouteStops" DROP CONSTRAINT "RouteStops_route_id_fkey";

-- DropForeignKey
ALTER TABLE "RouteStops" DROP CONSTRAINT "RouteStops_stop_id_fkey";

-- DropTable
DROP TABLE "Route";

-- DropTable
DROP TABLE "RouteStops";

-- DropTable
DROP TABLE "seat_layout";

-- CreateTable
CREATE TABLE "seat_layouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "layout_name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seat_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "org_id" UUID NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_stops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stop_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "distance_from_prev_stop_km" DOUBLE PRECISION NOT NULL,
    "travel_time_from_prev_stop_min" INTEGER NOT NULL,

    CONSTRAINT "route_stops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seat_layouts_layout_name_key" ON "seat_layouts"("layout_name");

-- CreateIndex
CREATE INDEX "seat_layouts_id_idx" ON "seat_layouts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "routes_label_org_id_key" ON "routes"("label", "org_id");

-- CreateIndex
CREATE INDEX "route_stops_route_id_sequence_order_idx" ON "route_stops"("route_id", "sequence_order");

-- CreateIndex
CREATE INDEX "route_stops_stop_id_idx" ON "route_stops"("stop_id");

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
