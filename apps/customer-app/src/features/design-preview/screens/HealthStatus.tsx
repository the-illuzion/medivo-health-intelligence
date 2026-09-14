import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Action,
  Card,
  Copy,
  Dots,
  Heading,
  Icon,
  IconButton,
  Tile,
  s,
} from '../components/UI';
import { WellnessIllustration } from '../components/Illustrations';
import { colors as c, designRoutes } from '../tokens';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import {
  formatHealthLastSync,
  formatMetricValue,
  metricContextLabel,
} from '../../../services/health/healthDisplay';
import type { HealthMetricType } from '../../../services/health/healthApi';

type StatusSlide = {
  key: string;
  title: string;
  description: string;
  icon: string;
  tone: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  metrics: HealthMetricType[];
};

const SLIDES: readonly StatusSlide[] = [
  {
    key: 'overview',
    title: 'Apple Health Today',
    description: 'A read-only view of the HealthKit categories Medivo has synced for today.',
    icon: 'heart',
    tone: 'blue',
    metrics: [],
  },
  {
    key: 'heart',
    title: 'Heart Readings',
    description: 'Latest heart-related readings available from Apple Health today.',
    icon: 'heartpulse',
    tone: 'red',
    metrics: ['heart_rate', 'resting_heart_rate', 'heart_rate_variability_sdnn'],
  },
  {
    key: 'activity',
    title: 'Activity',
    description: 'Activity totals synced from Apple Health for today.',
    icon: 'activity',
    tone: 'green',
    metrics: ['step_count', 'active_energy_burned'],
  },
  {
    key: 'recovery',
    title: 'Sleep & Recovery Data',
    description: 'Sleep duration and HRV data available from Apple Health today.',
    icon: 'moon',
    tone: 'purple',
    metrics: ['sleep_analysis', 'heart_rate_variability_sdnn'],
  },
] as const;

const LABELS: Record<HealthMetricType, string> = {
  step_count: 'Steps',
  heart_rate: 'Heart Rate',
  resting_heart_rate: 'Resting Heart Rate',
  active_energy_burned: 'Active Energy',
  sleep_analysis: 'Sleep',
  heart_rate_variability_sdnn: 'HRV',
};

