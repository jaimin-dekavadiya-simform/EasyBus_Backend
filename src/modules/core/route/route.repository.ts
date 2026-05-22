import { prisma } from '@/config/prisma';
import { Stop } from '@/generated/prisma/client';
import { StopCreateInput } from '@/generated/prisma/models';

export const createStop = async (data: StopCreateInput): Promise<Stop> => {
  const stop = await prisma.stop.create({ data });
  return stop;
};
