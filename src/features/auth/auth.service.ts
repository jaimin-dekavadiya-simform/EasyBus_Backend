import { prisma } from '@/config/prisma';
import { RegisterUserInput } from './auth.schema';
import { hashToken, generateToken } from '@/utils/crypto.utils';
import ApiError from '@/utils/apiError';
import { EmailService } from '@/utils/email/email.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { User } from '@/generated/prisma/client';
import { HttpStatusCode } from '@/types/utils.types';

export const registerUserService = async (data: RegisterUserInput) => {
  const hashedPassword = await hashToken(data.password);

  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: 'PASSENGER',
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.CONFLICT, 'Email already registered');
    }
    throw error;
  }

  const token = await createVerificationRecord(user);
  const baseUrl = process.env.VERIFICATION_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'base url missing in environment variables',
    );
  }
  const url = `${baseUrl}/verifyEmail?token=${token}`;
  try {
    await EmailService.sendVerificationMail(user.email, { url: url, name: user.name });
  } catch (error) {
    console.log('Email Service Failed, Error :' + error);
  }

  return user;
};

export async function createVerificationRecord(user: User) {
  const token = generateToken();
  const hashedToken = await hashToken(token);
  const expireTime = Number(process.env.VERIFICATION_TOKEN_EXPIRY_TIME || 5);
  const expiresAt = new Date(Date.now() + expireTime * 60 * 1000);
  await prisma.emailVerifications.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: expiresAt,
    },
  });
  return token;
}
