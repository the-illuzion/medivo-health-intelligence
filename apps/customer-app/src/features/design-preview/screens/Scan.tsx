import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  PageHeading,
  Row,
  Section,
  s,
} from '../components/UI';
import { DeviceArt, ScanPortrait } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { colors as c, designRoutes } from '../tokens';
export default function Scan() {
  const p = usePreview();
  const router = useRouter();
  return (
    <Screen>
      <PageHeading
        title="Start a Scan"
        subtitle="Capture a new scan or add supporting health data."
      />
      <View style={st.scan}>
        <ScanPortrait />
        <View style={st.label}>
          <Chip tone="blue" icon="camera">
            Face Scan
          </Chip>
        </View>
        <Action style={st.scanButton} onPress={() => p.setSheet({ kind: 'scan' })}>
          <Icon name="camera" color="white" />
          <Copy bold size={15} color="white">
            Begin Face Scan
          </Copy>
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
        action="See all"
        onAction={() => p.openDetail('Recent data sources')}
      >
        <View style={s.grid3}>
          {['Apple Watch', 'BP Monitor', p.recentSource].map((title, i) => (
            <Card
              key={i}
              style={[s.third, { padding: 8 }]}
              onPress={() =>
                i < 2 ? router.push(designRoutes.devices) : p.openDetail('Recent data sources')
              }
            >
              <View style={[s.row, { gap: 5 }]}>
                {i < 2 ? (
                  <DeviceArt kind={i === 0 ? 'watch' : 'monitor'} size={25} />
                ) : (
                  <Icon name="file" color={c.red} />
                )}
                <View style={s.flex}>
                  <Copy size={9} bold>
                    {title}
                  </Copy>
                  <Copy size={8} color={c.muted}>
                    {i === 0
                      ? 'Last synced 2h ago'
                      : i === 1
                        ? 'Last synced 1d ago'
                        : p.recentSource === 'Uploaded PDF'
                          ? 'Added 3d ago'
                          : 'Added just now'}
                  </Copy>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </Section>
      <Section title="How it works">
        <Card style={s.grid3}>
          {[
            { title: 'Capture', sub: 'Take a quick scan', icon: 'camera' },
            { title: 'Analyze', sub: 'AI reviews your data', icon: 'chart' },
            { title: 'Review', sub: 'See insights in seconds', icon: 'file' },
          ].map((item, i) => (
            <View key={item.title} style={[s.third, s.center, { gap: 5 }]}>
              <View style={s.row}>
                <Copy color={c.muted}>{i + 1}</Copy>
                <Icon name={item.icon} />
              </View>
              <Copy size={12} bold>
                {item.title}
              </Copy>
              <Copy size={10} color={c.muted} style={{ textAlign: 'center' }}>
                {item.sub}
              </Copy>
            </View>
          ))}
        </Card>
      </Section>
      <View style={{ marginTop: 12 }}>
        <Row
          title="Your health data stays protected"
          description="Encrypted, private, and never shared without your consent."
          icon="shield"
          tone="green"
          onPress={() => p.openDetail('Privacy & Permissions')}
        />
      </View>
      <DemoNote text="Simulated scan and sample uploads only. No camera, files, or medical analysis are used." />
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
  label: { position: 'absolute', top: 10, right: 10 },
  scanButton: { marginHorizontal: 16, borderRadius: 50, backgroundColor: '#102957', marginTop: -4 },
});
