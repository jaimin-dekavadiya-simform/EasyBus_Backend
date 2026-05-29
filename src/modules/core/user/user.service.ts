import { User } from '@/generated/prisma/client';
import { CreateUserInput } from './user.validation';
import { createUser, findUserByEmail, findUserByEmployeeCode } from './user.repository';
import { hashPassword } from '@/utils/crypto.utils';
import { HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { RoleWeights, UserRoles } from '@/modules/core/user/user.types';
import { findOrganizationById } from '../organization/organization.repository';

export const createUserService = async (
  data: CreateUserInput,
  userRole: UserRoles,
): Promise<User> => {
  const { password, ...userData } = data;

  if (RoleWeights[data.role] >= RoleWeights[userRole] || data.role === UserRoles.PASSENGER) {
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized Creation');
  }

  if (userData.orgId) {
    const organization = await findOrganizationById(userData.orgId);
    if (!organization) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Organization does not exist');
    }
  }

  const existingEmailUser = await findUserByEmail(userData.email);
  if (existingEmailUser) {
    throw new ApiError(HttpStatusCode.CONFLICT, 'Email already registered');
  }

  if (userData.employeeCode && userData.orgId) {
    const existingEmployee = await findUserByEmployeeCode(userData.employeeCode, userData.orgId);
    if (existingEmployee) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        'This employee code is already registered for this organization',
      );
    }
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ ...userData, passwordHash, isVerified: true });
  return user;
};
