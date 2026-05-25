import { RouteUncheckedCreateInput } from '@/generated/prisma/models';
import { CreateRouteInput } from './route.validation';

export const injectOrderInStops = (data: CreateRouteInput): RouteUncheckedCreateInput => {
  const injectedData = {
    ...data,
    stops: data.stops.map((element, index) => {
      return { ...element, sequenceOrder: index + 1 };
    }),
  };
  return injectedData;
};
