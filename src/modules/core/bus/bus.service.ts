import { Bus, Prisma } from '@/generated/prisma/client';
import { CreateBusInput } from './bus.validation';
import { createBus } from './bus.repository';
import ApiError from '@/utils/apiError';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import { resolveOrgId } from '@/utils/auth.utils';

export const createBusService = async (data: CreateBusInput, user: AuthUser): Promise<Bus> => {
  const orgId = resolveOrgId(data, user);
  try {
    const bus = await createBus({ ...data, orgId });
    return bus;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(
          HttpStatusCode.CONFLICT,
          'Bus with same registration number already registered',
        );
      }
      if (error.code === 'P2003') {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          'Invalid reference. Either the organization or Seat Layout does not exist in the database.',
        );
      }
    }
    throw error;
  }
};
