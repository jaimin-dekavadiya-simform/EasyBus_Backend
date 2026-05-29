import { prisma } from '@/config/prisma';
import { Trip } from '@/generated/prisma/client';
import { TripUncheckedCreateInput } from '@/generated/prisma/models';
import { SearchedTrip } from './trip.types';

export const createTrip = async (data: TripUncheckedCreateInput): Promise<Trip> => {
  const trip = await prisma.trip.create({ data });
  return trip;
};

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
  SELECT t.*,
    (dst.distance_from_origin_km - src.distance_from_origin_km) as calculatedDistance,
    (dst.travel_time_from_origin_min - src.travel_time_from_origin_min) as calculatedTravelTime
  FROM route_stops src JOIN route_stops dst ON src.route_id = dst.route_id 
    JOIN trips t ON t.route_id = src.route_id 
  WHERE src.stop_id = ${data.sourceId} 
    AND dst.stop_id =${data.destinationId} 
    AND src.sequence_order < dst.sequence_order
    AND t.departure_time < ${end}
    AND t.departure_time >= ${start}`;

  return result;
};
