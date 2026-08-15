import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MODEL_VERSION: z.string().default('v2.4-onnx-resnet50'),

  // AI Provider Credentials (Configured via Environment Variables ONLY)
  PERFECT_CORP_API_KEY: z.string().optional(),
  PERFECT_CORP_SECRET_KEY: z.string().optional(),
  PERFECT_CORP_ENDPOINT: z.string().default('https://api.perfectcorp.com/v1/skin/analyze'),

  SHEN_API_KEY: z.string().optional(),
  SHEN_CLIENT_SECRET: z.string().optional(),
  SHEN_ENDPOINT: z.string().default('https://api.shen.ai/v1/health/scan'),

  AI_PROVIDER_DEFAULT: z.enum(['AUTO', 'PERFECT_CORP', 'SHEN', 'SIMULATED']).default('AUTO'),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MODEL_VERSION: process.env.MODEL_VERSION,
  PERFECT_CORP_API_KEY: process.env.PERFECT_CORP_API_KEY,
  PERFECT_CORP_SECRET_KEY: process.env.PERFECT_CORP_SECRET_KEY,
  PERFECT_CORP_ENDPOINT: process.env.PERFECT_CORP_ENDPOINT,
  SHEN_API_KEY: process.env.SHEN_API_KEY,
  SHEN_CLIENT_SECRET: process.env.SHEN_CLIENT_SECRET,
  SHEN_ENDPOINT: process.env.SHEN_ENDPOINT,
  AI_PROVIDER_DEFAULT: process.env.AI_PROVIDER_DEFAULT,
});
