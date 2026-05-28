import { Bus } from '@/generated/prisma/client';
import { CreateBusInput } from './bus.validation';
import { createBus, findBusByRegistrationNumber } from './bus.repository';
import ApiError from '@/utils/apiError';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import { resolveOrgId } from '@/utils/auth.utils';
import { findOrganizationById } from '../organization/organization.repository';
import { findSeatLayoutById } from '../seatLayout/seat-layout.repository';

export const createBusService = async (data: CreateBusInput, user: AuthUser): Promise<Bus> => {
  const orgId = resolveOrgId(data, user);

  const [existingBus, organization, seatLayout] = await Promise.all([
    findBusByRegistrationNumber(data.registrationNumber),
    findOrganizationById(orgId),
    findSeatLayoutById(data.layoutId),
  ]);
  if (existingBus) {
    throw new ApiError(
      HttpStatusCode.CONFLICT,
      'Bus with same registration number already registered',
    );
  }
  if (!organization) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Invalid reference: Organization does not exist.');
  }
  if (!seatLayout) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Invalid reference: Seat Layout does not exist.');
  }

  const bus = await createBus({ ...data, orgId });
  return bus;
};
