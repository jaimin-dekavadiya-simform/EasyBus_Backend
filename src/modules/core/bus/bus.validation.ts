import { BusClasses } from '@/generated/prisma/enums';
import z from 'zod';

export const CreateBusSchema = z.object({
  orgId: z.uuid().optional(),
  layoutId: z.uuid(),
  registrationNumber: z
    .string()
    .regex(
      /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/,
      'Enter a valid vehicle registration number (e.g. GJ05AB1234)',
    ),
  busClass: z.enum(BusClasses),
});

export type CreateBusInput = z.infer<typeof CreateBusSchema>;
