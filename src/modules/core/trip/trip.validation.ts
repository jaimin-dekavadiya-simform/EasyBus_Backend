import z from 'zod';
import { BookableSeatTypes } from '../seatLayout/seat-layout.types';

const optionalSeatTypes = Object.values(BookableSeatTypes).reduce(
  (acc, seat) => {
    acc[seat] = z
      .number({ error: 'Fare multiplier must be a number' })
      .positive('Fare multiplier must be greater than 0')
      .optional();
    return acc;
  },
  {} as Record<string, z.ZodOptional<z.ZodNumber>>,
);

export const fareMultiplierSchema = z.object({
  DEFAULT: z
    .number({ error: 'Default fare multiplier must be a number' })
    .positive('Default fare multiplier must be greater than 0'),
  ...optionalSeatTypes,
});

export const createTripSchema = z.object({
  orgId: z.uuid('Invalid organization ID').optional(),

  routeId: z.uuid('Invalid route ID'),

  conductorId: z.uuid('Invalid conductor ID'),

  busId: z.uuid('Invalid bus ID'),

  driverName: z
    .string({
      error: 'Driver name is required',
    })
    .trim()
    .min(3, 'Driver name must be at least 3 characters')
    .max(100, 'Driver name must not exceed 100 characters'),

  driverLicense: z
    .string({
      error: 'Driver license is required',
    })
    .trim()
    .min(3, 'Driver license must be at least 3 characters')
    .max(50, 'Driver license must not exceed 50 characters'),

  departureTime: z.coerce
    .date({
      error: 'Invalid departure time',
    })
    .refine((date) => date.getTime() > Date.now(), {
      message: 'Departure time must be in the future',
    }),

  baseFare: z
    .number({
      error: 'Base fare must be a number',
    })
    .positive('Base fare must be greater than 0'),

  fareMultipliers: fareMultiplierSchema,
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
