import { apiClient } from '@medivo/api-client';

export const HEALTH_METRIC_TYPES = [
  'step_count',
  'heart_rate',
  'resting_heart_rate',
  'active_energy_burned',
  'sleep_analysis',
  'heart_rate_variability_sdnn',
] as const;

export type HealthMetricType = (typeof HEALTH_METRIC_TYPES)[number];

export interface HealthSyncSample {
  externalId: string;
  metricType: HealthMetricType;
  value: number;
  unit: string;
  startAt: string;
  endAt: string;
  sourceName?: string;
  sourceBundleId?: string;
  deviceName?: string;
}

export interface HealthSyncPayload {
  provider: 'apple_health';
  samples: HealthSyncSample[];
  deletedExternalIds: string[];
  requestedMetrics: HealthMetricType[];
}

export interface HealthSyncResponse {
  processedSamples: number;
  deletedSamples: number;
  lastSyncedAt: string;
}

export interface HealthConnection {
  provider: 'apple_health';
  status: 'connected';
  requestedMetrics: HealthMetricType[];
  connectedAt: string;
  lastSyncedAt: string | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = apiClient.getAuthToken();
  if (!token) {
    throw new Error('Please sign in before connecting Apple Health.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(init?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${apiClient.getBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error || 'Unable to sync Apple Health data.');
  }

  return body.data as T;
}

export const healthApi = {
  syncAppleHealth(payload: HealthSyncPayload): Promise<HealthSyncResponse> {
    return request<HealthSyncResponse>('/api/mobile-bff/health/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAppleHealthConnection(): Promise<HealthConnection | null> {
    return request<HealthConnection | null>('/api/mobile-bff/health/connection');
  },
};
