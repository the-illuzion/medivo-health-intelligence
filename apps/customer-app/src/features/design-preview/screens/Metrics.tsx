import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Copy,
  Icon,
  PageHeading,
  Section,
  Tile,
  s,
} from '../components/UI';
import { colors as c, designRoutes } from '../tokens';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import { useVitalsStore, type VitalMetric } from '../../../store/useVitalsStore';
import type { HealthMetricType, HealthSummaryPeriod } from '../../../services/health/healthApi';
import {
  HEALTH_METRIC_DISPLAY,
  formatHealthLastSync,
  formatMetricValue,
  metricContextLabel,
} from '../../../services/health/healthDisplay';

const PERIODS: readonly { label: 'Day' | 'Week' | 'Month'; value: HealthSummaryPeriod }[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

function medivoFallback(type: HealthMetricType, metrics: VitalMetric[]): VitalMetric | undefined {
  const fallbackName =
    type === 'heart_rate'
      ? 'Heart Rate'
      : type === 'step_count'
        ? 'Activity'
        : type === 'sleep_analysis'
          ? 'Sleep'
          : undefined;
  if (!fallbackName) return undefined;
  const metric = metrics.find((item) => item.name === fallbackName);
  if (!metric || metric.value === '--' || metric.value === '--/--') return undefined;
  return metric;
}

export default function Metrics() {
  const router = useRouter();
  const compact = useCompact();
  const desktop = useDesktop();
  const [period, setPeriod] = useState<HealthSummaryPeriod>('day');
  const { connection, summary, metrics, isLoading, error, refresh } = useHealthSummary(period);
  const {
    metrics: medivoMetrics,
    setPeriod: setMedivoPeriod,
    fetchAlerts,
  } = useVitalsStore();

  useEffect(() => {
    const label = period === 'day' ? 'Day' : period === 'week' ? 'Week' : 'Month';
    setMedivoPeriod(label);
    void fetchAlerts();
  }, [period, setMedivoPeriod, fetchAlerts]);

  return (
    <Screen>
      <PageHeading
        title="Key Metrics"
        subtitle="Track your vital signs and the readings you choose to share."
      />

      <View accessibilityRole="tablist" style={st.segmented}>
        {PERIODS.map((item) => (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: item.value === period }}
            aria-selected={item.value === period}
            onPress={() => setPeriod(item.value)}
            style={[st.segment, item.value === period && { backgroundColor: c.blue }]}
          >
            <Copy size={13} color={item.value === period ? c.white : c.muted}>
              {item.label}
            </Copy>
          </Pressable>
        ))}
      </View>

      <Card
        style={[
          s.row,
          { marginVertical: 10, backgroundColor: connection ? c.greenSoft : c.blueSoft },
        ]}
      >
        <Tile name={connection ? 'done' : 'heart'} tone={connection ? 'green' : 'blue'} size={38} />
        <View style={s.flex}>
          <Copy bold size={12}>
            Apple Health
          </Copy>
          <Copy size={10} color={connection ? c.green : c.muted}>
            ● {connection ? 'Connected' : 'Not connected'}
          </Copy>
          <Copy size={9} color={c.muted}>
            Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}
          </Copy>
        </View>
        <Action secondary style={{ minHeight: 34 }} onPress={() => router.push(designRoutes.devices)}>
          {connection ? 'Manage' : 'Connect'}
        </Action>
      </Card>

      {error ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginBottom: 10 }}>
          <Copy bold size={11} color={c.red}>
            Couldn’t load Apple Health data
          </Copy>
          <Copy size={10} color={c.muted} style={s.top4}>
            {error}
          </Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>
            Retry
          </Action>
        </Card>
      ) : null}

      {isLoading ? (
        <View style={{ paddingVertical: 30, alignItems: 'center' }}>
          <ActivityIndicator />
          <Copy size={10} color={c.muted} style={s.top4}>
            Loading Apple Health readings…
          </Copy>
        </View>
      ) : (
        HEALTH_METRIC_DISPLAY.map((definition) => {
          const metric = metrics.get(definition.type);
          const fallback = medivoFallback(definition.type, medivoMetrics);
          const formatted = formatMetricValue(metric);
          const value = metric ? formatted.value : fallback?.value || 'No data';
          const unit = metric ? formatted.unit : fallback?.unit || '';
          const context = metric
            ? metricContextLabel(metric, period)
            : fallback
              ? 'Latest Medivo scan/care reading'
              : metricContextLabel(undefined, period);

          return (
            <Card
              key={definition.type}
              onPress={() =>
                router.push({ pathname: designRoutes.metric, params: { type: definition.type } })
              }
              label={`${definition.name} details`}
              style={[st.metric, !desktop && st.mobileMetric, compact && { flexWrap: 'wrap' }]}
            >
              <Tile name={definition.icon} tone={definition.tone} />
              <View style={{ flex: 1.25 }}>
                <Copy size={12}>{definition.name}</Copy>
                <Copy size={16} bold>
                  {value}
                  {unit ? <Copy size={11}> {unit}</Copy> : null}
                </Copy>
              </View>
              <View style={s.flex}>
                <Copy size={10} color={c.muted}>
                  {context}
                </Copy>
                {metric?.sampleCount ? (
                  <Copy size={9} color={c.muted}>
                    {metric.sampleCount} source {metric.sampleCount === 1 ? 'sample' : 'samples'}
                  </Copy>
                ) : null}
              </View>
              <Icon name="chevron" size={13} color={c.muted} />
            </Card>
          );
        })
      )}

      <Section title="About these readings" style={s.card}>
        <Copy size={10} color={c.muted}>
          {connection
            ? summary?.metrics.length
              ? 'Apple Health values are shown first. Where a supported Apple Health reading is absent, Medivo can still surface compatible readings produced by scans or care workflows.'
              : 'Apple Health is connected, but no supported readings were found in this period. Compatible Medivo scan readings remain available when present.'
            : 'Connect Apple Health to sync device readings. Compatible Medivo scan and care readings continue to work independently.'}
        </Copy>
        <Action secondary style={{ marginTop: 10 }} onPress={() => router.push(designRoutes.devices)}>
          Manage Apple Health
        </Action>
      </Section>
    </Screen>
  );
}

