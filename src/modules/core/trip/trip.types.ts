import { Trip } from '@/generated/prisma/client';

export type Duration = { start: Date; end: Date };
export type SearchedTrip = Trip & { calculatedDuration_Min: number; calculatedDistance_Km: number };
