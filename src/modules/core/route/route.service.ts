import { Stop } from '@/generated/prisma/client';
import { CreateStopInput } from './route.validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { createStop } from './route.repository';

export const createStopService = async (data: CreateStopInput): Promise<Stop> => {
  try {
    const stop = await createStop(data);
    return stop;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.CONFLICT, 'Stop Name already exists');
    }
    throw error;
  }
};
