import { Organization } from '@/generated/prisma/client';
import { CreateOrganizationInput } from './organization.validation';
import { createOrganization, findOrganizationByTenantId } from './organization.repository';
import { HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';

export const createOrganizationService = async (
  data: CreateOrganizationInput,
): Promise<Organization> => {
  const existingOrganization = await findOrganizationByTenantId(data.tenantId);
  if (existingOrganization) {
    throw new ApiError(HttpStatusCode.CONFLICT, 'Tenant Id already registered');
  }

  const organization = await createOrganization(data);
  return organization;
};