export function MetricDetails() {
  const { type, name } = useLocalSearchParams<{ type?: string; name?: string }>();
  const router = useRouter();
  const { connection, metrics, isLoading, error, refresh } = useHealthSummary('day');
  const medivoMetrics = useVitalsStore((state) => state.metrics);
  const fetchVitals = useVitalsStore((state) => state.fetchVitals);

  useEffect(() => {
    void fetchVitals('Day');
  }, [fetchVitals]);

  const definition =
    HEALTH_METRIC_DISPLAY.find((item) => item.type === type || item.name === name) ||
    HEALTH_METRIC_DISPLAY[0];
  const metric = metrics.get(definition.type as HealthMetricType);
  const fallback = medivoFallback(definition.type as HealthMetricType, medivoMetrics);
  const formatted = formatMetricValue(metric);
  const value = metric ? formatted.value : fallback?.value || 'No data';
  const unit = metric ? formatted.unit : fallback?.unit || '';

  return (
    <Screen>
      <PageHeading
        title={definition.name}
        subtitle={metric ? 'Latest synced Apple Health data for today' : 'Latest available health data for today'}
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics))}
      />

      <Card style={s.center}>
        <Tile name={definition.icon} tone={definition.tone} size={48} />
        {isLoading ? (
          <ActivityIndicator style={{ marginVertical: 18 }} />
        ) : (
          <Copy size={32} bold style={{ marginVertical: 12 }}>
            {value}
            {unit ? <Copy size={18}> {unit}</Copy> : null}
          </Copy>
        )}
        <Copy size={11} color={c.muted} style={{ textAlign: 'center' }}>
          {metric
            ? metricContextLabel(metric, 'day')
            : fallback
              ? 'Latest Medivo scan/care reading'
              : 'No reading available today'}
        </Copy>
      </Card>

      {error ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginTop: 10 }}>
          <Copy size={10} color={c.red}>
            {error}
          </Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>
            Retry
          </Action>
        </Card>
      ) : null}

      <Section title="Reading details">
        <Copy color={c.muted}>
          {metric
            ? `This value was synced from Apple Health${metric.sourceName ? ` via ${metric.sourceName}` : ''}${metric.deviceName ? ` on ${metric.deviceName}` : ''}. Medivo has not classified it against a personal baseline.`
            : fallback
              ? 'This value comes from Medivo’s existing vitals pipeline, including scan or care data, because no Apple Health value is available for this metric today.'
              : connection
                ? `No ${definition.name.toLowerCase()} reading is available for today.`
                : 'Apple Health is not connected and no compatible Medivo reading is available.'}
        </Copy>
        {metric ? (
          <Copy size={10} color={c.muted} style={s.top4}>
            Samples represented: {metric.sampleCount}
          </Copy>
        ) : null}
      </Section>

      <Action secondary style={{ marginTop: 12 }} onPress={() => router.push(designRoutes.devices)}>
        Manage Apple Health
      </Action>
      <Action
        style={{ marginTop: 8 }}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics))}
      >
        Done
      </Action>
    </Screen>
  );
}

const st = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#edf2f8',
    borderRadius: 13,
    padding: 2,
  },
  segment: { flex: 1, borderRadius: 11, paddingVertical: 11, alignItems: 'center' },
  mobileMetric: { padding: 12, minHeight: 66, marginBottom: 8 },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 18,
    marginBottom: 12,
    minHeight: 94,
    borderWidth: 1,
  },
});
