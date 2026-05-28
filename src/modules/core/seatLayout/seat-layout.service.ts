import { SeatLayout } from '@/generated/prisma/client';
import { injectTotalSeats } from './seat-layout.utils';
import { SeatLayoutInput } from './seat-layout.validation';
import { createSeatLayout, findSeatLayoutByName } from './seat-layout.repository';
import ApiError from '@/utils/apiError';
import { HttpStatusCode } from '@/types/utils.types';

export const createSeatLayoutService = async (data: SeatLayoutInput): Promise<SeatLayout> => {
  const existingLayout = await findSeatLayoutByName(data.layoutName);
  if (existingLayout) {
    throw new ApiError(HttpStatusCode.CONFLICT, 'A layout with this Name already exists');
  }
  const injectedLayout = injectTotalSeats(data);
  const seatLayout = await createSeatLayout(injectedLayout);
  return seatLayout;
};
