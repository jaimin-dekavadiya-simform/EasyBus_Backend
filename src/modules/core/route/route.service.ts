import { Prisma, Route, Stop } from '@/generated/prisma/client';
import { CreateRouteInput, CreateStopInput } from './route.validation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { createRoute, createStop } from './route.repository';
import { resolveOrgId } from '@/utils/auth.utils';

export const createStopService = async (data: CreateStopInput): Promise<Stop> => {
  try {
    const stop = await createStop(data);
    return stop;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApiError(HttpStatusCode.CONFLICT, 'Stop Name already exists');
    }
    throw error;
  }
};

export const createRouteService = async (
  data: CreateRouteInput,
  user: AuthUser,
): Promise<Route> => {
  const orgId = resolveOrgId(data, user);
  try {
    const route = await createRoute({
      label: data.label,
      orgId: orgId,
      routeStops: {
        create: data.stops.map((stop, index) => ({
          stopId: stop.stopId,
          sequenceOrder: index + 1,
          distanceFromPrevStop_Km: stop.distanceFromPrevStop_Km,
          travelTimeFromPrevStop_Min: stop.travelTimeFromPrevStop_Min,
        })),
      },
    });
    return route;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(
          HttpStatusCode.CONFLICT,
          'A route with this label already exists for your organization.',
        );
      }
      if (error.code === 'P2003') {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          'Invalid reference. Either the organization or one of the stops provided does not exist in the database.',
        );
      }
    }
    throw error;
  }
};
