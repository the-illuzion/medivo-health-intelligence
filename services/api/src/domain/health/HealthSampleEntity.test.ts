import { describe, expect, it } from 'vitest';
import { HealthSample, InvalidHealthSampleError } from './HealthSampleEntity.js';

describe('HealthSample', () => {
  it('creates a valid health sample', () => {
    const sample = new HealthSample({
      externalId: 'sample-1',
      metricType: 'heart_rate',
      value: 72,
      unit: 'count/min',
      startAt: new Date('2026-09-14T08:00:00.000Z'),
      endAt: new Date('2026-09-14T08:01:00.000Z'),
      sourceName: 'Apple Watch',
    });

    expect(sample.externalId).toBe('sample-1');
    expect(sample.value).toBe(72);
  });

  it('rejects inverted sample intervals', () => {
    expect(
      () =>
        new HealthSample({
          externalId: 'sample-2',
          metricType: 'step_count',
          value: 10,
          unit: 'count',
          startAt: new Date('2026-09-14T09:00:00.000Z'),
          endAt: new Date('2026-09-14T08:00:00.000Z'),
        }),
    ).toThrow(InvalidHealthSampleError);
  });
});
