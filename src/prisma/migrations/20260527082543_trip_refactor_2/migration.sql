-- DropIndex
DROP INDEX "trips_route_id_idx";

-- CreateIndex
CREATE INDEX "trips_route_id_departure_time_idx" ON "trips"("route_id", "departure_time");
