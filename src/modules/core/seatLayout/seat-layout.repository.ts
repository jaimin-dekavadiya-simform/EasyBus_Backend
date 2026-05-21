import { prisma } from '@/config/prisma';
import { SeatLayout } from '@/generated/prisma/client';
import { SeatLayoutCreateInput } from '@/generated/prisma/models';

export const createSeatLayout = async (data: SeatLayoutCreateInput): Promise<SeatLayout> => {
  const seatLayout = await prisma.seatLayout.create({ data });
  return seatLayout;
};
