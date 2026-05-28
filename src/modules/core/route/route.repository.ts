import { prisma } from '@/config/prisma';
import { Route, RouteStops, Stop } from '@/generated/prisma/client';
import { RouteUncheckedCreateInput, StopCreateInput } from '@/generated/prisma/models';

export const createStop = async (data: StopCreateInput): Promise<Stop> => {
  const stop = await prisma.stop.create({ data });
  return stop;
};

export const createRoute = async (data: RouteUncheckedCreateInput): Promise<Route> => {
  const route = await prisma.route.create({ data });
  return route;
};

export const findRouteById = async (id: string): Promise<Route | null> => {
  const route = await prisma.route.findUnique({ where: { id } });
  return route;
};

export const findRouteWithStopsById = async (
  id: string,
): Promise<(Route & { routeStops: RouteStops[] }) | null> => {
  const route = await prisma.route.findUnique({ where: { id }, include: { routeStops: true } });
  return route;
};
