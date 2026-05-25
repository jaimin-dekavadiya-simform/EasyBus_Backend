import { prisma } from '@/config/prisma';
import { Bus } from '@/generated/prisma/client';
import { BusUncheckedCreateInput } from '@/generated/prisma/models';

export const createBus = async (data: BusUncheckedCreateInput): Promise<Bus> => {
  const bus = prisma.bus.create({ data });
  return bus;
};
