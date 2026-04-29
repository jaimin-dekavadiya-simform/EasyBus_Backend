import { prisma } from '@/config/prisma';
import { RegisterUserInput } from './auth.schema';
import { hashPassword } from '@/utils/crypto.utils';
import ApiError from '@/utils/apiError';
import { EmailService } from '@/utils/email/email.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { User } from '@/generated/prisma/client';
import { HttpStatusCode } from '@/types/utils.types';
import { createUser } from '../user/user.repository';
import { UserRoles } from '@/types/user.types';
import { generateToken, verifyToken } from '@/utils/auth.utils';
import { config } from '@/config/env';

export const registerUserService = async (data: RegisterUserInput): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  let user: User;
  try {
    user = await createUser({
      name: data.name,
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
  const emailVerificationToken = generateToken(
    { userId: user.id },
    config.jwt.verification.secret,
    config.jwt.verification.expiry,
  );
  const baseUrl = config.jwt.verification.baseUrl;
  if (!baseUrl) {
    throw new ApiError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'base url missing in environment variables',
    );
  }
  const url = `${baseUrl}/api/auth/verifyEmail?token=${emailVerificationToken}`;
  try {
    EmailService.sendVerificationMail(user.email, { url: url, name: user.name });
  } catch (error) {
    console.log('Email Service Failed, Error :' + error);
  }
  return user;
};

export const verifyEmailService = async (data: { token: string }): Promise<void> => {
  const token = data.token;
  const payload = verifyToken<{ userId: string }>(token, config.jwt.verification.secret);
  await prisma.user.update({
    data: { isVerified: true },
    where: { id: payload.userId },
  });
};
