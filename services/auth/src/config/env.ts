import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().default('medivo-production-jwt-secret-key-2026'),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
});
