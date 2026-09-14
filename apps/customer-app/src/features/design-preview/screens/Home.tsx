import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { apiClient } from '@medivo/api-client';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  Section,
  Tile,
  s,
} from '../components/UI';
import { colors as c, designRoutes } from '../tokens';
import { useAuthStore } from '../../../store/useAuthStore';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import {
  HEALTH_METRIC_DISPLAY,
  formatHealthLastSync,
  formatMetricValue,
  metricContextLabel,
} from '../../../services/health/healthDisplay';

type RoutineStep = {
  id: string;
  title: string;
  desc?: string;
  completed?: boolean;
};

type Routine = {
  id: string;
  name?: string;
  timing?: string;
  steps?: RoutineStep[];
};

export default function Home() {
  const router = useRouter();
  const compact = useCompact();
  const desktop = useDesktop();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { connection, metrics, isLoading, error, refresh } = useHealthSummary('day');
  const [routines, setRoutines] = useState<Routine[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadRoutines = async () => {
        if (!token) {
          if (active) setRoutines([]);
          return;
        }

        try {
          apiClient.setAuthToken(token);
          const data = await apiClient.routines.list();
          if (active) setRoutines((data || []) as Routine[]);
        } catch {
          if (active) setRoutines([]);
        }
      };

      void loadRoutines();
      return () => {
        active = false;
      };
    }, [token]),
  );

  const careItems = useMemo(
    () =>
      routines
        .flatMap((routine) =>
          (routine.steps || []).map((step) => ({
            ...step,
            routineId: routine.id,
            timing: routine.timing || routine.name || 'Care plan',
          })),
        )
        .slice(0, 3),
    [routines],
  );

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';
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

  return (
    <Screen>
      <View style={st.greeting}>
        <Heading size={19}>{greeting}, {firstName}</Heading>
        <Copy size={10} color={c.muted}>{today}</Copy>
      </View>
      <Copy color={c.muted}>Here’s your health overview for today.</Copy>

      <View style={desktop && st.desktopHero}>
        <Card
          onPress={() => router.push(designRoutes.metrics)}
          label="Apple Health status"
          style={[
            st.health,
            { backgroundColor: connection ? c.greenSoft : c.blueSoft },
            desktop && st.desktopHeroCard,
          ]}
        >
          <Tile name={connection ? 'done' : 'heart'} tone={connection ? 'green' : 'blue'} size={48} />
          <View style={s.flex}>
            <Copy>Apple Health</Copy>
            <View style={[s.row, { marginVertical: 5 }]}>
              <Heading size={22} style={{ color: connection ? c.green : c.blue }}>
                {connection ? (hasHealthData ? 'Health data synced' : 'Connected') : 'Not connected'}
              </Heading>
            </View>
            <Copy size={11} color={c.muted}>
              {connection
                ? hasHealthData
                  ? `${metrics.size} HealthKit categories have data today. Last sync: ${formatHealthLastSync(connection.lastSyncedAt)}.`
                  : `Apple Health is connected. Last sync: ${formatHealthLastSync(connection.lastSyncedAt)}.`
                : 'Connect Apple Health to show your real health readings here.'}
            </Copy>
          </View>
          <Icon name="chevron" size={17} />
        </Card>

        <Card
          onPress={() => router.push(designRoutes.metrics)}
          label="Apple Health snapshot"
          style={[st.insight, desktop && st.desktopHeroCard]}
        >
          <Tile name="bulb" />
          <View style={s.flex}>
            <Copy size={11} color={c.blue} bold>Today from Apple Health</Copy>
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
          <Copy bold size={11} color={c.red}>Couldn’t load Apple Health data</Copy>
          <Copy size={10} color={c.muted} style={s.top4}>{error}</Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>Retry</Action>
        </Card>
      ) : null}

      <Section title="Key Health Metrics" action="View All" onAction={() => router.navigate(designRoutes.metrics)}>
        <View style={st.metrics}>
          {HEALTH_METRIC_DISPLAY.map((definition) => {
            const metric = metrics.get(definition.type);
            const formatted = formatMetricValue(metric);
            return (
              <Card
                key={definition.type}
                onPress={() => router.push({ pathname: designRoutes.metric, params: { type: definition.type } })}
                label={`${definition.name} details`}
                style={[st.mini, compact && { width: '48%' }]}
              >
                <Tile name={definition.icon} tone={definition.tone} size={27} />
                <View style={s.flex}>
                  <Copy size={9} color={c.muted}>{definition.shortName}</Copy>
                  <Copy size={13} bold>
                    {formatted.value}<Copy size={8}> {formatted.unit}</Copy>
                  </Copy>
                  <Copy size={8} color={c.muted}>{metricContextLabel(metric, 'day')}</Copy>
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
                Apple Health recorded {formatMetricValue(restingHeartRate).value} bpm. We don’t label this as high or low until a real personal baseline is available.
              </Copy>
            </View>
          </View>
          <Action secondary style={st.alertAction} onPress={() => router.push({ pathname: designRoutes.metric, params: { type: 'resting_heart_rate' } })}>
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
                <Card key={`${item.routineId}-${item.id}`} onPress={() => router.navigate(designRoutes.care)} style={s.third}>
                  <Tile name="check" size={32} tone={item.completed ? 'green' : 'blue'} />
                  <Copy bold size={11} style={{ marginTop: 7 }}>{item.title}</Copy>
                  <Copy size={10} color={c.muted} style={s.top4}>{item.desc || item.timing}</Copy>
                  <View style={{ marginTop: 7 }}>
                    <Chip tone={item.completed ? 'green' : 'blue'} icon={item.completed ? 'done' : 'clock'}>
                      {item.completed ? 'Completed' : 'Pending'}
                    </Chip>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Copy size={10} color={c.muted}>No routine tasks are available right now.</Copy>
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
                <Copy bold size={10}>Apple Health</Copy>
                <Copy size={9} color={connection ? c.green : c.muted}>
                  ● {connection ? 'Connected' : 'Not connected'}
                </Copy>
                <Copy size={8} color={c.muted}>Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}</Copy>
              </View>
            </View>
          </Card>
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
    minHeight: 70,
    borderRadius: 10,
  },
  alert: { backgroundColor: '#fff8ef', borderColor: '#ffe5c2', marginTop: 10 },
  alertAction: { marginTop: 10, minHeight: 34, borderColor: c.border },
  white: { backgroundColor: 'white', padding: 10, borderRadius: 12 },
  desktopHero: { flexDirection: 'row', gap: 16, marginTop: 16 },
  desktopHeroCard: { flex: 1, marginTop: 0 },
  desktopLower: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  desktopLowerCard: { flex: 1 },
});
