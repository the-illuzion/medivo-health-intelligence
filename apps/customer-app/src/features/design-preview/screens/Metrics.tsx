import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, useCompact } from '../components/Shell';
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
import { usePreview } from '../PreviewContext';
import { metrics } from '../data/mock';
import { colors as c, designRoutes } from '../tokens';
export default function Metrics() {
  const p = usePreview();
  const router = useRouter();
  const large = useCompact();
  const n = ['Day', 'Week', 'Month'].indexOf(p.period);
  const values = [
    ['76', '118/76', '98', '7h 24m', '8,421', '36.8', 'Low'],
    ['74', '119/77', '98', '7h 12m', '8,320', '36.6', 'Low'],
    ['72', '120/78', '97', '7h 02m', '7,984', '36.7', 'Moderate'],
  ];
  return (
    <Screen>
      <PageHeading title="Key Metrics" subtitle="Track vital signs, trends, and what changed." />
      <View accessibilityRole="tablist" style={st.segmented}>
        {(['Day', 'Week', 'Month'] as const).map((period) => (
          <Pressable
            key={period}
            accessibilityRole="tab"
            accessibilityLabel={period}
            accessibilityState={{ selected: period === p.period }}
            aria-selected={period === p.period}
            onPress={() => p.setPeriod(period)}
            style={[st.segment, period === p.period && { backgroundColor: c.blue }]}
          >
            <Copy size={13} color={period === p.period ? 'white' : c.muted}>
              {period}
            </Copy>
          </Pressable>
        ))}
      </View>
      <Card style={[s.row, { marginVertical: 10 }]}>
        <Ring value={[78, 82, 85][n]} size={45} />
        <View style={s.flex}>
          <Copy bold size={11}>
            Health Score
          </Copy>
          <Copy size={10} color={c.muted}>
            ▲ Up {6 + n} pts from {n === 0 ? 'yesterday' : n === 1 ? 'last week' : 'last month'}
          </Copy>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="2 items to watch"
          onPress={() => p.setSheet({ kind: 'alert' })}
          style={[s.row, { flex: 1, gap: 7 }]}
        >
          <Tile name="alert" tone="orange" size={29} />
          <View style={s.flex}>
            <Copy size={11} bold>
              2 items to watch
            </Copy>
            <Copy size={10} color={c.muted}>
              See details
            </Copy>
          </View>
        </Pressable>
      </Card>
      {metrics.map((m, i) => (
        <Card
          key={m.name}
          onPress={() => router.push({ pathname: designRoutes.metric, params: { name: m.name } })}
          label={`${m.name} details`}
          style={[st.metric, large && { flexWrap: 'wrap' }]}
        >
          <Tile name={m.icon} tone={m.tone} />
          <View style={{ flex: 1.2 }}>
            <Copy size={12}>{m.name}</Copy>
            <Copy size={16} bold>
              {values[n][i]} <Copy size={11}>{m.unit}</Copy>
            </Copy>
          </View>
          <View style={s.flex}>
            <Copy size={11} color={i === 0 ? c.red : c.green}>
              {i === 0 ? ['+8% above', '+5% above', 'Within'][n] : m.change}
            </Copy>
            <Copy size={10} color={c.muted}>
              your usual range
            </Copy>
          </View>
          <Trend tone={m.tone} variant={i + n} />
          <Icon name="chevron" size={13} color={c.muted} />
        </Card>
      ))}
      <Section
        title={`What changed this ${p.period === 'Day' ? 'month' : p.period.toLowerCase()}`}
        style={s.card}
      >
        <View style={s.grid3}>
          {[
            {
              title: 'Activity',
              change: 'Biggest improvement',
              text: '28% higher than your baseline. You took an average of 1,841 more steps per day this month.',
              tone: 'green' as const,
              icon: 'up',
            },
            {
              title: 'Heart Rate',
              change: 'Biggest decline',
              text: '8% lower than your baseline. Your average resting heart rate decreased from 74 to 68 bpm.',
              tone: 'red' as const,
              icon: 'down',
            },
          ].map((item) => (
            <View key={item.title} style={[s.third, s.row, { alignItems: 'flex-start', gap: 7 }]}>
              <Tile name={item.icon} tone={item.tone} size={26} />
              <View style={s.flex}>
                <Copy size={9} color={c.muted}>
                  {item.change}
                </Copy>
                <Copy size={12} bold>
                  {item.title}
                </Copy>
                <Copy size={10} color={c.muted}>
                  {item.text}
                </Copy>
              </View>
            </View>
          ))}
        </View>
      </Section>
      <DemoNote />
    </Screen>
  );
}
export function MetricDetails() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();
  const metric = metrics.find((m) => m.name === name) || metrics[0];
  return (
    <Screen>
      <PageHeading
        title={metric.name}
        subtitle="Sample reading and personal baseline"
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics))}
      />
      <Card style={s.center}>
        <Tile name={metric.icon} tone={metric.tone} size={48} />
        <Copy size={32} bold style={{ marginVertical: 12 }}>
          {metric.value} <Copy size={18}>{metric.unit}</Copy>
        </Copy>
        <Trend large tone={metric.tone} />
        <Chip tone={metric.name === 'Heart Rate' ? 'orange' : 'green'}>
          {metric.change} your usual range
        </Chip>
      </Card>
      <Section title="About this reading">
        <Copy color={c.muted}>
          {metric.name === 'Heart Rate'
            ? 'Your resting heart rate has been above your personal baseline for 3 days. Keep track of changes and share persistent changes with your care team.'
            : `Your ${metric.name.toLowerCase()} readings help you follow patterns over time. Compare your daily readings with your usual range.`}
        </Copy>
      </Section>
      <DemoNote text="Illustrative data only. This is not medical advice." />
      <Action
        style={{ marginTop: 20 }}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.metrics))}
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
});
