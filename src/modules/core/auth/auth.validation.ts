import { z } from 'zod';

export const registerUserSchema = z
  .object({
    firstName: z
      .string({ message: 'First name is required' })
      .min(3, 'First name must be at least 3 characters long'),
    lastName: z
      .string({ message: 'Last name is required' })
      .min(3, 'Last name must be at least 3 characters long'),
    email: z.string({ message: 'Email is required' }).email('Invalid email address format'),
    password: z
      .string({ message: 'Password is required' })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        'Password must include uppercase, lowercase, number, special character and be at least 8 characters long',
      ),
  })
  .strict();

export const loginUserSchema = registerUserSchema.omit({ firstName: true, lastName: true });

export const verifyEmailSchema = z
  .object({
    token: z.string({ message: 'Verification token is required' }),
  })
  .strict();

export const resendEmailSchema = z
  .object({
    email: z.email('Invalid email address format'),
  })
  .strict();

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ResendUserEmailInput = z.infer<typeof resendEmailSchema>;
