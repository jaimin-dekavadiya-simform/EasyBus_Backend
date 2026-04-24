import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z
      .string()
      .length(64, 'Invalid token length')
      .regex(/^[0-9a-fA-F]+$/, 'Invalid hex token'),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
