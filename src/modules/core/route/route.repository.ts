import { prisma } from '@/config/prisma';
import { Route, Stop } from '@/generated/prisma/client';
import { RouteUncheckedCreateInput, StopCreateInput } from '@/generated/prisma/models';

export const createStop = async (data: StopCreateInput): Promise<Stop> => {
  const stop = await prisma.stop.create({ data });
  return stop;
};

export const createRoute = async (data: RouteUncheckedCreateInput): Promise<Route> => {
  const route = await prisma.route.create({ data });
  return route;
};
