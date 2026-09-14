import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
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
import { useSheetStore } from '../../../store/useSheetStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { colors as c, designRoutes } from '../tokens';

export default function Scan() {
  const router = useRouter();
  const desktop = useDesktop();
  const { openSheet, openDetail } = useSheetStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { profile, fetchProfile } = useHealthProfileStore();

  useEffect(() => {
    fetchDevices();
    fetchProfile();
  }, []);

  const recentDoc = profile.healthRecords?.[0]?.title || 'Uploaded Lab Report';

  return (
    <Screen>
      <PageHeading
        title="Start a Scan"
        subtitle="Capture a new optical AI scan or add supporting health data."
      />
      <View style={desktop ? st.desktopHeroGrid : undefined}>
        <View style={[st.scan, desktop && st.desktopScanCard]}>
          <ScanPortrait />
          <View style={st.label}>
            <Chip tone="blue" icon="camera">
              Face Scan
            </Chip>
          </View>
          <Action style={st.scanButton} onPress={() => openSheet({ kind: 'scan' })}>
            <Icon name="camera" color="white" />
            <Copy bold size={15} color="white">
              Begin Face Scan
            </Copy>
          </Action>
          <Copy size={10} color={c.muted} style={{ textAlign: 'center', marginVertical: 8 }}>
            Position your face in the frame
          </Copy>
        </View>

        <Section
          title="Other ways to add health data"
          style={desktop ? st.desktopMethodsCard : undefined}
        >
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
                      : openDetail(item.title)
                  }
                />
              </View>
            ))}
          </View>
        </Section>
      </View>

      <View style={desktop ? st.desktopLowerGrid : undefined}>
        <Section
          title="Recent data sources"
          action="See all"
          onAction={() => openDetail('Recent data sources')}
          style={desktop ? st.desktopLowerCard : undefined}
        >
          <View style={s.grid3}>
            {devices.slice(0, 2).map((device) => (
              <Card
                key={device.id || device.name}
                style={[s.third, { padding: 8 }]}
                onPress={() => router.push(designRoutes.devices)}
              >
                <View style={[s.row, { gap: 5 }]}>
                  <DeviceArt kind={device.kind} size={25} />
                  <View style={s.flex}>
                    <Copy size={9} bold>
                      {device.name}
                    </Copy>
                    <Copy size={8} color={c.muted}>
                      Last sync: {device.sync}
                    </Copy>
                  </View>
                </View>
              </Card>
            ))}
            <Card
              style={[s.third, { padding: 8 }]}
              onPress={() => openDetail('Recent data sources')}
            >
              <View style={[s.row, { gap: 5 }]}>
                <Icon name="file" color={c.red} />
                <View style={s.flex}>
                  <Copy size={9} bold>
                    {recentDoc}
                  </Copy>
                  <Copy size={8} color={c.muted}>
                    Recently added
                  </Copy>
                </View>
              </View>
            </Card>
          </View>
        </Section>

        <Section
          title="How it works"
          style={desktop ? st.desktopLowerCard : undefined}
        >
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
      </View>

      <View style={{ marginTop: 12 }}>
        <Row
          title="Your health data stays protected"
          description="Encrypted, private, and never shared without your consent."
          icon="shield"
          tone="green"
          onPress={() => openDetail('Privacy & Permissions')}
        />
      </View>
      <DemoNote text="Live optical vital scan and biomarker analysis with real-time biometric consent." />
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
  desktopHeroGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopScanCard: {
    flex: 1,
  },
  desktopMethodsCard: {
    flex: 1.2,
    marginTop: 0,
  },
  desktopLowerGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopLowerCard: {
    flex: 1,
    marginTop: 0,
  },
});
