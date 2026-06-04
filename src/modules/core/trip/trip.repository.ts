import { prisma } from '@/config/prisma';
import { RouteStops, Trip, TripSegment } from '@/generated/prisma/client';
import { TripUncheckedCreateInput } from '@/generated/prisma/models';
import { FullTripDetails, SearchedTrip } from './trip.types';

export const findTripsBetweenStops = async (data: {
  sourceId: string;
  destinationId: string;
  departureDate: Date;
}): Promise<SearchedTrip[]> => {
  const start = new Date(data.departureDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(data.departureDate);
  end.setHours(23, 59, 59, 999);

  const result: SearchedTrip[] = await prisma.$queryRaw`
  SELECT
  t.id,
  t.label,
  t.org_id AS "orgId",
  t.route_id AS "routeId",
  t.conductor_id AS "conductorId",
  t.bus_id AS "busId",
  t.driver_name AS "driverName",
  t.driver_license AS "driverLicense",
  t.departure_time AS "departureTime",
  t.arrival_time AS "arrivalTime",
  t.base_fare AS "baseFare",
  t.total_seats AS "totalSeats",
  t.status,
  t.created_at AS "createdAt",
  t.fare_multipliers AS "fareMultipliers",
  src.travel_time_from_origin_min AS "SrcTravelTimeFromOrigin_Min",
  dst.travel_time_from_origin_min AS "DstTravelTimeFromOrigin_Min",
  (dst.distance_from_origin_km - src.distance_from_origin_km) AS "calculatedDistance",
  (dst.travel_time_from_origin_min - src.travel_time_from_origin_min) AS "calculatedTravelTime",
  (
    SELECT MIN(ts.available_seats)
    FROM trip_segments ts
    WHERE ts.trip_id = t.id
      AND ts.sequence_order >= src.sequence_order
      AND ts.sequence_order < dst.sequence_order
  ) AS "totalAvailableSeats"

FROM route_stops src
JOIN route_stops dst
  ON src.route_id = dst.route_id

JOIN trips t
  ON t.route_id = src.route_id

WHERE src.stop_id = ${data.sourceId}
  AND dst.stop_id = ${data.destinationId}
  AND src.sequence_order < dst.sequence_order
  AND t.departure_time < ${end}
  AND t.departure_time >= ${start}`;

  return result;
};
export const createTripWithSegments = async (
  data: TripUncheckedCreateInput,
  routeStops: RouteStops[],
): Promise<Trip> => {
  const initialBitmap = '1'.repeat(data.totalSeats);

  const trip = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({ data: { ...data, totalSeats: data.totalSeats } });
    for (let i = 0; i < routeStops.length - 1; i++) {
      const currentStop = routeStops[i];
      const nextStop = routeStops[i + 1];

      await tx.$executeRaw`
          INSERT INTO trip_segments (
            trip_id, 
            from_stop_id, 
            to_stop_id, 
            sequence_order, 
            available_seats, 
            seat_bitmap
          )
          VALUES (
            ${trip.id}::uuid, 
            ${currentStop.stopId}::uuid, 
            ${nextStop.stopId}::uuid, 
            ${currentStop.sequenceOrder}, 
            ${data.totalSeats}, 
            ${initialBitmap}::varbit
          );
        `;
    }
    return trip;
  });
  return trip;
};
export const getTripDetails = async (id: string): Promise<FullTripDetails | null> => {
  const trip = prisma.trip.findUnique({
    where: { id },
    include: {
      organization: true,
      route: {
        include: { routeStops: { include: { stop: true }, orderBy: { sequenceOrder: 'asc' } } },
      },
      bus: { include: { layout: true } },
      tripSegments: { orderBy: { sequenceOrder: 'asc' } },
    },
  });
  return trip;
};
export const getTripSegmentsFromTripId = async (
  tripId: string,
): Promise<(TripSegment & { seatBitmap: string })[]> => {
  const result = await prisma.$queryRaw<(TripSegment & { seatBitmap: string })[]>`
    SELECT 
      id,
      trip_id AS "tripId",
      from_stop_id AS "fromStopId",
      to_stop_id AS "toStopId",
      sequence_order AS "sequenceOrder",
      available_seats AS "availableSeats",
      seat_bitmap::text AS "seatBitmap" 
    FROM public.trip_segments 
    WHERE trip_id = ${tripId}::uuid 
    ORDER BY sequence_order ASC;
  `;

  return result;
};
