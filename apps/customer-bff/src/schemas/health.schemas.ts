import { z } from 'zod';
import { HEALTH_METRIC_TYPES } from '@medivo/service-api';

export const healthMetricTypeSchema = z.enum(HEALTH_METRIC_TYPES);

export const healthSampleSchema = z
  .object({
    externalId: z.string().trim().min(1).max(255),
    metricType: healthMetricTypeSchema,
    value: z.number().finite(),
    unit: z.string().trim().min(1).max(50),
    startAt: z.string().datetime({ offset: true }),
    endAt: z.string().datetime({ offset: true }),
    sourceName: z.string().trim().min(1).max(255).optional(),
    sourceBundleId: z.string().trim().min(1).max(255).optional(),
    deviceName: z.string().trim().min(1).max(255).optional(),
  })
  .strict();

export const healthSyncSchema = z
  .object({
    provider: z.literal('apple_health'),
    samples: z.array(healthSampleSchema).max(1000),
    deletedExternalIds: z.array(z.string().trim().min(1).max(255)).max(1000).default([]),
    requestedMetrics: z.array(healthMetricTypeSchema).min(1).max(20),
  })
  .strict();

export type HealthSyncRequest = z.infer<typeof healthSyncSchema>;
