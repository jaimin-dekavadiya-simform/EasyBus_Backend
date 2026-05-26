import { RouteStops } from '@/generated/prisma/client';
import { Duration } from './trip.types';

export const isTimeOverlapping = (duration1: Duration, duration2: Duration): boolean => {
  if (duration1.end > duration2.start && duration1.start < duration2.end) {
    return true;
  }
  return false;
};
export const calculateArrivalTime = (departureTime: Date, routeStops: RouteStops[]): Date => {
  const arrivalTime = new Date(departureTime);
  for (const stop of routeStops) {
    arrivalTime.setMinutes(arrivalTime.getMinutes() + stop.travelTimeFromPrevStop_Min);
  }
  return arrivalTime;
};
