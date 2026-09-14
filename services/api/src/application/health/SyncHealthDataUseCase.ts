import {
  HealthSample,
  HealthSyncBatchTooLargeError,
  type HealthDataProvider,
  type HealthMetricType,
} from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthSyncResult,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';

export interface HealthSampleInput {
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

export interface SyncHealthDataInput {
  provider: HealthDataProvider;
  samples: readonly HealthSampleInput[];
  deletedExternalIds: readonly string[];
  requestedMetrics: readonly HealthMetricType[];
}

export class SyncHealthDataUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(userId: string, input: SyncHealthDataInput): Promise<HealthSyncResult> {
    if (input.samples.length > 1000 || input.deletedExternalIds.length > 1000) {
      throw new HealthSyncBatchTooLargeError();
    }

    const samples = input.samples.map(
      (sample) =>
        new HealthSample({
          externalId: sample.externalId,
          metricType: sample.metricType,
          value: sample.value,
          unit: sample.unit,
          startAt: new Date(sample.startAt),
          endAt: new Date(sample.endAt),
          sourceName: sample.sourceName,
          sourceBundleId: sample.sourceBundleId,
          deviceName: sample.deviceName,
        }),
    );

    const deletedExternalIds = [...new Set(input.deletedExternalIds.map((id) => id.trim()).filter(Boolean))];
    const requestedMetrics = [...new Set(input.requestedMetrics)];

    return this.healthRepository.sync(
      userId,
      input.provider,
      samples,
      deletedExternalIds,
      requestedMetrics,
    );
  }
}
