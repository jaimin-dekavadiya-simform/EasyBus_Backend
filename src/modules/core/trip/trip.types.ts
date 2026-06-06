import { Prisma, Trip } from '@/generated/prisma/client';

export type Duration = { start: Date; end: Date };

export type SearchedTrip = Trip & {
  calculatedDistance: number;
  calculatedTravelTime: number;
  SrcTravelTimeFromOrigin_Min: number;
  DstTravelTimeFromOrigin_Min: number;
  sourceName: string;
};

export type FullTripDetailsArgs = {
  include: {
    organization: true;
    route: { include: { routeStops: { include: { stop: true } } } };
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
  seatBitmap: string;
}
export type FullTripDetails = Prisma.TripGetPayload<FullTripDetailsArgs>;
