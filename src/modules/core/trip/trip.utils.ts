import { RouteStops } from '@/generated/prisma/client';
import { Duration } from './trip.types';
import { logger } from '@/utils/logger';

export const isTimeOverlapping = (duration1: Duration, duration2: Duration): boolean => {
  logger.info(duration1, 'dur1');
  logger.info(duration2, 'dur2');
  logger.info(typeof duration1.start);
  logger.info(typeof duration2.start);
  return duration1.end > duration2.start && duration1.start < duration2.end;
};
export const calculateArrivalTime = (departureTime: Date, routeStops: RouteStops[]): Date => {
  const arrivalTime = new Date(departureTime);
  for (const stop of routeStops) {
    arrivalTime.setMinutes(arrivalTime.getMinutes() + stop.travelTimeFromPrevStop_Min);
  }
  return arrivalTime;
};
