import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z
    .string()
    .default('3000')
    .transform((val) => {
      const parsed = Number(val);
      if (Number.isNaN(parsed)) throw new Error('PORT must be a number');
      return parsed;
    }),
  DATABASE_URL: z.url(),

  ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),
  ACCESS_TOKEN_EXPIRY: z.string().default('1d'),

  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

  VERIFICATION_TOKEN_SECRET: z.string().min(1, 'VERIFICATION_TOKEN_SECRET is required'),
  VERIFICATION_TOKEN_EXPIRY: z.string().default('5m'),
  VERIFICATION_BASE_URL: z.url(),

  EMAIL_USER: z.email(),
  EMAIL_PASSWORD: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

export const config = {
  app: {
    env: env.NODE_ENV,
    port: env.PORT,
  },

  jwt: {
    access: {
      secret: env.ACCESS_TOKEN_SECRET,
      expiry: env.ACCESS_TOKEN_EXPIRY,
    },
    refresh: {
      secret: env.REFRESH_TOKEN_SECRET,
      expiry: env.REFRESH_TOKEN_EXPIRY,
    },
    verification: {
      secret: env.VERIFICATION_TOKEN_SECRET,
      expiry: env.VERIFICATION_TOKEN_EXPIRY,
      baseUrl: env.VERIFICATION_BASE_URL,
    },
  },
  db: {
    url: env.DATABASE_URL,
  },
  email: {
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
  },
} as const;