export default function HealthStatus() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && windowWidth >= 900;
  const [width, setWidth] = useState(Math.min(windowWidth, 760));
  const [index, setIndex] = useState(0);
  const ref = useRef<ScrollView>(null);
  const { connection, metrics, isLoading, error, refresh } = useHealthSummary('day');

  const availableCount = useMemo(
    () => SLIDES.slice(1).flatMap((slide) => slide.metrics).filter((type, position, all) => all.indexOf(type) === position && metrics.has(type)).length,
    [metrics],
  );

  const go = (nextIndex: number) => {
    setIndex(nextIndex);
    ref.current?.scrollTo({ x: nextIndex * width, animated: true });
  };

  return (
    <View
      style={st.root}
      onLayout={(event) => setWidth(Math.min(event.nativeEvent.layout.width, 760))}
    >
      <View style={st.header}>
        <IconButton
          name="back"
          label="Back to home"
          onPress={() => router.replace(designRoutes.home)}
        />
        <Heading size={18} style={s.flex}>Your Health Status</Heading>
      </View>

      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        style={[s.flex, st.carousel, desktop && st.desktopCarousel]}
      >
        {SLIDES.map((slide, slideIndex) => (
          <ScrollView
            key={slide.key}
            style={{ width }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.slide}
          >
            <View style={st.counter}>
              <Copy bold size={16}>{slideIndex + 1} / {SLIDES.length}</Copy>
            </View>

            <View style={st.heroIcon}>
              <WellnessIllustration kind={['meditate', 'shield', 'celebrate', 'checklist'][slideIndex]} />
            </View>
            <Heading size={slideIndex === 0 ? 34 : 29} style={st.title}>{slide.title}</Heading>
            <Copy size={15} color={c.muted} style={st.description}>{slide.description}</Copy>

            {isLoading ? (
              <View style={st.loading}>
                <ActivityIndicator />
                <Copy size={10} color={c.muted} style={s.top4}>Loading Apple Health data…</Copy>
              </View>
            ) : error ? (
              <Card style={{ backgroundColor: c.redSoft, borderColor: c.red }}>
                <Copy bold size={11} color={c.red}>Couldn’t load Apple Health data</Copy>
                <Copy size={10} color={c.muted} style={s.top4}>{error}</Copy>
                <Action secondary style={{ marginTop: 8 }} onPress={() => void refresh()}>Retry</Action>
              </Card>
            ) : !connection ? (
              <Card style={{ backgroundColor: c.blueSoft }}>
                <Copy bold>Apple Health is not connected</Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  Connect Apple Health to populate this page with your synced readings.
                </Copy>
                <Action style={{ marginTop: 10 }} onPress={() => router.push(designRoutes.devices)}>
                  Connect Apple Health
                </Action>
              </Card>
            ) : slide.key === 'overview' ? (
              <Card style={{ backgroundColor: c.greenSoft }}>
                <Copy bold size={13} color={c.green}>● Apple Health connected</Copy>
                <Copy size={11} color={c.muted} style={s.top4}>
                  {availableCount} of 6 supported categories have data today.
                </Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  Last sync: {formatHealthLastSync(connection.lastSyncedAt)}
                </Copy>
                <Action secondary style={{ marginTop: 10 }} onPress={() => router.push(designRoutes.metrics)}>
                  View all readings
                </Action>
              </Card>
            ) : (
              <View style={st.metricList}>
                {slide.metrics.map((type) => {
                  const metric = metrics.get(type);
                  const formatted = formatMetricValue(metric);
                  return (
                    <Card
                      key={type}
                      onPress={() => router.push({ pathname: designRoutes.metric, params: { type } })}
                      style={st.metricCard}
                    >
                      <View style={s.flex}>
                        <Copy size={11} color={c.muted}>{LABELS[type]}</Copy>
                        <Copy size={20} bold style={s.top4}>
                          {formatted.value}{formatted.unit ? <Copy size={12}> {formatted.unit}</Copy> : null}
                        </Copy>
                        <Copy size={9} color={c.muted} style={s.top4}>
                          {metricContextLabel(metric, 'day')}
                        </Copy>
                      </View>
                      <Icon name="chevron" size={16} color={c.muted} />
                    </Card>
                  );
                })}
              </View>
            )}

            <Card style={st.notice}>
              <Icon name="info" color={c.blue} />
              <Copy size={10} color={c.muted} style={s.flex}>
                These are synced measurements, not a diagnosis or a medical assessment. A personal baseline is needed to put them in context.
              </Copy>
            </Card>
          </ScrollView>
        ))}
      </ScrollView>

      <View style={[st.footer, desktop && st.desktopFooter]}>
        <Dots count={SLIDES.length} index={index} onChange={go} />
        <Action
          style={st.next}
          onPress={() => (index === SLIDES.length - 1 ? router.replace(designRoutes.home) : go(index + 1))}
        >
          <Copy size={18} bold color="white">{index === SLIDES.length - 1 ? 'Done' : 'Next'}</Copy>
          <Icon name="arrow" size={22} color="white" />
        </Action>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white' },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35,
  },
  slide: { paddingHorizontal: 19, paddingTop: 9, paddingBottom: 14 },
  counter: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 25,
    backgroundColor: '#f0f2f6',
    marginBottom: 14,
  },
  heroIcon: { alignItems: 'center', alignSelf: 'center', width: '100%', maxWidth: 400, marginTop: 4 },
  title: { color: c.navy, textAlign: 'center', marginTop: 15 },
  description: { textAlign: 'center', marginTop: 10, marginBottom: 18, lineHeight: 22 },
  loading: { alignItems: 'center', paddingVertical: 28 },
  metricList: { gap: 8 },
  metricCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  notice: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: c.blueSoft,
    borderColor: c.border,
  },
  footer: { paddingHorizontal: 19, paddingBottom: 12 },
  next: { backgroundColor: '#19465f', borderRadius: 40, gap: 20 },
  carousel: { width: '100%', maxWidth: 760, alignSelf: 'center' },
  desktopCarousel: { width: 760, alignSelf: 'center' },
  desktopFooter: { width: 760, alignSelf: 'center' },
});
