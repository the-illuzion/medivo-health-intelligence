import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  Ring,
  Section,
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { useAuthStore } from '../../../store/useAuthStore';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useCareStore } from '../../../store/useCareStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { colors as c, designRoutes } from '../tokens';

export default function Home() {
  const router = useRouter();
  const compact = useCompact();
  const desktop = useDesktop();

  const { user } = useAuthStore();
  const { profile, fetchProfile } = useHealthProfileStore();
  const { metrics, insights, alerts, healthScore, fetchVitals, fetchInsights, fetchAlerts } = useVitalsStore();
  const { carePlan, fetchCarePlan } = useCareStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { openSheet } = useSheetStore();

  useEffect(() => {
    fetchProfile();
    fetchVitals();
    fetchInsights();
    fetchAlerts();
    fetchCarePlan();
    fetchDevices();
  }, []);

  const displayName = user?.name || profile?.name || 'Alex';
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const goMetric = (name: string) =>
    router.push({ pathname: designRoutes.metric, params: { name } });

  const activeAlert = alerts[0];
  const primaryInsight = insights[0];
  const scoreValue = healthScore?.score || 85;
  const isHealthy = scoreValue >= 80;
  const statusLabel = isHealthy ? 'All good' : scoreValue >= 65 ? 'Optimal' : 'Needs attention';
  const statusColor = isHealthy ? c.green : scoreValue >= 65 ? c.blue : c.orange;

  return (
    <Screen>
      <View style={st.greeting}>
        <Heading size={19}>{timeGreeting}, {displayName}</Heading>
        <Copy size={10} color={c.muted}>
          {todayDateFormatted}
        </Copy>
      </View>
      <Copy color={c.muted}>Here’s your health overview for today.</Copy>
      <Copy size={9} color={c.green} style={s.top4}>
        ● Live Telemetry & Biomarker Intelligence Active
      </Copy>
      <View style={desktop && st.desktopHero}>
        <Card
          onPress={() => router.push(designRoutes.status)}
          label="Your Health Status"
          style={[st.health, desktop && st.desktopHeroCard]}
        >
          <Ring value={scoreValue} />
          <View style={s.flex}>
            <Copy>Your Health Status</Copy>
            <View style={[s.row, { marginVertical: 5 }]}>
              <Heading size={25} style={{ color: statusColor }}>
                {statusLabel}
              </Heading>
              <Icon name="done" size={23} color={statusColor} />
            </View>
            <Copy size={11} color={c.muted}>
              {isHealthy
                ? 'Your vital signs are within your normal range. Keep up the good work!'
                : 'Biomarker trends detected. Review your daily plan for recommendations.'}
            </Copy>
          </View>
          <Icon name="chevron" size={17} />
        </Card>
        <Card
          onPress={() => openSheet({ kind: 'insights' })}
          label="Insight for You"
          style={[st.insight, desktop && st.desktopHeroCard]}
        >
          <Tile name="bulb" />
          <View style={s.flex}>
            <Copy size={11} color={c.blue} bold>
              Insight for You
            </Copy>
            <Copy size={11} color={c.muted} style={s.top4}>
              {primaryInsight?.text ||
                'Your sleep duration has improved by 12% this week, which is positively impacting your recovery.'}
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
          {metrics.slice(0, 6).map((m) => {
            return (
              <Card
                key={m.name}
                onPress={() => goMetric(m.name)}
                label={`${m.name} details`}
                style={[st.mini, compact && { width: '48%' }]}
              >
                <Tile
                  name={m.name === 'SpO₂' ? 'lungs' : m.name === 'Blood Pressure' ? 'pressure' : m.icon}
                  tone={m.tone}
                  size={27}
                />
                <View style={s.flex}>
                  <Copy size={9} color={c.muted}>
                    {m.name}
                  </Copy>
                  <Copy size={13} bold>
                    {m.home || m.value}
                    <Copy size={8}> {m.unit}</Copy>
                  </Copy>
                  <Copy size={8} color={m.tone === 'red' ? c.red : c.green}>
                    {m.change}
                  </Copy>
                </View>
              </Card>
            );
          })}
        </View>
      </Section>
      {activeAlert && (
        <Card style={st.alert}>
          <View style={s.row}>
            <Tile name="up" tone="orange" />
            <View style={s.flex}>
              <Heading size={13}>{activeAlert.title}</Heading>
              <Copy size={11} color={c.muted} style={s.top4}>
                {activeAlert.subtitle}
              </Copy>
            </View>
          </View>
          <Action secondary style={st.alertAction} onPress={() => openSheet({ kind: 'alert' })}>
            View details
          </Action>
        </Card>
      )}
      <View style={desktop && st.desktopLower}>
        <Section
          title="Today’s Care Plan"
          action="See all"
          onAction={() => router.navigate(designRoutes.care)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          <View style={compact ? s.grid2 : s.grid3}>
            {carePlan.tasks.length > 0 ? (
              carePlan.tasks.slice(0, 3).map((t) => (
                <Card key={t.id} onPress={() => router.navigate(designRoutes.care)} style={s.third}>
                  <Tile name={t.icon} size={32} tone={t.tone} />
                  <Copy bold size={11} style={{ marginTop: 7 }}>
                    {t.name}
                  </Copy>
                  <Copy size={10} color={c.muted} style={s.top4}>
                    {t.time}
                  </Copy>
                  <View style={{ marginTop: 7 }}>
                    <Chip
                      tone={t.status === 'Completed' ? 'green' : t.status === 'Pending' ? 'orange' : 'blue'}
                      icon={t.status === 'Completed' ? 'done' : 'clock'}
                    >
                      {t.status}
                    </Chip>
                  </View>
                </Card>
              ))
            ) : (
              <Card onPress={() => router.navigate(designRoutes.care)} style={[s.third, s.center, { padding: 14 }]}>
                <Tile name="heart" tone="blue" size={32} />
                <Copy bold size={11} style={s.top4}>
                  Care plan ready
                </Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  View today's schedule ›
                </Copy>
              </Card>
            )}
          </View>
        </Section>
        <Section
          title="Connected Devices"
          action="Manage"
          onAction={() => router.push(designRoutes.devices)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          <View style={s.grid3}>
            {devices.length > 0 ? (
              devices.slice(0, 3).map((d) => (
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
                      <Copy size={8} color={d.enabled ? c.green : c.muted}>
                        ● {d.enabled ? `Synced ${d.sync}` : 'Sync paused'}
                      </Copy>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Card
                onPress={() => router.push(designRoutes.connect)}
                style={[s.third, s.center, { padding: 14 }]}
              >
                <Tile name="watch" tone="purple" size={32} />
                <Copy bold size={11} style={s.top4}>
                  Pair a device
                </Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  Sync vitals automatically ›
                </Copy>
              </Card>
            )}
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
