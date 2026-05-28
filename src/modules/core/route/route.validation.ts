import z from 'zod';

export const createStopSchema = z.object({
  name: z.string('A valid Route Name is required').min(1, 'A valid Route Name is required'),
});

export const createRouteSchema = z.object({
  label: z.string('A valid Route Label is required').min(1, 'A valid Route Label is required'),

  orgId: z.uuid('Organization ID must be a valid UUID').optional(),

  stops: z.array(
    z.object(
      {
        stopId: z.uuid('Stop ID must be a valid UUID'),
        distanceFromPrevStop_Km: z.int('Distance must be a valid integer'),
        travelTimeFromPrevStop_Min: z.int('Travel time must be a valid integer'),
      },
      { message: 'Valid stop details are required' },
    ),
    { message: 'A list of stops is required' },
  ),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
