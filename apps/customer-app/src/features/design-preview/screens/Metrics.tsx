import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  PageHeading,
  Ring,
  Section,
  Tile,
  Trend,
  s,
} from '../components/UI';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { colors as c, designRoutes } from '../tokens';

export default function Metrics() {
  const router = useRouter();
  const large = useCompact();
  const desktop = useDesktop();
  const { metrics, period, setPeriod, healthScore, changesSummary, alerts, fetchVitals, fetchAlerts } = useVitalsStore();
  const { openSheet } = useSheetStore();

  useEffect(() => {
    fetchVitals(period);
    fetchAlerts();
  }, [period]);

  const activeAlertCount = alerts.length;
  const periodTitle = period === 'Day' ? 'today' : period === 'Week' ? 'this week' : 'this month';

  return (
    <Screen>
      <PageHeading title="Key Metrics" subtitle="Track vital signs, trends, and what changed." />
      <View accessibilityRole="tablist" style={st.segmented}>
        {(['Day', 'Week', 'Month'] as const).map((p) => (
          <Pressable
            key={p}
            accessibilityRole="tab"
            accessibilityLabel={p}
            accessibilityState={{ selected: p === period }}
            aria-selected={p === period}
            onPress={() => setPeriod(p)}
            style={[st.segment, p === period && { backgroundColor: c.blue }]}
          >
            <Copy size={13} bold={p === period} color={p === period ? 'white' : c.muted}>
              {p}
            </Copy>
          </Pressable>
        ))}
      </View>
      <Card style={[s.row, { marginVertical: 10 }]}>
        <Ring value={healthScore.score} size={45} />
        <View style={s.flex}>
          <Copy bold size={11}>
            Health Score
          </Copy>
          <Copy size={10} color={c.muted}>
            {typeof healthScore.score === 'number' && healthScore.score > 0
              ? `▲ Up ${healthScore.deltaPts} pts from ${healthScore.comparisonPeriod}`
              : 'Complete first scan for baseline'}
          </Copy>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={activeAlertCount > 0 ? `${activeAlertCount} items to watch` : 'All metrics clear'}
          onPress={() => openSheet({ kind: 'alert' })}
          style={[s.row, { flex: 1, gap: 7 }]}
        >
          <Tile name="alert" tone={activeAlertCount > 0 ? 'orange' : 'green'} size={29} />
          <View style={s.flex}>
            <Copy size={11} bold>
              {activeAlertCount > 0 ? `${activeAlertCount} item${activeAlertCount > 1 ? 's' : ''} to watch` : 'All metrics clear'}
            </Copy>
            <Copy size={10} color={c.muted}>
              {activeAlertCount > 0 ? 'See details' : 'No active alerts'}
            </Copy>
          </View>
        </Pressable>
      </Card>
      <View style={desktop ? st.desktopMetricsGrid : undefined}>
        {metrics.map((m, i) => (
          <Card
            key={m.name}
            onPress={() => router.push({ pathname: designRoutes.metric, params: { name: m.name } })}
            label={`${m.name} details`}
            style={[st.metric, desktop && st.desktopMetricCard, large && { flexWrap: 'wrap' }]}
          >
            <Tile name={m.name === 'SpO₂' ? 'lungs' : m.name === 'Blood Pressure' ? 'pressure' : m.icon} tone={m.tone} />
            <View style={{ flex: 1.2 }}>
              <Copy size={12}>{m.name}</Copy>
              <Copy size={16} bold>
                {m.value} <Copy size={11}>{m.unit}</Copy>
              </Copy>
            </View>
            <View style={s.flex}>
              <Copy size={11} color={m.tone === 'red' ? c.red : c.green}>
                {m.change}
              </Copy>
              <Copy size={10} color={c.muted}>
                your usual range
              </Copy>
            </View>
            <Trend tone={m.tone} variant={i + (period === 'Day' ? 0 : period === 'Week' ? 1 : 2)} />
            <Icon name="chevron" size={13} color={c.muted} />
          </Card>
        ))}
      </View>
      <Section
        title={`What changed ${periodTitle}`}
        style={s.card}
      >
        <View style={desktop ? s.grid3 : s.grid2}>
          {changesSummary.length > 0 ? (
            changesSummary.map((item) => (
              <View key={item.title} style={[desktop ? s.third : s.half, s.row, { alignItems: 'flex-start', gap: 7 }]}>
                <Tile name={item.icon} tone={item.tone} size={26} />
                <View style={s.flex}>
                  <Copy size={9} color={c.muted}>
                    {item.change}
                  </Copy>
                  <Copy size={12} bold>
                    {item.title}
                  </Copy>
                  <Copy size={10} color={c.muted} style={s.top4}>
                    {item.text}
                  </Copy>
                </View>
              </View>
            ))
          ) : (
            <View style={[s.flex, s.center, { padding: 12 }]}>
              <Copy size={11} color={c.muted}>
                No significant baseline variations detected for this period.
              </Copy>
            </View>
          )}
        </View>
      </Section>
      <DemoNote text="Clinical telemetry recorded via Medivo AI Engine. Consult your physician for medical advice." />
    </Screen>
  );
}

