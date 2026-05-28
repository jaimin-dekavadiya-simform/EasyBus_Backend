import { Route, Stop } from '@/generated/prisma/client';
import { CreateRouteInput, CreateStopInput } from './route.validation';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import {
  createRoute,
  createStop,
  findManyStopsByStopIds,
  findRouteByLabelOrgId,
  findStopByName,
} from './route.repository';
import { resolveOrgId } from '@/utils/auth.utils';
import { findOrganizationById } from '../organization/organization.repository';
import { RouteStopsUncheckedCreateWithoutRouteInput } from '@/generated/prisma/models';

export const createStopService = async (data: CreateStopInput): Promise<Stop> => {
  const existingStop = await findStopByName(data.name);
  if (existingStop) {
    throw new ApiError(HttpStatusCode.CONFLICT, 'Stop Name already exists');
  }
  const stop = await createStop(data);
  return stop;
};

export const createRouteService = async (
  data: CreateRouteInput,
  user: AuthUser,
): Promise<Route> => {
  const orgId = resolveOrgId(data, user);
  const stopIds = data.stops.map((stop) => stop.stopId);

  const [existingRoute, organization, existingStops] = await Promise.all([
    findRouteByLabelOrgId({ label: data.label, orgId }),
    findOrganizationById(orgId),
    findManyStopsByStopIds(stopIds),
  ]);

  if (existingRoute) {
    throw new ApiError(
      HttpStatusCode.CONFLICT,
      'A route with this label already exists for your organization.',
    );
  }

  if (!organization) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Invalid reference: Organization does not exist.');
  }

  if (existingStops.length !== stopIds.length) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      'Invalid reference: One or more of the provided stops do not exist.',
    );
  }

  const { routeStopsData } = data.stops.reduce(
    (acc, stop, index) => {
      const nextDistance = acc.totalDistance + stop.distanceFromPrevStop_Km;
      const nextTime = acc.totalTime + stop.travelTimeFromPrevStop_Min;
      acc.routeStopsData.push({
        stopId: stop.stopId,
        sequenceOrder: index + 1,
        distanceFromOrigin_Km: nextDistance,
        travelTimeFromOrigin_Min: nextTime,
      });
      return {
        totalDistance: nextDistance,
        totalTime: nextTime,
        routeStopsData: acc.routeStopsData,
      };
    },
    {
      totalDistance: 0,
      totalTime: 0,
      routeStopsData: [] as RouteStopsUncheckedCreateWithoutRouteInput[],
    },
  );

  const route = await createRoute({
    label: data.label,
    orgId: orgId,
    routeStops: {
      create: routeStopsData,
    },
  });

  return route;
};
