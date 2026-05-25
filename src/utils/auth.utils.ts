import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import ApiError from './apiError';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import { UserRoles } from '@/types/user.types';
const { JsonWebTokenError, TokenExpiredError } = jwt;

export const generateJwtToken = <T extends object>(
  payload: T,
  secret: Secret,
  expiresIn: string,
): string => {
  const expiry = expiresIn as NonNullable<SignOptions['expiresIn']>;
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

export const verifyToken = <T extends object>(token: string, secret: string): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ApiError(401, 'Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new ApiError(401, 'Invalid token signature or malformed token');
    }
    throw error;
  }
};

export const resolveOrgId = (data: { orgId?: string | undefined }, user: AuthUser): string => {
  let orgId: string;
  if (user.role === UserRoles.SUPER_ADMIN) {
    if (!data.orgId) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Organization Id is required');
    }
    orgId = data.orgId;
  } else {
    orgId = user.orgId!;
  }
  return orgId;
};
