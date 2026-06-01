-- CreateTable
CREATE TABLE "trip_segments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "trip_id" UUID NOT NULL,
    "from_stop_id" UUID NOT NULL,
    "to_stop_id" UUID NOT NULL,
    "sequence_order" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL DEFAULT 0,
    "seat_bitmap" varbit NOT NULL,

    CONSTRAINT "trip_segments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trip_segments_trip_id_sequence_order_idx" ON "trip_segments"("trip_id", "sequence_order");

-- AddForeignKey
ALTER TABLE "trip_segments" ADD CONSTRAINT "trip_segments_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_segments" ADD CONSTRAINT "trip_segments_from_stop_id_fkey" FOREIGN KEY ("from_stop_id") REFERENCES "stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_segments" ADD CONSTRAINT "trip_segments_to_stop_id_fkey" FOREIGN KEY ("to_stop_id") REFERENCES "stops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
