import { RouteStops, Trip } from '@/generated/prisma/client';
import { Duration } from './trip.types';
import ApiError from '@/utils/apiError';
import { HttpStatusCode } from '@/types/utils.types';

export const isTimeOverlapping = (duration1: Duration, duration2: Duration): boolean => {
  return duration1.end > duration2.start && duration1.start < duration2.end;
};
export const calculateArrivalTime = (departureTime: Date, routeStops: RouteStops[]): Date => {
  const arrivalTime = new Date(departureTime);
  for (const stop of routeStops) {
    arrivalTime.setMinutes(arrivalTime.getMinutes() + stop.travelTimeFromPrevStop_Min);
  }
  return arrivalTime;
};

export const checkTripsOverlap = (
  source: { departureTime: Date; arrivalTime: Date },
  destinationTrips: Trip[],
): void => {
  for (const trip of destinationTrips) {
    if (
      isTimeOverlapping(
        { start: source.departureTime, end: source.arrivalTime },
        { start: trip.departureTime, end: trip.arrivalTime },
      )
    ) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        'Bus already assigned to another trip at the same time, Please choose different time frame',
      );
    }
  }
};
