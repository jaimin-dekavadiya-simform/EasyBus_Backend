import { Organization } from '@/generated/prisma/client';
import { CreateOrganizationInput } from './organization.validation';
import { createOrganization } from './organization.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';

export const createOrganizationService = async (
  data: CreateOrganizationInput,
): Promise<Organization> => {
  try {
    const organization = await createOrganization(data);
    return organization;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.CONFLICT, 'Tenant Id already registered');
    }
    throw error;
  }
};
