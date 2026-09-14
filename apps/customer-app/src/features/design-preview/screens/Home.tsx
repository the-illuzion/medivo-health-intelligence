import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  Section,
  Ring,
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { colors as c, designRoutes } from '../tokens';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCareStore } from '../../../store/useCareStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import {
  HEALTH_METRIC_DISPLAY,
  formatHealthLastSync,
  formatMetricValue,
  metricContextLabel,
} from '../../../services/health/healthDisplay';

export default function Home() {
  const router = useRouter();
  const compact = useCompact();
  const desktop = useDesktop();
  const user = useAuthStore((state) => state.user);
  const { connection, metrics, isLoading, error, refresh } = useHealthSummary('day');

  const { carePlan, fetchCarePlan } = useCareStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { profile, fetchProfile } = useHealthProfileStore();
  const { fetchVitals, fetchInsights, fetchAlerts } = useVitalsStore();

  useFocusEffect(
    useCallback(() => {
      void Promise.allSettled([
        fetchCarePlan(),
        fetchDevices(),
        fetchProfile(),
        fetchVitals(),
        fetchInsights(),
        fetchAlerts(),
      ]);
    }, [fetchCarePlan, fetchDevices, fetchProfile, fetchVitals, fetchInsights, fetchAlerts]),
  );

  const firstName = (user?.name || profile.name || 'there').trim().split(/\s+/)[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const hasHealthData = metrics.size > 0;
  const steps = formatMetricValue(metrics.get('step_count'));
  const heartRate = formatMetricValue(metrics.get('heart_rate'));
  const restingHeartRate = metrics.get('resting_heart_rate');
  const careItems = carePlan.tasks.slice(0, 3);

  return (
    <Screen>
      <View style={st.greeting}>
        <Heading size={desktop ? 24 : 19}>
          {greeting}, {firstName}
        </Heading>
        <Copy size={10} color={c.muted}>
          {today}
        </Copy>
      </View>
      <Copy color={c.muted}>Here’s your health overview for today.</Copy>

      <View style={st.heroStack}>
        <Card
          onPress={() => router.push(designRoutes.status)}
          label="Your Health Status"
          style={[
            st.health,
            { backgroundColor: connection ? c.greenSoft : c.blueSoft },
            desktop && st.desktopHealth,
          ]}
        >
          {connection ? (
            <Ring
              value={(metrics.size / HEALTH_METRIC_DISPLAY.length) * 100}
              size={desktop ? 112 : 88}
              displayValue={String(metrics.size)}
              caption="/ 6"
              accessibilityLabel={`${metrics.size} of 6 health categories have readings today`}
            />
          ) : (
            <Tile name="heart" tone="blue" size={desktop ? 90 : 72} />
          )}
          <View style={s.flex}>
            <Copy>Your Health Status</Copy>
            <View style={[s.row, { marginVertical: 5 }]}>
              <Heading size={22} style={{ color: connection ? c.green : c.blue }}>
                {connection ? (hasHealthData ? 'Up to date' : 'Connected') : 'Not connected'}
              </Heading>
            </View>
            <Copy size={11} color={c.muted}>
              {connection
                ? hasHealthData
                  ? 'Your latest readings across 6 health categories are ready to review.'
                  : `Apple Health is connected. Last sync: ${formatHealthLastSync(connection.lastSyncedAt)}.`
                : 'Connect Apple Health to show your real health readings here.'}
            </Copy>
          </View>
          <Icon name="chevron" size={17} />
        </Card>

        <Card
          onPress={() => router.push(designRoutes.metrics)}
          label="Apple Health snapshot"
          style={[st.insight, desktop && st.desktopInsight]}
        >
          <Tile name="bulb" />
          <View style={s.flex}>
            <Copy size={11} color={c.blue} bold>
              Today from Apple Health
            </Copy>
            {isLoading ? (
              <ActivityIndicator style={{ alignSelf: 'flex-start', marginTop: 6 }} />
            ) : (
              <Copy size={11} color={c.muted} style={s.top4}>
                {hasHealthData
                  ? `Steps: ${steps.value}${steps.unit ? ` ${steps.unit}` : ''}${heartRate.value !== 'No data' ? ` · Latest heart rate: ${heartRate.value} ${heartRate.unit}` : ''}`
                  : connection
                    ? 'No supported Apple Health readings have been recorded for today yet.'
                    : 'Connect Apple Health to populate this snapshot.'}
              </Copy>
            )}
          </View>
          <Icon name="chevron" size={16} />
        </Card>
      </View>

      {error ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginTop: 8 }}>
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

      <Section
        title="Key Health Metrics"
        action="View All"
        onAction={() => router.navigate(designRoutes.metrics)}
      >
        <View style={st.metrics}>
          {HEALTH_METRIC_DISPLAY.map((definition) => {
            const metric = metrics.get(definition.type);
            const formatted = formatMetricValue(metric);
            return (
              <Card
                key={definition.type}
                onPress={() =>
                  router.push({ pathname: designRoutes.metric, params: { type: definition.type } })
                }
                label={`${definition.name} details`}
                style={[st.mini, desktop && st.miniDesktop, compact && st.miniAccessible]}
              >
                <Tile
                  name={definition.icon}
                  tone={definition.tone}
                  size={desktop ? 46 : 29}
                />
                <View style={s.flex}>
                  <Copy size={desktop ? 11 : 9} color={c.muted}>
                    {definition.shortName}
                  </Copy>
                  <Copy size={desktop ? 18 : 14} bold>
                    {metric ? formatted.value : '—'}
                    <Copy size={desktop ? 11 : 9}> {formatted.unit}</Copy>
                  </Copy>
                  <Copy size={9} color={c.muted}>
                    {metric ? metricContextLabel(metric, 'day') : 'No reading yet'}
                  </Copy>
                </View>
              </Card>
            );
          })}
        </View>
      </Section>

      {restingHeartRate ? (
        <Card style={st.alert}>
          <View style={s.row}>
            <Tile name="heartpulse" tone="orange" />
            <View style={s.flex}>
              <Heading size={13}>Latest resting heart rate</Heading>
              <Copy size={11} color={c.muted} style={s.top4}>
                Apple Health recorded {formatMetricValue(restingHeartRate).value} bpm. We don’t
                label this as high or low until a real personal baseline is available.
              </Copy>
            </View>
          </View>
          <Action
            secondary
            style={st.alertAction}
            onPress={() =>
              router.push({ pathname: designRoutes.metric, params: { type: 'resting_heart_rate' } })
            }
          >
            View reading
          </Action>
        </Card>
      ) : null}

      <View style={desktop && st.desktopLower}>
        <Section
          title="Today’s Care Plan"
          action="See all"
          onAction={() => router.navigate(designRoutes.care)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          {careItems.length > 0 ? (
            <View style={compact ? s.grid2 : s.grid3}>
              {careItems.map((item) => (
                <Card
                  key={item.id}
                  onPress={() => router.navigate(designRoutes.care)}
                  style={s.third}
                >
                  <Tile
                    name={item.icon || 'check'}
                    size={32}
                    tone={item.status === 'Completed' ? 'green' : item.tone}
                  />
                  <Copy bold size={11} style={{ marginTop: 7 }}>
                    {item.name}
                  </Copy>
                  <Copy size={10} color={c.muted} style={s.top4}>
                    {item.description || item.time}
                  </Copy>
                  <View style={{ marginTop: 7 }}>
                    <Chip
                      tone={item.status === 'Completed' ? 'green' : 'blue'}
                      icon={item.status === 'Completed' ? 'done' : 'clock'}
                    >
                      {item.status}
                    </Chip>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={st.emptyCare}>
              <Tile name="calendar" size={42} />
              <View style={s.flex}>
                <Copy bold>Your day, at a glance</Copy>
                <Copy color={c.muted} style={s.top4}>
                  Your care tasks will appear here when a routine is available.
                </Copy>
              </View>
            </View>
          )}
        </Section>

        <Section
          title="Connected Devices"
          action="Manage"
          onAction={() => router.push(designRoutes.devices)}
          style={[st.white, desktop && st.desktopLowerCard]}
        >
          <Card onPress={() => router.push(designRoutes.devices)} style={{ padding: 9 }}>
            <View style={[s.row, { gap: 7 }]}>
              <Tile name="heart" tone="red" size={30} />
              <View style={s.flex}>
                <Copy bold size={10}>
                  Apple Health
                </Copy>
                <Copy size={9} color={connection ? c.green : c.muted}>
                  ● {connection ? 'Connected' : 'Not connected'}
                </Copy>
                <Copy size={8} color={c.muted}>
                  Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}
                </Copy>
              </View>
            </View>
          </Card>

          {devices.slice(0, 2).map((device) => (
            <Card
              key={device.id || device.name}
              onPress={() => router.push(designRoutes.devices)}
              style={{ padding: 9, marginTop: 8 }}
            >
              <View style={[s.row, { gap: 7 }]}>
                <DeviceArt kind={device.kind} size={30} />
                <View style={s.flex}>
                  <Copy bold size={10}>
                    {device.name}
                  </Copy>
                  <Copy size={9} color={device.enabled ? c.green : c.muted}>
                    ● {device.enabled ? 'Connected' : 'Paused'}
                  </Copy>
                  <Copy size={8} color={c.muted}>
                    Last sync: {device.sync}
                  </Copy>
                </View>
              </View>
            </Card>
          ))}
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
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginTop: 0,
    minHeight: 122,
    padding: 14,
    borderWidth: 0,
  },
  insight: {
    backgroundColor: '#eaf2ff',
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    marginTop: 0,
    padding: 12,
    borderWidth: 0,
  },
  heroStack: { gap: 10, marginTop: 14 },
  metrics: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  mini: {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 6,
    minHeight: 76,
    borderRadius: 12,
  },
  miniDesktop: { flexBasis: '30%', padding: 20, minHeight: 126, gap: 16 },
  miniAccessible: { flexBasis: '100%' },
  emptyCare: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 104 },
  alert: { backgroundColor: '#fff8ef', borderColor: '#ffe5c2', marginTop: 10 },
  alertAction: { marginTop: 10, minHeight: 34, borderColor: c.border },
  white: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  desktopHealth: { minHeight: 188, padding: 28, gap: 28 },
  desktopInsight: { padding: 22, alignItems: 'center' },
  desktopLower: { flexDirection: 'row', alignItems: 'stretch', gap: 20 },
  desktopLowerCard: { flex: 1, padding: 18, borderRadius: 18 },
});
