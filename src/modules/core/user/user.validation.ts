import { UserRoles } from '@/types/user.types';
import z from 'zod';

export const createUserSchema = z.object({
  email: z.email('Invalid email'),
  firstName: z.string().min(3, 'First name should be greater than 2 characters'),
  lastName: z.string().min(3, 'Last name should be greater than 2 characters'),
  role: z.enum(UserRoles),
  orgId: z.uuid(),
  employeeCode: z.string().min(1),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
