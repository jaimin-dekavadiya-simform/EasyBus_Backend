import { prisma } from '@/config/prisma';
import { User } from '@/generated/prisma/client';
import { generateToken, hashToken } from '@/utils/crypto.utils';

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
