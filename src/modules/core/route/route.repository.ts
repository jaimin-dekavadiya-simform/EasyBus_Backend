import { prisma } from '@/config/prisma';
import { Route, RouteStops, Stop } from '@/generated/prisma/client';
import { RouteUncheckedCreateInput, StopCreateInput } from '@/generated/prisma/models';

export const createStop = async (data: StopCreateInput): Promise<Stop> => {
  const stop = await prisma.stop.create({ data });
  return stop;
};
export const findStopByName = async (name: string): Promise<Stop | null> => {
  const stop = await prisma.stop.findUnique({ where: { name } });
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
export const findRouteByLabelOrgId = async (data: {
  label: string;
  orgId: string;
}): Promise<Route | null> => {
  const route = await prisma.route.findFirst({ where: { orgId: data.orgId, label: data.label } });
  return route;
};
export const findRouteWithStopsById = async (
  id: string,
): Promise<(Route & { routeStops: RouteStops[] }) | null> => {
  const route = await prisma.route.findUnique({ where: { id }, include: { routeStops: true } });
  return route;
};
export const findManyStopsByStopIds = async (stopIds: string[]): Promise<Stop[]> => {
  const stops = await prisma.stop.findMany({ where: { id: { in: stopIds } } });
  return stops;
};
export const findRouteStopsByRouteId = async (routeId: string): Promise<RouteStops[]> => {
  const routeStops = await prisma.routeStops.findMany({
    where: { routeId },
    orderBy: { sequenceOrder: 'asc' },
  });
  return routeStops;
};
export const getAllStops = async (): Promise<Stop[]> => {
  const stops = await prisma.stop.findMany();
  return stops;
};
export const findStopById = async (id: string): Promise<Stop | null> => {
  const stop = await prisma.stop.findUnique({ where: { id } });
  return stop;
};
