import { RegisterUserInput, LoginUserInput } from './auth.schema';
import { comparePasswordHash, hashPassword, hashToken } from '@/utils/crypto.utils';
import ApiError from '@/utils/apiError';
import { sendVerificationMail } from '@/utils/email/email.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { User } from '@/generated/prisma/client';
import { HttpStatusCode } from '@/types/utils.types';
import { createUser, findUserByEmail, updateUserById } from '../user/user.repository';
import { UserRoles } from '@/types/user.types';
import { generateJwtToken, verifyToken } from '@/utils/auth.utils';
import { config } from '@/config/env';

export const registerUserService = async (data: RegisterUserInput): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  let user: User;
  try {
    user = await createUser({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      passwordHash: hashedPassword,
      role: UserRoles.PASSENGER,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.CONFLICT, 'Email already registered');
    }
    throw error;
  }
  sendVerificationMail(user);
  return user;
};

export const verifyEmailService = async (data: { token: string }): Promise<void> => {
  const token = data.token;
  const payload = verifyToken<{ userId: string }>(token, config.jwt.verification.secret);
  await updateUserById(payload.userId, { isVerified: true });
};

export const loginUserService = async (
  data: LoginUserInput,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid Credentials');
  }
  if (!user.isVerified) {
    throw new ApiError(HttpStatusCode.UNAUTHORIZED, 'User not verified');
  }
  const isCorrect = await comparePasswordHash(data.password, user.passwordHash);
  if (!isCorrect) {
    throw new ApiError(HttpStatusCode.BAD_REQUEST, 'Invalid Credentials');
  }
  const payload = { userId: user.id, role: user.role, orgId: user.orgId };
  const accessToken = generateJwtToken(payload, config.jwt.access.secret, config.jwt.access.expiry);
  const refreshToken = generateJwtToken(
    { userId: user.id },
    config.jwt.refresh.secret,
    config.jwt.refresh.expiry,
  );
  const hashedRefreshToken = hashToken(refreshToken);
  await updateUserById(user.id, { refreshTokenHash: hashedRefreshToken });
  return { accessToken, refreshToken };
};
