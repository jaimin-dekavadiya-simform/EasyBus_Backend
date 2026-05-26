import { prisma } from '@/config/prisma';
import { Bus, Trip } from '@/generated/prisma/client';
import { BusUncheckedCreateInput } from '@/generated/prisma/models';

export const createBus = async (data: BusUncheckedCreateInput): Promise<Bus> => {
  const bus = await prisma.bus.create({ data });
  return bus;
};

export const findBusWithTripsById = async (
  id: string,
): Promise<(Bus & { trips: Trip[] }) | null> => {
  const bus = await prisma.bus.findUnique({ where: { id }, include: { trips: true } });
  return bus;
};
