import { prisma } from '@/config/prisma';
import { User } from '@/generated/prisma/client';
import { UserCreateInput, UserUpdateInput } from '@/generated/prisma/models';

export const createUser = async (user: UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({ data: user });
  return createdUser;
};

export const updateUserById = async (id: string, user: UserUpdateInput): Promise<User> => {
  const updatedUser = await prisma.user.update({ data: user, where: { id } });
  return updatedUser;
};
