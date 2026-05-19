import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
    ),
});

export const loginUserSchema = registerUserSchema.omit({ firstName: true, lastName: true });

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const resendEmailSchema = z.object({
  email: z.email(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ResendUserEmailInput = z.infer<typeof resendEmailSchema>;
