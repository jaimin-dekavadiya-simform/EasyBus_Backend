import { HttpStatusCode } from './../types/utils.types';
import { config } from '@/config/env';
import ApiError from '@/utils/apiError';
import { verifyToken } from '@/utils/auth.utils';
import { RequestHandler } from 'express';
import { UserRoles } from '@/types/user.types';

export const authenticateUser: RequestHandler = (req, _res, next) => {
  const accessToken: string = req.cookies?.accessToken;
  if (!accessToken) {
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized Access');
  }
  const payload = verifyToken<{ userId: string; role: UserRoles; orgId: string | null }>(
    accessToken,
    config.jwt.access.secret,
  );
  req.user = payload;
  next();
};

export const authorizeUser =
  (roles: UserRoles | UserRoles[]): RequestHandler =>
  (req, _res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!req.user) {
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'Unauthorized Access');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(HttpStatusCode.FORBIDDEN, 'Forbidden Access');
    }
    next();
  };
