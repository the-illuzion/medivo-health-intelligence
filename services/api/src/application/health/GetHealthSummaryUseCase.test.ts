import { describe, expect, it, vi } from 'vitest';
import type { HealthSample } from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthConnection,
  HealthSummary,
  HealthSummaryPeriod,
  HealthSyncResult,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';
import type { HealthDataProvider, HealthMetricType } from '../../domain/health/HealthSampleEntity.js';
import { GetHealthSummaryUseCase } from './GetHealthSummaryUseCase.js';

class RecordingHealthRepository implements IHealthRepository {
  public from: Date | null = null;
  public to: Date | null = null;
  public period: HealthSummaryPeriod | null = null;

  async sync(
    _userId: string,
    _provider: HealthDataProvider,
    _samples: readonly HealthSample[],
    _deletedExternalIds: readonly string[],
    _requestedMetrics: readonly HealthMetricType[],
  ): Promise<HealthSyncResult> {
    return { processedSamples: 0, deletedSamples: 0, lastSyncedAt: new Date() };
  }

  async disconnect(_userId: string, _provider: HealthDataProvider): Promise<void> {
    return;
  }

  async findConnection(): Promise<HealthConnection | null> {
    return null;
  }

  async getSummary(
    _userId: string,
    provider: HealthDataProvider,
    period: HealthSummaryPeriod,
    from: Date,
    to: Date,
  ): Promise<HealthSummary> {
    this.period = period;
    this.from = from;
    this.to = to;
    return { provider, period, from, to, metrics: [] };
  }
}

describe('GetHealthSummaryUseCase', () => {
  it('uses the device-local start of day represented by the timezone offset', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-14T10:30:00.000Z'));

    try {
      const repository = new RecordingHealthRepository();
      const useCase = new GetHealthSummaryUseCase(repository);

      await useCase.execute('user-a', 'apple_health', 'day', -330);

      expect(repository.period).toBe('day');
      expect(repository.from?.toISOString()).toBe('2026-09-13T18:30:00.000Z');
      expect(repository.to?.toISOString()).toBe('2026-09-14T10:30:00.000Z');
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects timezone offsets outside the supported range', async () => {
    const repository = new RecordingHealthRepository();
    const useCase = new GetHealthSummaryUseCase(repository);

    await expect(useCase.execute('user-a', 'apple_health', 'day', 15 * 60)).rejects.toThrow(
      'Invalid timezone offset.',
    );
  });
});
