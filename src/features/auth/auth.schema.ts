import { z } from 'zod';

export const registerUserSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
    ),
});

export const loginUserSchema = registerUserSchema.omit({ first_name: true, last_name: true });

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
