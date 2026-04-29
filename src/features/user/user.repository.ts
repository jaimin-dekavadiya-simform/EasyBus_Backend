import { prisma } from '@/config/prisma';
import { User } from '@/generated/prisma/client';
import { UserCreateInput } from '@/generated/prisma/models';

export const createUser = async (user: UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({ data: user });
  return createdUser;
};
