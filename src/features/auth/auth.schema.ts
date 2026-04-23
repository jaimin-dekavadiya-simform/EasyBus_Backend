import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(10),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
