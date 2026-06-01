import { Prisma, Trip } from '@/generated/prisma/client';

export type Duration = { start: Date; end: Date };
export type SearchedTrip = Trip & {
  calculatedDuration_Min: number;
  calculatedDistance_Km: number;
  totalAvailableSeats: number;
  totalSeats: number;
};

export type FullTripDetailsArgs = {
  include: {
    organization: true;
    route: { include: { routeStops: true } };
    conductor: { select: { firstName: true; lastName: true } };
    bus: { include: { layout: true } };
    tripSegments: true;
  };
};
export interface TripSegmentWithBitmap {
  id: string;
  tripId: string;
  fromStopId: string;
  toStopId: string;
  sequenceOrder: number;
  availableSeats: number;
  seatBitmap: string; // Type-safe string mapping!
}
export type FullTripDetails = Prisma.TripGetPayload<FullTripDetailsArgs>;
