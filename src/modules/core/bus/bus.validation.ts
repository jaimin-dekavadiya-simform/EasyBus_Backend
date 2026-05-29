import { BusClasses } from '@/generated/prisma/enums';
import z from 'zod';

export const CreateBusSchema = z.object({
  orgId: z.uuid({ message: 'Invalid Organization ID format' }).optional(),
  layoutId: z.uuid({ message: 'Invalid Layout ID format' }),
  label: z.string({ message: 'Label is required' }),
  registrationNumber: z
    .string({ message: 'Registration number is required' })
    .regex(
      /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/,
      'Enter a valid vehicle registration number (e.g. GJ05AB1234)',
    ),
  busClass: z.enum(BusClasses, 'Invalid bus class selected'),
});

export type CreateBusInput = z.infer<typeof CreateBusSchema>;
