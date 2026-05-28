import { Trip } from '@/generated/prisma/client';
import { findOrganizationById } from '../organization/organization.repository';
import { resolveOrgId } from '@/utils/auth.utils';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { findRouteWithStopsById } from '../route/route.repository';
import { CreateTripInput } from './trip.validation';
import { findUserWithTripsById } from '../user/user.repository';
import { UserRoles } from '@/types/user.types';
import { calculateArrivalTime, checkTripsOverlap } from './trip.utils';
import { findBusWithTripsById } from '../bus/bus.repository';
import { createTrip } from './trip.repository';

export const createTripService = async (data: CreateTripInput, user: AuthUser): Promise<Trip> => {
  const orgId = resolveOrgId(data, user);
  data.departureTime = new Date(data.departureTime);

  const result = await Promise.all([
    findOrganizationById(orgId),
    findRouteWithStopsById(data.routeId),
    findUserWithTripsById(data.conductorId),
    findBusWithTripsById(data.busId),
  ]);
  const organization = result[0];
  if (!organization) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Organization does not exist');
  }

  const route = result[1];
  if (!route) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Route does not exist');
  }
  const arrivalTime = calculateArrivalTime(data.departureTime, route.routeStops);

  const conductorUser = result[2];
  if (!conductorUser || conductorUser.role !== UserRoles.CONDUCTOR) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Conductor Not Found');
  }
  checkTripsOverlap({ departureTime: data.departureTime, arrivalTime }, conductorUser.trips);

  const bus = result[3];
  if (!bus) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Bus does not exist');
  }
  checkTripsOverlap({ departureTime: data.departureTime, arrivalTime }, bus.trips);

  const trip = await createTrip({ ...data, orgId, arrivalTime });
  return trip;
};
