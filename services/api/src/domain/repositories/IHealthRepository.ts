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
}

export interface HealthSyncResult {
  processedSamples: number;
  deletedSamples: number;
  lastSyncedAt: Date;
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
}
