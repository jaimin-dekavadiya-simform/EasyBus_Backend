import { prisma } from '@/config/prisma';
import { Bus, SeatLayout, Trip } from '@/generated/prisma/client';
import { BusUncheckedCreateInput } from '@/generated/prisma/models';

export const createBus = async (data: BusUncheckedCreateInput): Promise<Bus> => {
  const bus = await prisma.bus.create({ data });
  return bus;
};

export const findBusWithTripsById = async (
  id: string,
): Promise<{ trips: Trip[]; layout: SeatLayout } | null> => {
  const bus = await prisma.bus.findUnique({
    where: { id },
    include: { trips: true, layout: true },
  });
  return bus;
};

export const findBusByRegistrationNumber = async (
  registrationNumber: string,
): Promise<Bus | null> => {
  const bus = await prisma.bus.findUnique({
    where: { registrationNumber },
  });
  return bus;
};
