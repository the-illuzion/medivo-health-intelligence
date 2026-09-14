import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Icon,
  PageHeading,
  Row,
  Section,
  Tile,
  s,
} from '../components/UI';
import { ScanPortrait } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { colors as c, designRoutes } from '../tokens';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import { formatHealthLastSync } from '../../../services/health/healthDisplay';

export default function Scan() {
  const p = usePreview();
  const desktop = useDesktop();
  const router = useRouter();
  const { connection } = useHealthSummary('day');

  return (
    <Screen>
      <PageHeading title="Start a Scan" subtitle="Capture a new scan or add supporting health data." />

      <View style={[st.scan, desktop && st.desktopScan]}>
        <ScanPortrait />
        <View style={st.label}>
          <Chip tone="blue" icon="camera">Face Scan</Chip>
        </View>
        <Action style={st.scanButton} onPress={() => router.push('/(tabs)/scan')}>
          <Icon name="camera" color={c.white} />
          <Copy bold size={15} color={c.white}>Begin Face Scan</Copy>
        </Action>
        <Copy size={10} color={c.muted} style={{ textAlign: 'center', marginVertical: 8 }}>
          Position your face in the frame
        </Copy>
      </View>

      <Section title="Other ways to add health data">
        <View style={s.grid2}>
          {[
            {
              title: 'Vitals Check',
              sub: 'Measure key vitals',
              icon: 'heartpulse',
              tone: 'green' as const,
            },
            {
              title: 'Upload Photo',
              sub: 'Add lab results or notes',
              icon: 'image',
              tone: 'blue' as const,
            },
            {
              title: 'Manual Entry',
              sub: 'Log data manually',
              icon: 'file',
              tone: 'orange' as const,
            },
            {
              title: 'Connect Device',
              sub: 'Sync from your device',
              icon: 'watch',
              tone: 'purple' as const,
            },
          ].map((item) => (
            <View key={item.title} style={s.half}>
              <Row
                compact
                title={item.title}
                description={item.sub}
                icon={item.icon}
                tone={item.tone}
                onPress={() =>
                  item.title === 'Connect Device'
                    ? router.push(designRoutes.devices)
                    : p.openDetail(item.title)
                }
              />
            </View>
          ))}
        </View>
      </Section>

      <Section
        title="Recent data sources"
        action="Manage"
        onAction={() => router.push(designRoutes.devices)}
      >
        <Card style={{ padding: 9 }} onPress={() => router.push(designRoutes.devices)}>
          <View style={[s.row, { gap: 8 }]}>
            <Tile name="heart" tone="red" size={30} />
            <View style={s.flex}>
              <Copy size={10} bold>Apple Health</Copy>
              <Copy size={9} color={connection ? c.green : c.muted}>
                ● {connection ? 'Connected' : 'Not connected'}
              </Copy>
              <Copy size={8} color={c.muted}>
                Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}
              </Copy>
            </View>
          </View>
        </Card>
      </Section>

      <Section title="How it works">
        <Card style={s.grid3}>
          {[
            { title: 'Capture', sub: 'Take a quick scan', icon: 'camera' },
            { title: 'Analyze', sub: 'Analyze your capture', icon: 'chart' },
            { title: 'Review', sub: 'See your scan results', icon: 'file' },
          ].map((item, i) => (
            <View key={item.title} style={[s.third, s.center, { gap: 5 }]}>
              <View style={s.row}>
                <Copy color={c.muted}>{i + 1}</Copy>
                <Icon name={item.icon} />
              </View>
              <Copy size={12} bold>{item.title}</Copy>
              <Copy size={10} color={c.muted} style={{ textAlign: 'center' }}>{item.sub}</Copy>
            </View>
          ))}
        </Card>
      </Section>

      <View style={{ marginTop: 12 }}>
        <Row
          title="Your health data stays protected"
          description="You choose what to share. Your health data stays private and protected."
          icon="shield"
          tone="green"
          onPress={() => router.push(designRoutes.devices)}
        />
      </View>

      <DemoNote text="Vitals Check, Upload Photo and Manual Entry are previews." />
    </Screen>
  );
}

const st = StyleSheet.create({
  scan: {
    backgroundColor: '#e8f2ff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d3e5fc',
    overflow: 'hidden',
  },
  desktopScan: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  label: { position: 'absolute', top: 10, right: 10 },
  scanButton: { marginHorizontal: 16, borderRadius: 50, backgroundColor: '#102957', marginTop: -4 },
});
