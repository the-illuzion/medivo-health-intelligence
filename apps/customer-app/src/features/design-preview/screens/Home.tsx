import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  Ring,
  Section,
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { metrics } from '../data/mock';
import { colors as c, designRoutes } from '../tokens';
export default function Home() {
  const router = useRouter();
  const p = usePreview();
  const compact = useCompact();
  const desktop = useDesktop();
  const goMetric = (name: string) =>
    router.push({ pathname: designRoutes.metric, params: { name } });
  return (
    <Screen>
      <View style={st.greeting}>
        <Heading size={19}>Good morning, Aanya</Heading>
        <Copy size={10} color={c.muted}>
          Tue, 12 Nov 2024
        </Copy>
      </View>
      <Copy color={c.muted}>Here’s your health overview for today.</Copy>
      <Copy size={9} color={c.muted} style={s.top4}>
        Design preview · Sample profile and readings
      </Copy>
      <View style={desktop && st.desktopHero}>
        <Card
          onPress={() => router.push(designRoutes.status)}
          label="Your Health Status"
          style={[st.health, desktop && st.desktopHeroCard]}
        >
          <Ring />
          <View style={s.flex}>
            <Copy>Your Health Status</Copy>
            <View style={[s.row, { marginVertical: 5 }]}>
              <Heading size={25} style={{ color: c.green }}>
                All good
              </Heading>
              <Icon name="done" size={23} color={c.green} />
            </View>
            <Copy size={11} color={c.muted}>
              Your vital signs are within your normal range. Keep up the good work!
            </Copy>
          </View>
          <Icon name="chevron" size={17} />
        </Card>
        <Card
          onPress={() => p.setSheet({ kind: 'insights' })}
          label="Insight for You"
          style={[st.insight, desktop && st.desktopHeroCard]}
        >
          <Tile name="bulb" />
          <View style={s.flex}>
            <Copy size={11} color={c.blue} bold>
              Insight for You
            </Copy>
            <Copy size={11} color={c.muted} style={s.top4}>
              Your sleep duration has improved by 12% this week, which is positively impacting your
              recovery.
            </Copy>
          </View>
          <Icon name="chevron" size={16} />
        </Card>
      </View>
      <Section
        title="Key Health Metrics"
        action="View All"
        onAction={() => router.navigate(designRoutes.metrics)}
      >
        <View style={st.metrics}>
          {[0, 2, 5, 1, 3, 4].map((i) => {
            const m = metrics[i];
            return (
              <Card
                key={m.name}
                onPress={() => goMetric(m.name)}
                label={`${m.name} details`}
                style={[st.mini, compact && { width: '48%' }]}
              >
                <Tile
                  name={i === 2 ? 'lungs' : i === 1 ? 'drop' : m.icon}
                  tone={
                    i === 5
                      ? 'purple'
                      : i === 3
                        ? 'orange'
                        : i === 1
                          ? 'green'
                          : i === 2
                            ? 'blue'
                            : m.tone
                  }
                  size={27}
                />
                <View style={s.flex}>
                  <Copy size={9} color={c.muted}>
                    {i === 5 ? 'Body Temp' : m.name}
                  </Copy>
                  <Copy size={13} bold>
                    {m.home}
                    <Copy size={8}> {m.unit}</Copy>
                  </Copy>
                  <Copy size={8} color={i === 2 || i === 5 ? c.muted : c.green}>
                    {i === 0
                      ? '↓ 2% from baseline'
                      : i === 1
                        ? '↓ 5% from baseline'
                        : i === 3
                          ? '↑ 12% from last week'
                          : i === 4
                            ? '↑ 8% from last week'
                            : '→ No change'}
                  </Copy>
                </View>
              </Card>
            );
          })}
        </View>
      </Section>
      <Card style={st.alert}>
        <View style={s.row}>
          <Tile name="up" tone="orange" />
          <View style={s.flex}>
            <Heading size={13}>Resting Heart Rate is higher than usual</Heading>
            <Copy size={11} color={c.muted} style={s.top4}>
              Your resting heart rate is 18% above your personal baseline for the past 3 days.
            </Copy>
          </View>
        </View>
        <Action secondary style={st.alertAction} onPress={() => p.setSheet({ kind: 'alert' })}>
          View details
        </Action>
      </Card>
      <View style={desktop && st.desktopLower}>
        <Section
          title="Today’s Care Plan"
          action="See all"
          onAction={() => router.navigate(designRoutes.care)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          <View style={compact ? s.grid2 : s.grid3}>
            {[p.tasks[0], p.tasks[2], p.tasks[4]].map((t, i) => (
              <Card key={t.id} onPress={() => router.navigate(designRoutes.care)} style={s.third}>
                <Tile name={t.icon} size={32} />
                <Copy bold size={11} style={{ marginTop: 7 }}>
                  {['Take Medication', 'Light Activity', 'Recheck Vitals'][i]}
                </Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  {['8:00 AM', '30 min walk', 'Around 6:00 PM'][i]}
                </Copy>
                <View style={{ marginTop: 7 }}>
                  <Chip
                    tone={t.status === 'Completed' ? 'green' : 'blue'}
                    icon={t.status === 'Completed' ? 'done' : 'clock'}
                  >
                    {t.status}
                  </Chip>
                </View>
              </Card>
            ))}
          </View>
        </Section>
        <Section
          title="Connected Devices"
          action="Manage"
          onAction={() => router.push(designRoutes.devices)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          <View style={s.grid3}>
            {p.devices.slice(0, 3).map((d) => (
              <Card
                key={d.name}
                onPress={() => router.push(designRoutes.devices)}
                style={[s.third, { padding: 6 }]}
              >
                <View style={[s.row, { gap: 4 }]}>
                  <DeviceArt kind={d.kind} size={25} />
                  <View style={s.flex}>
                    <Copy bold size={8}>
                      {d.name}
                    </Copy>
                    <Copy size={8} color={c.muted}>
                      ● {d.enabled ? `Synced ${d.sync}` : 'Sync paused'}
                    </Copy>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </Section>
      </View>
    </Screen>
  );
}
const st = StyleSheet.create({
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  health: {
    backgroundColor: c.greenSoft,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 0,
  },
  insight: {
    backgroundColor: '#eaf2ff',
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    marginTop: 8,
    borderWidth: 0,
  },
  metrics: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  mini: {
    width: '31.8%',
    flexDirection: 'row',
    gap: 5,
    padding: 5,
    minHeight: 62,
    borderRadius: 10,
  },
  alert: { backgroundColor: '#fff1ed', borderColor: '#ffe5dd', marginTop: 10 },
  alertAction: { marginTop: 10, minHeight: 34, borderColor: c.border },
  white: { backgroundColor: 'white', padding: 10, borderRadius: 12 },
  desktopHero: { flexDirection: 'row', gap: 16, marginTop: 16 },
  desktopHeroCard: { flex: 1, marginTop: 0 },
  desktopLower: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  desktopLowerCard: { flex: 1 },
});
