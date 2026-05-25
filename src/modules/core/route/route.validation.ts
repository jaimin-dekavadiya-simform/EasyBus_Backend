import z from 'zod';

export const createStopSchema = z.object({
  name: z.string().min(1, 'Route Name is Required'),
});
export const createRouteSchema = z.object({
  label: z.string().min(1, 'Route Label is Required'),
  orgId: z.uuid().optional(),
  stops: z.array(
    z.object({
      stopId: z.uuid(),
      distanceFromPrevStop_Km: z.int(),
      travelTimeFromPrevStop_Min: z.int(),
    }),
  ),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
