import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import ApiError from './apiError';
const { JsonWebTokenError, TokenExpiredError } = jwt;

export const generateToken = <T extends object>(
  payload: T,
  secret: Secret,
  expiresIn: string,
): string => {
  const expiry = expiresIn as NonNullable<SignOptions['expiresIn']>;
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

export const verifyToken = <T>(token: string, secret: string): T => {
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
