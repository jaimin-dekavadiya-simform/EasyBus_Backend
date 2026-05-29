import { prisma } from '@/config/prisma';
import { Trip } from '@/generated/prisma/client';
import { TripUncheckedCreateInput } from '@/generated/prisma/models';

export const createTrip = async (data: TripUncheckedCreateInput): Promise<Trip> => {
  const trip = await prisma.trip.create({ data });
  return trip;
};
