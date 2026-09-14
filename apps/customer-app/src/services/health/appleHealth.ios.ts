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
const ANCHOR_CHUNK_SIZE = 1800;

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

const READ_AUTHORIZATIONS = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.restingHeartRate,
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  HKCategoryTypeIdentifier.sleepAnalysis,
] as const;

function unavailableResult(): AppleHealthSyncResult {
  return {
    available: false,
    syncedSamples: 0,
    deletedSamples: 0,
    lastSyncedAt: null,
  };
}

function legacyAnchorStorageKey(userId: string): string {
  return `${ANCHOR_KEY_PREFIX}.${userId}`;
}

function metricAnchorStorageKey(userId: string, metricType: HealthMetricType): string {
  return `${ANCHOR_KEY_PREFIX}.${userId}.${metricType}`;
}

async function readMetricAnchor(
  userId: string,
  metricType: HealthMetricType,
): Promise<string | undefined> {
  const baseKey = metricAnchorStorageKey(userId, metricType);
  const partCountRaw = await storageAdapter.getItem(`${baseKey}.parts`);
  const partCount = partCountRaw ? Number.parseInt(partCountRaw, 10) : 0;

  if (Number.isFinite(partCount) && partCount > 0) {
    const parts = await Promise.all(
      Array.from({ length: partCount }, (_, index) => storageAdapter.getItem(`${baseKey}.${index}`)),
    );

    if (parts.every((part): part is string => typeof part === 'string')) {
      return parts.join('');
    }
  }

  const directValue = await storageAdapter.getItem(baseKey);
  return directValue ?? undefined;
}

async function removeMetricAnchor(userId: string, metricType: HealthMetricType): Promise<void> {
  const baseKey = metricAnchorStorageKey(userId, metricType);
  const partCountRaw = await storageAdapter.getItem(`${baseKey}.parts`);
  const partCount = partCountRaw ? Number.parseInt(partCountRaw, 10) : 0;

  if (Number.isFinite(partCount) && partCount > 0) {
    await Promise.all(
      Array.from({ length: partCount }, (_, index) => storageAdapter.removeItem(`${baseKey}.${index}`)),
    );
  }

  await Promise.all([
    storageAdapter.removeItem(`${baseKey}.parts`),
    storageAdapter.removeItem(baseKey),
  ]);
}

async function writeMetricAnchor(
  userId: string,
  metricType: HealthMetricType,
  anchor: string,
): Promise<void> {
  const baseKey = metricAnchorStorageKey(userId, metricType);
  const previousPartCountRaw = await storageAdapter.getItem(`${baseKey}.parts`);
  const previousPartCount = previousPartCountRaw
    ? Number.parseInt(previousPartCountRaw, 10)
    : 0;

  if (Number.isFinite(previousPartCount) && previousPartCount > 0) {
    await Promise.all(
      Array.from({ length: previousPartCount }, (_, index) =>
        storageAdapter.removeItem(`${baseKey}.${index}`),
      ),
    );
  }

  const chunks = Array.from(
    { length: Math.max(1, Math.ceil(anchor.length / ANCHOR_CHUNK_SIZE)) },
    (_, index) => anchor.slice(index * ANCHOR_CHUNK_SIZE, (index + 1) * ANCHOR_CHUNK_SIZE),
  );

  await Promise.all(
    chunks.map((chunk, index) => storageAdapter.setItem(`${baseKey}.${index}`, chunk)),
  );
  await storageAdapter.setItem(`${baseKey}.parts`, String(chunks.length));
  await storageAdapter.removeItem(baseKey);
}

async function readAnchors(userId: string): Promise<AnchorState> {
  const anchors: AnchorState = {};

  // Read the old combined value only as a migration fallback. New writes are chunked per metric
  // so no single SecureStore value grows beyond the practical iOS size limit.
  const legacyRaw = await storageAdapter.getItem(legacyAnchorStorageKey(userId));
  if (legacyRaw) {
    try {
      Object.assign(anchors, JSON.parse(legacyRaw) as AnchorState);
    } catch {
      // Ignore malformed legacy sync state and start fresh for missing metrics.
    }
  }

  await Promise.all(
    HEALTH_METRIC_TYPES.map(async (metricType) => {
      const anchor = await readMetricAnchor(userId, metricType);
      if (anchor) anchors[metricType] = anchor;
    }),
  );

  return anchors;
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
    await writeMetricAnchor(userId, definition.metricType, result.newAnchor);

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
    await writeMetricAnchor(userId, metricType, result.newAnchor);

    if (result.samples.length + result.deletedSamples.length < PAGE_SIZE) break;
  }

  return { synced, deleted, lastSyncedAt };
}

async function performSync(userId: string): Promise<AppleHealthSyncResult> {
  const available = await HealthKit.isHealthDataAvailable();
  if (!available) return unavailableResult();

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
}

export const appleHealthService = {
  async isAvailable(): Promise<boolean> {
    return HealthKit.isHealthDataAvailable();
  },

  async resetSyncState(userId: string): Promise<void> {
    await Promise.all([
      storageAdapter.removeItem(legacyAnchorStorageKey(userId)),
      ...HEALTH_METRIC_TYPES.map((metricType) => removeMetricAnchor(userId, metricType)),
    ]);
  },

  // Silent incremental sync for an already-connected account. This never requests authorization.
  async sync(userId: string): Promise<AppleHealthSyncResult> {
    return performSync(userId);
  },

  // Explicit user action only: request HealthKit read authorization, then perform the initial sync.
  async connectAndSync(userId: string): Promise<AppleHealthSyncResult> {
    const available = await HealthKit.isHealthDataAvailable();
    if (!available) return unavailableResult();

    await HealthKit.requestAuthorization([...READ_AUTHORIZATIONS]);
    return performSync(userId);
  },
};
