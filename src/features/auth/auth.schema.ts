import { z } from 'zod';

export const registerUserSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
    ),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
