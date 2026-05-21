import { Prisma, SeatLayout } from '@/generated/prisma/client';
import { injectTotalSeats } from './seat-layout.utils';
import { SeatLayoutInput } from './seat-layout.validation';
import { createSeatLayout } from './seat-layout.repository';
import ApiError from '@/utils/apiError';
import { HttpStatusCode } from '@/types/utils.types';

export const createSeatLayoutService = async (data: SeatLayoutInput): Promise<SeatLayout> => {
  const injectedLayout = injectTotalSeats(data);
  let seatLayout: SeatLayout;
  try {
    seatLayout = await createSeatLayout(injectedLayout);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'A layout with this name already exists');
    }
    throw error;
  }
  return seatLayout;
};
