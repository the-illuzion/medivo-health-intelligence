import type {
  HealthDataProvider,
  HealthMetricType,
  HealthSample,
} from '../health/HealthSampleEntity.js';

export interface HealthConnection {
  provider: HealthDataProvider;
  status: 'connected';
  requestedMetrics: HealthMetricType[];
  connectedAt: Date;
  lastSyncedAt: Date | null;
  hasImportedData: boolean;
}

export interface HealthSyncResult {
  processedSamples: number;
  deletedSamples: number;
  lastSyncedAt: Date;
}

export type HealthSummaryPeriod = 'day' | 'week' | 'month';
export type HealthMetricAggregation = 'latest' | 'sum' | 'duration';

export interface HealthMetricSummaryItem {
  metricType: HealthMetricType;
  value: number;
  unit: string;
  aggregation: HealthMetricAggregation;
  sampleCount: number;
  recordedAt: Date | null;
  sourceName?: string;
  deviceName?: string;
}

export interface HealthSummary {
  provider: HealthDataProvider;
  period: HealthSummaryPeriod;
  from: Date;
  to: Date;
  metrics: HealthMetricSummaryItem[];
}

export interface IHealthRepository {
  sync(
    userId: string,
    provider: HealthDataProvider,
    samples: readonly HealthSample[],
    deletedExternalIds: readonly string[],
    requestedMetrics: readonly HealthMetricType[],
  ): Promise<HealthSyncResult>;

  disconnect(userId: string, provider: HealthDataProvider): Promise<void>;

  findConnection(
    userId: string,
    provider: HealthDataProvider,
  ): Promise<HealthConnection | null>;

  getSummary(
    userId: string,
    provider: HealthDataProvider,
    period: HealthSummaryPeriod,
    from: Date,
    to: Date,
  ): Promise<HealthSummary>;
}
