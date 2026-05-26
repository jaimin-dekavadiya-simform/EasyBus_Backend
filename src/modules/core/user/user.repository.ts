import { prisma } from '@/config/prisma';
import { Trip, User } from '@/generated/prisma/client';
import { UserCreateInput, UserUpdateInput } from '@/generated/prisma/models';

export const createUser = async (user: UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({ data: user });
  return createdUser;
};

export const updateUserById = async (id: string, user: UserUpdateInput): Promise<User> => {
  const updatedUser = await prisma.user.update({ data: user, where: { id } });
  return updatedUser;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const findUserById = async (userId: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
};

export const findUserWithTripsById = async (
  userId: string,
): Promise<(User & { trips: Trip[] }) | null> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { trips: true } });
  return user;
};
