import { prisma } from '@/config/prisma';
import { Organization } from '@/generated/prisma/client';
import { OrganizationCreateInput } from '@/generated/prisma/models';

export const createOrganization = async (data: OrganizationCreateInput): Promise<Organization> => {
  const organization = await prisma.organization.create({ data });
  return organization;
};
