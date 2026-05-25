import { User } from '@/generated/prisma/client';
import { CreateUserInput } from './user.validation';
import { createUser } from './user.repository';
import { hashPassword } from '@/utils/crypto.utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { prismaConflictError, RoleWeights, UserRoles } from '@/types/user.types';

export const createUserService = async (
  data: CreateUserInput,
  userRole: UserRoles,
): Promise<User> => {
  const { password, ...userData } = data;
  const passwordHash = await hashPassword(password);
  if (RoleWeights[data.role] >= RoleWeights[userRole] || data.role === UserRoles.PASSENGER) {
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized Creation');
  }
  try {
    const user = await createUser({ ...userData, passwordHash, isVerified: true });
    return user;
  } catch (error) {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }

    const getTargetFields = (): string[] => {
      return (
        (error.meta?.target as string[]) ||
        (error.meta?.driverAdapterError as prismaConflictError)?.cause?.constraint?.fields ||
        []
      );
    };

    switch (error.code) {
      case 'P2002': {
        const targetFields = getTargetFields();

        if (targetFields.includes('email')) {
          throw new ApiError(HttpStatusCode.CONFLICT, 'Email already registered');
        }

        if (targetFields.includes('employee_code') || targetFields.includes('org_id')) {
          throw new ApiError(
            HttpStatusCode.CONFLICT,
            'This employee code is already registered for this organization',
          );
        }

        break;
      }

      case 'P2003':
        throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Organization does not exist');
    }

    throw error;
  }
};