export function MetricDetails() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();
  const { metrics, fetchVitals } = useVitalsStore();

  useEffect(() => {
    if (!metrics || metrics.length === 0) {
      fetchVitals();
    }
  }, []);

  const metric =
    metrics.find((m) => m.name.toLowerCase() === (name || '').toLowerCase()) ||
    metrics.find((m) => m.name === name) ||
    metrics[0];

  const goBack = () => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics));

  return (
    <Screen>
      <PageHeading
        title={metric.name}
        subtitle="Personal baseline and clinical telemetry"
        back={goBack}
      />
      <Card style={[s.center, { paddingVertical: 20 }]}>
        <Tile
          name={metric.name === 'SpO₂' ? 'lungs' : metric.name === 'Blood Pressure' ? 'pressure' : metric.icon}
          tone={metric.tone}
          size={52}
        />
        <Copy size={34} bold style={{ marginVertical: 12 }}>
          {metric.value} <Copy size={18}>{metric.unit}</Copy>
        </Copy>
        <Trend large tone={metric.tone} />
        <View style={{ marginTop: 12 }}>
          <Chip tone={metric.tone === 'red' ? 'red' : metric.tone === 'orange' ? 'orange' : 'green'}>
            {metric.change} your usual range
          </Chip>
        </View>
      </Card>
      <Section title="Personal Baseline & Reference">
        <Card style={[s.row, { justifyContent: 'space-between', padding: 14 }]}>
          <View>
            <Copy size={10} color={c.muted}>
              Personal Baseline
            </Copy>
            <Copy size={14} bold style={s.top4}>
              {metric.baseline || 'Normal Range'}
            </Copy>
          </View>
          <View>
            <Copy size={10} color={c.muted}>
              Current Reading
            </Copy>
            <Copy size={14} bold style={s.top4}>
              {metric.value} {metric.unit}
            </Copy>
          </View>
          <View>
            <Copy size={10} color={c.muted}>
              Status
            </Copy>
            <Copy size={14} bold color={metric.tone === 'red' ? c.red : c.green} style={s.top4}>
              {metric.change}
            </Copy>
          </View>
        </Card>
      </Section>
      <Section title="About this reading">
        <Card>
          <Copy color={c.navy} style={{ lineHeight: 18 }}>
            {metric.description ||
              (metric.name === 'Heart Rate'
                ? 'Your resting heart rate has been above your personal baseline for 3 days. Keep track of changes and share persistent changes with your care team.'
                : `Your ${metric.name.toLowerCase()} readings help you follow patterns over time. Compare your daily readings with your usual range.`)}
          </Copy>
        </Card>
      </Section>
      <DemoNote text="Illustrative data only. This is not medical advice." />
      <Action
        style={{ marginTop: 20 }}
        onPress={goBack}
      >
        Done
      </Action>
    </Screen>
  );
}

const st = StyleSheet.create({
  segmented: { flexDirection: 'row', backgroundColor: '#edf2f8', borderRadius: 13, padding: 2 },
  segment: { flex: 1, borderRadius: 11, paddingVertical: 8, alignItems: 'center' },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    marginBottom: 7,
    minHeight: 60,
    borderWidth: 0,
  },
  desktopMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  desktopMetricCard: {
    width: '49%',
    marginBottom: 0,
    padding: 14,
  },
});
