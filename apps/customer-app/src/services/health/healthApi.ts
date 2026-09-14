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
export type HealthSummaryPeriod = 'day' | 'week' | 'month';
export type HealthMetricAggregation = 'latest' | 'sum' | 'duration';

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
  hasImportedData: boolean;
}

export interface HealthMetricSummaryItem {
  metricType: HealthMetricType;
  value: number;
  unit: string;
  aggregation: HealthMetricAggregation;
  sampleCount: number;
  recordedAt: string | null;
  sourceName?: string;
  deviceName?: string;
}

export interface HealthSummary {
  provider: 'apple_health';
  period: HealthSummaryPeriod;
  from: string;
  to: string;
  metrics: HealthMetricSummaryItem[];
}

export interface HealthDisconnectResponse {
  disconnected: boolean;
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

  const rawBody = await response.text();
  let body: ApiEnvelope<T>;

  try {
    body = rawBody
      ? (JSON.parse(rawBody) as ApiEnvelope<T>)
      : ({ success: response.ok } as ApiEnvelope<T>);
  } catch {
    throw new Error(`Health API returned an unexpected response (${response.status}).`);
  }

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

  getAppleHealthSummary(period: HealthSummaryPeriod = 'day'): Promise<HealthSummary> {
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const query = new URLSearchParams({
      period,
      timezoneOffsetMinutes: String(timezoneOffsetMinutes),
    });
    return request<HealthSummary>(`/api/mobile-bff/health/summary?${query.toString()}`);
  },

  disconnectAppleHealth(): Promise<HealthDisconnectResponse> {
    return request<HealthDisconnectResponse>('/api/mobile-bff/health/connection', {
      method: 'DELETE',
    });
  },
};
