import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('8080'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MODEL_VERSION: z.string().default('v2.4-onnx-resnet50'),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MODEL_VERSION: process.env.MODEL_VERSION,
});
