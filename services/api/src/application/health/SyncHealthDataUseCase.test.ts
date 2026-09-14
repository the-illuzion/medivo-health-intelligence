import { describe, expect, it } from 'vitest';
import type { HealthSample } from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthConnection,
  HealthSyncResult,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';
import type { HealthDataProvider, HealthMetricType } from '../../domain/health/HealthSampleEntity.js';
import { SyncHealthDataUseCase } from './SyncHealthDataUseCase.js';

class RecordingHealthRepository implements IHealthRepository {
  public userId: string | null = null;
  public samples: readonly HealthSample[] = [];
  public deletedExternalIds: readonly string[] = [];

  async sync(
    userId: string,
    _provider: HealthDataProvider,
    samples: readonly HealthSample[],
    deletedExternalIds: readonly string[],
    _requestedMetrics: readonly HealthMetricType[],
  ): Promise<HealthSyncResult> {
    this.userId = userId;
    this.samples = samples;
    this.deletedExternalIds = deletedExternalIds;
    return {
      processedSamples: samples.length,
      deletedSamples: deletedExternalIds.length,
      lastSyncedAt: new Date('2026-09-14T10:00:00.000Z'),
    };
  }

  async findConnection(): Promise<HealthConnection | null> {
    return null;
  }
}

describe('SyncHealthDataUseCase', () => {
  it('derives ownership from the authenticated user argument and de-duplicates deletions', async () => {
    const repository = new RecordingHealthRepository();
    const useCase = new SyncHealthDataUseCase(repository);

    const result = await useCase.execute('user-a', {
      provider: 'apple_health',
      samples: [
        {
          externalId: 'sample-1',
          metricType: 'resting_heart_rate',
          value: 61,
          unit: 'count/min',
          startAt: '2026-09-14T08:00:00.000Z',
          endAt: '2026-09-14T08:00:30.000Z',
        },
      ],
      deletedExternalIds: ['old-sample', 'old-sample'],
      requestedMetrics: ['resting_heart_rate'],
    });

    expect(repository.userId).toBe('user-a');
    expect(repository.samples).toHaveLength(1);
    expect(repository.deletedExternalIds).toEqual(['old-sample']);
    expect(result.processedSamples).toBe(1);
  });
});
