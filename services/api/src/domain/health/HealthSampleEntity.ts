export const HEALTH_DATA_PROVIDERS = ['apple_health', 'health_connect'] as const;
export type HealthDataProvider = (typeof HEALTH_DATA_PROVIDERS)[number];

export const HEALTH_METRIC_TYPES = [
  'step_count',
  'heart_rate',
  'resting_heart_rate',
  'active_energy_burned',
  'sleep_analysis',
  'heart_rate_variability_sdnn',
] as const;
export type HealthMetricType = (typeof HEALTH_METRIC_TYPES)[number];

export interface HealthSampleProps {
  externalId: string;
  metricType: HealthMetricType;
  value: number;
  unit: string;
  startAt: Date;
  endAt: Date;
  sourceName?: string;
  sourceBundleId?: string;
  deviceName?: string;
}

export class InvalidHealthSampleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidHealthSampleError';
  }
}

export class HealthSyncBatchTooLargeError extends Error {
  constructor() {
    super('Health sync batches may contain at most 1000 samples and 1000 deletions.');
    this.name = 'HealthSyncBatchTooLargeError';
  }
}

export class HealthSample {
  public readonly externalId: string;
  public readonly metricType: HealthMetricType;
  public readonly value: number;
  public readonly unit: string;
  public readonly startAt: Date;
  public readonly endAt: Date;
  public readonly sourceName?: string;
  public readonly sourceBundleId?: string;
  public readonly deviceName?: string;

  constructor(props: HealthSampleProps) {
    const externalId = props.externalId.trim();
    const unit = props.unit.trim();

    if (!externalId) {
      throw new InvalidHealthSampleError('Health sample externalId is required.');
    }
    if (!Number.isFinite(props.value)) {
      throw new InvalidHealthSampleError('Health sample value must be finite.');
    }
    if (!unit) {
      throw new InvalidHealthSampleError('Health sample unit is required.');
    }
    if (Number.isNaN(props.startAt.getTime()) || Number.isNaN(props.endAt.getTime())) {
      throw new InvalidHealthSampleError('Health sample timestamps must be valid dates.');
    }
    if (props.endAt.getTime() < props.startAt.getTime()) {
      throw new InvalidHealthSampleError('Health sample endAt cannot be before startAt.');
    }

    this.externalId = externalId;
    this.metricType = props.metricType;
    this.value = props.value;
    this.unit = unit;
    this.startAt = props.startAt;
    this.endAt = props.endAt;
    this.sourceName = props.sourceName?.trim() || undefined;
    this.sourceBundleId = props.sourceBundleId?.trim() || undefined;
    this.deviceName = props.deviceName?.trim() || undefined;
  }
}
