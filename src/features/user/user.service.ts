import { prisma } from '@/config/prisma';
import { RegisterUserInput } from './user.schema';
import { hashToken } from '@/utils/crypto.utils';
import { createVerificationRecord } from '../verification/verification.service';
import ApiError from '@/utils/apiError';
import { EmailService } from '@/utils/email/email.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { User } from '@/generated/prisma/client';
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
      throw new ApiError(409, 'Email already registered');
    }
    throw error;
  }

  const token = await createVerificationRecord(user);
  const baseUrl = process.env.VERIFICATION_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(500, 'base url missing in environment variables');
  }
  const url = `${baseUrl}/verifyEmail?token=${token}`;
  await EmailService.sendVerificationMail(user.email, { url: url, name: user.name });
  return user;
};
