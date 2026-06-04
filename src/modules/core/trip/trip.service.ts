import { Trip } from '@/generated/prisma/client';
import { findOrganizationById } from '../organization/organization.repository';
import { resolveOrgId } from '@/modules/core/auth/auth.utils';
import { AuthUser, HttpStatusCode } from '@/types/utils.types';
import ApiError from '@/utils/apiError';
import { findRouteWithStopsById, findStopById } from '../route/route.repository';
import { CreateTripInput, GetTripDetailsInput, SearchTripInput } from './trip.validation';
import { findUserWithTripsById } from '../user/user.repository';
import { UserRoles } from '@/modules/core/user/user.types';
import { calculateArrivalTime, checkTripsOverlap } from './trip.utils';
import { findBusWithTripsById } from '../bus/bus.repository';
import {
  createTripWithSegments,
  findTripsBetweenStops,
  getTripDetails,
  getTripSegmentsFromTripId,
} from './trip.repository';
import { SearchedTrip } from './trip.types';

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
  if (conductorUser?.role !== UserRoles.CONDUCTOR) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Conductor Not Found');
  }
  checkTripsOverlap({ departureTime: data.departureTime, arrivalTime }, conductorUser.trips);
  const bus = result[3];
  if (!bus) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Bus does not exist');
  }
  checkTripsOverlap({ departureTime: data.departureTime, arrivalTime }, bus.trips);
  const totalSeats = (bus.layout.config as { totalSeats: number }).totalSeats;
  const trip = await createTripWithSegments(
    { ...data, orgId, arrivalTime, totalSeats },
    route.routeStops,
  );
  return trip;
};

export const searchTripsBetweenStopsService = async (
  data: SearchTripInput,
): Promise<{
  trips: SearchedTrip[];
  metadata: {
    sourceId: string;
    sourceName: string;
    destinationName: string;
    destinationId: string;
  };
}> => {
  const [source, destination] = await Promise.all([
    findStopById(data.sourceId),
    findStopById(data.destinationId),
  ]);
  if (!source || !destination) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Stops not found');
  }
  const trips = await findTripsBetweenStops(data);
  return {
    trips: trips,
    metadata: {
      sourceId: source.id,
      sourceName: source.name,
      destinationId: destination.id,
      destinationName: destination.name,
    },
  };
};

export const getTripDetailsWithAvailableSeatsService = async (data: GetTripDetailsInput) => {
  const trip = await getTripDetails(data.tripId);
  if (!trip) {
    throw new ApiError(HttpStatusCode.NOT_FOUND, 'Trip not found');
  }

  const sourceStop = trip.route.routeStops.find((s) => s.stopId === data.sourceId);
  const destStop = trip.route.routeStops.find((s) => s.stopId === data.destinationId);

  if (!sourceStop || !destStop) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      'Invalid source or destination stop for this trip route',
    );
  }

  if (sourceStop.sequenceOrder >= destStop.sequenceOrder) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      'Source stop must precede destination stop in sequence',
    );
  }

  const calculatedDistance = destStop.distanceFromOrigin_Km - sourceStop.distanceFromOrigin_Km;
  const calculatedTravelTime =
    destStop.travelTimeFromOrigin_Min - sourceStop.travelTimeFromOrigin_Min;

  const tripSegments = await getTripSegmentsFromTripId(trip.id);

  const relevantSegments = tripSegments.filter(
    (seg) =>
      seg.sequenceOrder >= sourceStop.sequenceOrder && seg.sequenceOrder < destStop.sequenceOrder,
  );

  if (relevantSegments.length === 0) {
    throw new Error('No physical trip segments found for the specified leg');
  }

  const bitmaps = relevantSegments.map((seg) => seg.seatBitmap);
  let mergedJourneyBitmask = bitmaps[0];
  for (let i = 1; i < bitmaps.length; i++) {
    let intersection = '';
    const currentBitmap = bitmaps[i];
    for (let j = 0; j < mergedJourneyBitmask.length; j++) {
      intersection += mergedJourneyBitmask[j] === '1' && currentBitmap[j] === '1' ? '1' : '0';
    }
    mergedJourneyBitmask = intersection;
  }
  const totalAvailableSeats = (mergedJourneyBitmask.match(/1/g) || []).length;
  return {
    ...trip,
    sourceId: data.sourceId,
    destinationId: data.destinationId,
    metrics: {
      calculatedDistance,
      calculatedTravelTime,
      totalAvailableSeats,
      mergedJourneyBitmask,
    },
  };
};
