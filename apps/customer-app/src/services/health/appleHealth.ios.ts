import HealthKit, {
  HKCategoryTypeIdentifier,
  HKQuantityTypeIdentifier,
  type HKCategorySample,
  type HKQuantitySample,
} from '@kingstinct/react-native-healthkit';
import { storageAdapter } from '../../platform/storage';
import {
  HEALTH_METRIC_TYPES,
  healthApi,
  type HealthMetricType,
  type HealthSyncSample,
} from './healthApi';
import type { AppleHealthSyncResult } from './appleHealth';

const PAGE_SIZE = 1000;
const INITIAL_LOOKBACK_DAYS = 30;
const ANCHOR_KEY_PREFIX = 'medivo.apple-health.anchors.v1';

type AnchorState = Partial<Record<HealthMetricType, string>>;

interface QuantityDefinition {
  metricType: HealthMetricType;
  identifier: HKQuantityTypeIdentifier;
}

const QUANTITY_DEFINITIONS: readonly QuantityDefinition[] = [
  { metricType: 'step_count', identifier: HKQuantityTypeIdentifier.stepCount },
  { metricType: 'heart_rate', identifier: HKQuantityTypeIdentifier.heartRate },
  { metricType: 'resting_heart_rate', identifier: HKQuantityTypeIdentifier.restingHeartRate },
  { metricType: 'active_energy_burned', identifier: HKQuantityTypeIdentifier.activeEnergyBurned },
  {
    metricType: 'heart_rate_variability_sdnn',
    identifier: HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  },
];

function anchorStorageKey(userId: string): string {
  return `${ANCHOR_KEY_PREFIX}.${userId}`;
}

async function readAnchors(userId: string): Promise<AnchorState> {
  const raw = await storageAdapter.getItem(anchorStorageKey(userId));
  if (!raw) return {};

  try {
    return JSON.parse(raw) as AnchorState;
  } catch {
    return {};
  }
}

async function writeAnchors(userId: string, anchors: AnchorState): Promise<void> {
  await storageAdapter.setItem(anchorStorageKey(userId), JSON.stringify(anchors));
}

function initialFromDate(): Date {
  const from = new Date();
  from.setDate(from.getDate() - INITIAL_LOOKBACK_DAYS);
  return from;
}

function mapQuantitySample(
  metricType: HealthMetricType,
  sample: HKQuantitySample,
): HealthSyncSample {
  return {
    externalId: sample.uuid,
    metricType,
    value: sample.quantity,
    unit: sample.unit,
    startAt: sample.startDate.toISOString(),
    endAt: sample.endDate.toISOString(),
    sourceName: sample.sourceRevision?.source.name,
    sourceBundleId: sample.sourceRevision?.source.bundleIdentifier,
    deviceName: sample.device?.name,
  };
}

function mapSleepSample(sample: HKCategorySample): HealthSyncSample {
  return {
    externalId: sample.uuid,
    metricType: 'sleep_analysis',
    value: Number(sample.value),
    unit: 'category',
    startAt: sample.startDate.toISOString(),
    endAt: sample.endDate.toISOString(),
    sourceName: sample.sourceRevision?.source.name,
    sourceBundleId: sample.sourceRevision?.source.bundleIdentifier,
    deviceName: sample.device?.name,
  };
}

async function syncQuantityMetric(
  userId: string,
  anchors: AnchorState,
  definition: QuantityDefinition,
): Promise<{ synced: number; deleted: number; lastSyncedAt: string | null }> {
  let anchor = anchors[definition.metricType];
  let from = anchor ? undefined : initialFromDate();
  let synced = 0;
  let deleted = 0;
  let lastSyncedAt: string | null = null;

  while (true) {
    const result = await HealthKit.queryQuantitySamplesWithAnchor(definition.identifier, {
      anchor,
      from,
      limit: PAGE_SIZE,
    });

    const response = await healthApi.syncAppleHealth({
      provider: 'apple_health',
      samples: result.samples.map((sample) => mapQuantitySample(definition.metricType, sample)),
      deletedExternalIds: result.deletedSamples.map((sample) => sample.uuid),
      requestedMetrics: [...HEALTH_METRIC_TYPES],
    });

    synced += response.processedSamples;
    deleted += response.deletedSamples;
    lastSyncedAt = response.lastSyncedAt;
    anchor = result.newAnchor;
    from = undefined;
    anchors[definition.metricType] = result.newAnchor;
    await writeAnchors(userId, anchors);

    if (result.samples.length + result.deletedSamples.length < PAGE_SIZE) break;
  }

  return { synced, deleted, lastSyncedAt };
}

async function syncSleepMetric(
  userId: string,
  anchors: AnchorState,
): Promise<{ synced: number; deleted: number; lastSyncedAt: string | null }> {
  const metricType: HealthMetricType = 'sleep_analysis';
  let anchor = anchors[metricType];
  let from = anchor ? undefined : initialFromDate();
  let synced = 0;
  let deleted = 0;
  let lastSyncedAt: string | null = null;

  while (true) {
    const result = await HealthKit.queryCategorySamplesWithAnchor(
      HKCategoryTypeIdentifier.sleepAnalysis,
      { anchor, from, limit: PAGE_SIZE },
    );

    const response = await healthApi.syncAppleHealth({
      provider: 'apple_health',
      samples: result.samples.map(mapSleepSample),
      deletedExternalIds: result.deletedSamples.map((sample) => sample.uuid),
      requestedMetrics: [...HEALTH_METRIC_TYPES],
    });

    synced += response.processedSamples;
    deleted += response.deletedSamples;
    lastSyncedAt = response.lastSyncedAt;
    anchor = result.newAnchor;
    from = undefined;
    anchors[metricType] = result.newAnchor;
    await writeAnchors(userId, anchors);

    if (result.samples.length + result.deletedSamples.length < PAGE_SIZE) break;
  }

  return { synced, deleted, lastSyncedAt };
}

export const appleHealthService = {
  async isAvailable(): Promise<boolean> {
    return HealthKit.isHealthDataAvailable();
  },

  async connectAndSync(userId: string): Promise<AppleHealthSyncResult> {
    const available = await HealthKit.isHealthDataAvailable();
    if (!available) {
      return {
        available: false,
        syncedSamples: 0,
        deletedSamples: 0,
        lastSyncedAt: null,
      };
    }

    await HealthKit.requestAuthorization([
      HKQuantityTypeIdentifier.stepCount,
      HKQuantityTypeIdentifier.heartRate,
      HKQuantityTypeIdentifier.restingHeartRate,
      HKQuantityTypeIdentifier.activeEnergyBurned,
      HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
      HKCategoryTypeIdentifier.sleepAnalysis,
    ]);

    const anchors = await readAnchors(userId);
    let syncedSamples = 0;
    let deletedSamples = 0;
    let lastSyncedAt: string | null = null;

    for (const definition of QUANTITY_DEFINITIONS) {
      const result = await syncQuantityMetric(userId, anchors, definition);
      syncedSamples += result.synced;
      deletedSamples += result.deleted;
      lastSyncedAt = result.lastSyncedAt ?? lastSyncedAt;
    }

    const sleepResult = await syncSleepMetric(userId, anchors);
    syncedSamples += sleepResult.synced;
    deletedSamples += sleepResult.deleted;
    lastSyncedAt = sleepResult.lastSyncedAt ?? lastSyncedAt;

    return {
      available: true,
      syncedSamples,
      deletedSamples,
      lastSyncedAt,
    };
  },
};
