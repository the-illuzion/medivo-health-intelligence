import type { HealthDataProvider } from '../../domain/health/HealthSampleEntity.js';
import type {
  HealthSummary,
  HealthSummaryPeriod,
  IHealthRepository,
} from '../../domain/repositories/IHealthRepository.js';

const MAX_TIMEZONE_OFFSET_MINUTES = 14 * 60;

function startOfPeriod(
  period: HealthSummaryPeriod,
  timezoneOffsetMinutes: number,
  now: Date,
): Date {
  const shifted = new Date(now.getTime() - timezoneOffsetMinutes * 60_000);

  shifted.setUTCHours(0, 0, 0, 0);

  if (period === 'week') {
    shifted.setUTCDate(shifted.getUTCDate() - 6);
  } else if (period === 'month') {
    shifted.setUTCDate(1);
  }

  return new Date(shifted.getTime() + timezoneOffsetMinutes * 60_000);
}

export class GetHealthSummaryUseCase {
  constructor(private readonly healthRepository: IHealthRepository) {}

  async execute(
    userId: string,
    provider: HealthDataProvider,
    period: HealthSummaryPeriod,
    timezoneOffsetMinutes = 0,
  ): Promise<HealthSummary> {
    if (
      !Number.isFinite(timezoneOffsetMinutes) ||
      Math.abs(timezoneOffsetMinutes) > MAX_TIMEZONE_OFFSET_MINUTES
    ) {
      throw new Error('Invalid timezone offset.');
    }

    const now = new Date();
    const from = startOfPeriod(period, timezoneOffsetMinutes, now);

    return this.healthRepository.getSummary(userId, provider, period, from, now);
  }
}
