import { UserRoles } from '@/modules/core/user/user.types';
import z from 'zod';

export const createUserSchema = z.object({
  email: z.email('Invalid email'),
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters'),
  role: z.enum(UserRoles, 'Invalid User Role'),
  orgId: z.uuid('Invalid Organization Id'),
  employeeCode: z
    .string('Employee Code is required')
    .min(3, 'Employee code must be at least 3 characters'),
  password: z
    .string('Password is required')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
