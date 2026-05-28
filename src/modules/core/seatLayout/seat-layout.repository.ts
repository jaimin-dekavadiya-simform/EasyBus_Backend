import { prisma } from '@/config/prisma';
import { SeatLayout } from '@/generated/prisma/client';
import { SeatLayoutCreateInput } from '@/generated/prisma/models';

export const createSeatLayout = async (data: SeatLayoutCreateInput): Promise<SeatLayout> => {
  const seatLayout = await prisma.seatLayout.create({ data });
  return seatLayout;
};

export const findSeatLayoutById = async (id: string): Promise<SeatLayout | null> => {
  const seatLayout = await prisma.seatLayout.findUnique({ where: { id } });
  return seatLayout;
};

export const findSeatLayoutByName = async (layoutName: string): Promise<SeatLayout | null> => {
  const seatLayout = await prisma.seatLayout.findUnique({ where: { layoutName } });
  return seatLayout;
};
