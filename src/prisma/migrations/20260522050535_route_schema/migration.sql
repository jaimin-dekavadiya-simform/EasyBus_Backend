-- CreateTable
CREATE TABLE "stops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "longitude" DECIMAL(9,6),
    "latitude" DECIMAL(9,6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "org_id" UUID NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stop_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "distance_from_prev_stop_km" DOUBLE PRECISION NOT NULL,
    "travel_time_from_prev_stop_min" INTEGER NOT NULL,

    CONSTRAINT "RouteStops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stops_name_key" ON "stops"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Route_label_org_id_key" ON "Route"("label", "org_id");

-- CreateIndex
CREATE INDEX "RouteStops_route_id_sequence_order_idx" ON "RouteStops"("route_id", "sequence_order");

-- CreateIndex
CREATE INDEX "RouteStops_stop_id_idx" ON "RouteStops"("stop_id");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStops" ADD CONSTRAINT "RouteStops_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStops" ADD CONSTRAINT "RouteStops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
