import React, { useState } from 'react';
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

export default function Metrics() {
  const router = useRouter();
  const compact = useCompact();
  const desktop = useDesktop();
  const [period, setPeriod] = useState<HealthSummaryPeriod>('day');
  const { connection, summary, metrics, isLoading, error, refresh } = useHealthSummary(period);

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

      <Card style={[s.row, { marginVertical: 10, backgroundColor: connection ? c.greenSoft : c.blueSoft }]}>
        <Tile name={connection ? 'done' : 'heart'} tone={connection ? 'green' : 'blue'} size={38} />
        <View style={s.flex}>
          <Copy bold size={12}>Apple Health</Copy>
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
          <Copy bold size={11} color={c.red}>Couldn’t load Apple Health data</Copy>
          <Copy size={10} color={c.muted} style={s.top4}>{error}</Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>Retry</Action>
        </Card>
      ) : null}

      {isLoading ? (
        <View style={{ paddingVertical: 30, alignItems: 'center' }}>
          <ActivityIndicator />
          <Copy size={10} color={c.muted} style={s.top4}>Loading Apple Health readings…</Copy>
        </View>
      ) : (
        HEALTH_METRIC_DISPLAY.map((definition) => {
          const metric = metrics.get(definition.type);
          const formatted = formatMetricValue(metric);
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
                  {formatted.value}{formatted.unit ? <Copy size={11}> {formatted.unit}</Copy> : null}
                </Copy>
              </View>
              <View style={s.flex}>
                <Copy size={10} color={c.muted}>{metricContextLabel(metric, period)}</Copy>
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
              ? 'Values above come from the Apple Health samples already synced to Medivo. Steps and active energy are totals for the selected period; heart rate, resting heart rate and HRV show the latest reading in the period; sleep shows recorded asleep duration.'
              : 'Apple Health is connected, but no supported readings were found in this period.'
            : 'Connect Apple Health to replace empty states with your synced readings.'}
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
  const definition =
    HEALTH_METRIC_DISPLAY.find((item) => item.type === type || item.name === name) ||
    HEALTH_METRIC_DISPLAY[0];
  const metric = metrics.get(definition.type as HealthMetricType);
  const formatted = formatMetricValue(metric);

  return (
    <Screen>
      <PageHeading
        title={definition.name}
        subtitle="Latest synced Apple Health data for today"
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics))}
      />

      <Card style={s.center}>
        <Tile name={definition.icon} tone={definition.tone} size={48} />
        {isLoading ? (
          <ActivityIndicator style={{ marginVertical: 18 }} />
        ) : (
          <Copy size={32} bold style={{ marginVertical: 12 }}>
            {formatted.value}{formatted.unit ? <Copy size={18}> {formatted.unit}</Copy> : null}
          </Copy>
        )}
        <Copy size={11} color={c.muted} style={{ textAlign: 'center' }}>
          {metricContextLabel(metric, 'day')}
        </Copy>
      </Card>

      {error ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginTop: 10 }}>
          <Copy size={10} color={c.red}>{error}</Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>Retry</Action>
        </Card>
      ) : null}

      <Section title="Reading details">
        <Copy color={c.muted}>
          {metric
            ? `This value was synced from Apple Health${metric.sourceName ? ` via ${metric.sourceName}` : ''}${metric.deviceName ? ` on ${metric.deviceName}` : ''}. Medivo has not classified it against a personal baseline.`
            : connection
              ? `No ${definition.name.toLowerCase()} reading is available for today.`
              : 'Apple Health is not connected.'}
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
