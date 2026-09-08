import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().default('medivo-default-jwt-secret-key-2026'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  AI_SERVICE_URL: z.string().default('http://service-ai:8080'),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://service-ai:8080',
});
