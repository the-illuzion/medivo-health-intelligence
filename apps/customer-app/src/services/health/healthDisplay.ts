import type {
  HealthMetricSummaryItem,
  HealthMetricType,
  HealthSummaryPeriod,
} from './healthApi';

export type HealthMetricTone = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface HealthMetricDisplayDefinition {
  type: HealthMetricType;
  name: string;
  shortName: string;
  icon: string;
  tone: HealthMetricTone;
}

export const HEALTH_METRIC_DISPLAY: readonly HealthMetricDisplayDefinition[] = [
  { type: 'heart_rate', name: 'Heart Rate', shortName: 'Heart Rate', icon: 'heart', tone: 'red' },
  {
    type: 'resting_heart_rate',
    name: 'Resting Heart Rate',
    shortName: 'Resting HR',
    icon: 'heartpulse',
    tone: 'orange',
  },
  { type: 'step_count', name: 'Steps', shortName: 'Steps', icon: 'activity', tone: 'green' },
  {
    type: 'active_energy_burned',
    name: 'Active Energy',
    shortName: 'Active Energy',
    icon: 'activity',
    tone: 'blue',
  },
  { type: 'sleep_analysis', name: 'Sleep', shortName: 'Sleep', icon: 'moon', tone: 'purple' },
  {
    type: 'heart_rate_variability_sdnn',
    name: 'Heart Rate Variability',
    shortName: 'HRV',
    icon: 'chart',
    tone: 'purple',
  },
] as const;

export function formatMetricValue(metric?: HealthMetricSummaryItem): {
  value: string;
  unit: string;
} {
  if (!metric || !Number.isFinite(metric.value)) {
    return { value: 'No data', unit: '' };
  }

  switch (metric.metricType) {
    case 'sleep_analysis': {
      const totalMinutes = Math.max(0, Math.round(metric.value * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return { value: `${hours}h ${minutes}m`, unit: '' };
    }
    case 'step_count':
      return { value: Math.round(metric.value).toLocaleString(), unit: 'steps' };
    case 'heart_rate':
    case 'resting_heart_rate':
      return { value: String(Math.round(metric.value)), unit: 'bpm' };
    case 'heart_rate_variability_sdnn':
      return { value: String(Math.round(metric.value)), unit: 'ms' };
    case 'active_energy_burned':
      return {
        value: String(Math.round(metric.value)),
        unit: metric.unit.toLowerCase().includes('kcal') ? 'kcal' : metric.unit,
      };
    default:
      return { value: String(Math.round(metric.value)), unit: metric.unit };
  }
}

export function metricContextLabel(
  metric: HealthMetricSummaryItem | undefined,
  period: HealthSummaryPeriod,
): string {
  if (!metric) return 'No Apple Health data in this period';

  const periodLabel = period === 'day' ? 'today' : period === 'week' ? 'this week' : 'this month';
  if (metric.aggregation === 'latest') {
    if (!metric.recordedAt) return 'Latest Apple Health reading';
    const recorded = new Date(metric.recordedAt);
    return Number.isNaN(recorded.getTime())
      ? 'Latest Apple Health reading'
      : `Latest · ${recorded.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  return metric.metricType === 'sleep_analysis'
    ? `Sleep recorded ${periodLabel}`
    : `Total ${periodLabel}`;
}

export function formatHealthLastSync(value: string | null | undefined): string {
  if (!value) return 'Not synced yet';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Not synced yet' : parsed.toLocaleString();
}
