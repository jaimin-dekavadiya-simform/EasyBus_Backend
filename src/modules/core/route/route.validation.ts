import z from 'zod';

export const createStopSchema = z.object({
  name: z.string().min(1, 'Route Name is Required'),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
