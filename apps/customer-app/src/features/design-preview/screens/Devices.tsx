import React, { useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { colors as c, designRoutes } from '../tokens';

function Sharing({ items }: { items: string[] }) {
  return (
    <View style={s.wrap}>
      {items.map((item) => (
        <Chip
          key={item}
          tone={
            item === 'Sleep' || item === 'Glucose'
              ? 'purple'
              : item === 'Blood Pressure'
                ? 'green'
                : item === 'Heart Rate'
                  ? 'red'
                  : 'blue'
          }
          icon={
            item === 'Sleep'
              ? 'moon'
              : item === 'Activity'
                ? 'activity'
                : item === 'Notifications'
                  ? 'bell'
                  : item === 'Heart Rate'
                    ? 'heart'
                    : 'drop'
          }
        >
          {item}
        </Chip>
      ))}
    </View>
  );
}

export default function Devices() {
  const router = useRouter();
  const desktop = useDesktop();
  const { devices, ringConnected, toggleDeviceSync, setRingConnected, fetchDevices } = useDevicesStore();
  const { openDetail } = useSheetStore();

  useEffect(() => {
    fetchDevices();
  }, []);

  const activeCount = devices.filter((d) => d.enabled).length + (ringConnected ? 1 : 0);

  return (
    <Screen>
      <PageHeading
        title="Manage Devices"
        subtitle="Connect and manage your health devices in one place. Keep your data synced for better insights."
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.profile))}
      />
      <Card style={[s.row, { backgroundColor: c.blueSoft }]}>
        <Tile name="phone" size={48} />
        <View style={s.flex}>
          <Heading size={19}>{activeCount} devices connected</Heading>
          <Copy color={c.muted} style={s.top4}>
            ↻ Live continuous background sync active
          </Copy>
          <Copy color={c.green}>✓ All critical telemetry sources active</Copy>
          <Copy size={11} color={c.muted}>
            Your devices are streaming vital signs securely to your Medivo clinical vault.
          </Copy>
        </View>
      </Card>

      <View style={desktop ? st.desktopDevicesGrid : undefined}>
        <View style={desktop ? st.desktopCol : undefined}>
          <View style={[s.panel, { backgroundColor: c.greenSoft }]}>
            <Heading size={17}>Connected Devices ({devices.filter((d) => d.enabled).length})</Heading>
            <Copy size={12} color={c.muted}>
              ● Devices are syncing and working properly.
            </Copy>
          </View>
          {devices.map((d) => (
            <Card key={d.id || d.name} style={{ marginTop: 7 }}>
              <View style={[s.row, { gap: 8, marginBottom: 10 }]}>
                <DeviceArt kind={d.kind} size={42} />
                <View style={s.flex}>
                  <Heading size={14}>{d.name}</Heading>
                  <Copy size={11} color={d.enabled ? c.green : c.muted}>
                    ● {d.enabled ? 'Connected' : 'Sync paused'}
                  </Copy>
                  <Copy size={10} color={c.muted}>
                    Last sync: {d.sync}
                  </Copy>
                </View>
                <View>
                  <View style={[s.row, { gap: 3 }]}>
                    <Icon name="battery" size={16} color={c.green} />
                    <Copy size={10}>{d.batteryLevel || 78}%</Copy>
                  </View>
                  <Copy size={9} color={c.muted}>
                    {d.batteryStatus || '~ 1 day left'}
                  </Copy>
                </View>
                <Switch
                  thumbColor="white"
                  accessibilityLabel={`${d.name} sync`}
                  value={d.enabled}
                  trackColor={{ false: '#c9d3df', true: c.blue }}
                  onValueChange={() => toggleDeviceSync(d.id || d.name)}
                />
              </View>
              <Copy size={10} color={c.muted} style={{ marginBottom: 5 }}>
                Data shared with Medivo
              </Copy>
              <Sharing items={d.sharing} />
            </Card>
          ))}

          <View style={[s.panel, { backgroundColor: ringConnected ? c.greenSoft : c.redSoft, marginTop: 14 }]}>
            <Heading size={17}>{ringConnected ? 'Reconnected (1)' : 'Needs Attention (1)'}</Heading>
            <Copy size={12} color={c.muted}>
              {ringConnected ? 'Your ring is syncing again.' : '● Action required to resume syncing.'}
            </Copy>
          </View>
          <Card style={{ marginTop: 7 }}>
            <View style={s.row}>
              <DeviceArt kind="ring" size={42} />
              <View style={s.flex}>
                <Heading size={14}>Oura Ring</Heading>
                <Copy size={11} color={ringConnected ? c.green : c.orange}>
                  ● {ringConnected ? 'Connected' : 'Action required'}
                </Copy>
                <Copy size={10} color={c.muted}>
                  Last sync: {ringConnected ? 'Just now' : '1 day ago'}
                </Copy>
              </View>
              <Action
                onPress={() => setRingConnected(!ringConnected)}
                style={{ minHeight: 34, paddingHorizontal: 9 }}
              >
                {ringConnected ? 'Disconnect' : 'Reconnect'}
              </Action>
            </View>
            {!ringConnected && (
              <View style={[s.panel, { backgroundColor: c.orangeSoft }]}>
                <View style={s.row}>
                  <Icon name="alert" color={c.orange} />
                  <View style={s.flex}>
                    <Copy size={11} bold color="#cc6716">
                      Background sync permission required
                    </Copy>
                    <Copy size={10} color={c.muted}>
                      Enable background app refresh to keep your data in sync and get the latest
                      insights.
                    </Copy>
                  </View>
                </View>
                <Action
                  secondary
                  style={{ marginTop: 8, minHeight: 34 }}
                  onPress={() => openDetail('Background sync settings')}
                >
                  Open Settings
                </Action>
              </View>
            )}
            <Copy size={10} color={c.muted} style={{ marginTop: 10, marginBottom: 5 }}>
              Data shared with Medivo
            </Copy>
            <Sharing items={['Sleep', 'Activity', 'Heart Rate']} />
          </Card>
        </View>

        <View style={desktop ? st.desktopCol : undefined}>
          <Section title="Add a new device" style={[s.panel, { marginTop: desktop ? 0 : 14 }]}>
            <Copy color={c.muted}>
              Connect your favorite devices to get a complete picture of your health.
            </Copy>
            <View style={[s.grid3, { marginTop: 9 }]}>
              {['Apple Health', 'Fitbit', 'Garmin'].map((title, i) => (
                <Card
                  key={title}
                  style={[s.third, { padding: 9 }]}
                  onPress={() =>
                    router.push({ pathname: designRoutes.connect, params: { device: title } })
                  }
                >
                  <Tile
                    name={i === 0 ? 'heart' : i === 1 ? 'activity' : 'watch'}
                    tone={i === 0 ? 'red' : 'blue'}
                    size={30}
                  />
                  <Copy bold size={12} style={s.top4}>
                    {title}
                  </Copy>
                  <Copy size={10} color={c.muted}>
                    {
                      [
                        'Sync health data from your iPhone',
                        'Track activity, sleep and more',
                        'Connect your Garmin device',
                      ][i]
                    }
                  </Copy>
                </Card>
              ))}
            </View>
            <Action
              secondary
              style={{ marginTop: 12 }}
              onPress={() => router.push(designRoutes.connect)}
            >
              Connect Apple Watch
            </Action>
          </Section>
        </View>
      </View>
      <DemoNote text="Live device telemetry management with real-time sync control." />
    </Screen>
  );
}

export function ConnectDevice() {
  const { device: requested } = useLocalSearchParams<{ device?: string }>();
  const device = requested || 'Apple Watch';
  const router = useRouter();
  const { devices, connectDevice } = useDevicesStore();
  const { openSheet, openDetail } = useSheetStore();

  const connected = devices.some((d) => d.name === device && d.sync === 'Just now');

  return (
    <Screen>
      <PageHeading
        title=""
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.devices))}
      />
      <View style={[s.row, { alignItems: 'center', marginBottom: 12 }]}>
        <DeviceArt size={135} />
        <View style={s.flex}>
          <Heading size={20}>{device === 'Apple Watch' ? '● WATCH' : device}</Heading>
          <Heading size={22} style={{ marginVertical: 7 }}>
            Connect {device}
          </Heading>
          <Copy color={c.muted}>
            Sync your health data from {device} to get a more complete picture of your health, all
            in one place.
          </Copy>
          <View style={[s.wrap, { marginTop: 8 }]}>
            <Chip icon="shield">Secure & Private</Chip>
            <Chip icon="link" tone="blue">
              Health integration
            </Chip>
          </View>
        </View>
      </View>
      <Section title="What will sync?" style={s.panel}>
        <Copy color={c.muted}>Get insights from the data you already track.</Copy>
        <View style={[s.grid3, { marginTop: 10 }]}>
          {[
            {
              title: 'Heart Rate',
              icon: 'heart',
              tone: 'red' as const,
              text: 'Resting, active and workout heart rate',
            },
            {
              title: 'Sleep',
              icon: 'moon',
              tone: 'purple' as const,
              text: 'Sleep duration and sleep stages',
            },
            {
              title: 'Activity',
              icon: 'activity',
              tone: 'blue' as const,
              text: 'Steps, active minutes and workout data',
            },
          ].map((item) => (
            <Card key={item.title} style={[s.third, { padding: 10 }]}>
              <Tile name={item.icon} tone={item.tone} />
              <Copy bold style={{ marginTop: 8 }}>
                {item.title}
              </Copy>
              <Copy size={11} color={c.muted}>
                {item.text}
              </Copy>
            </Card>
          ))}
        </View>
      </Section>
      <Section title="How it works" style={s.panel}>
        <Copy color={c.muted}>Get connected in just a few simple steps.</Copy>
        <Card style={{ marginTop: 10, gap: 15 }}>
          {[
            {
              title: `Open the ${device === 'Apple Watch' ? 'Apple Health' : device} app`,
              text: 'You’ll be redirected to grant access.',
            },
            {
              title: 'Allow Medivo to access your data',
              text: 'Choose the health data you’d like to share.',
            },
            {
              title: 'Start syncing',
              text: 'Your data will sync automatically in the background.',
            },
          ].map((item, i) => (
            <View style={s.row} key={item.title}>
              <Chip tone="blue">{i + 1}</Chip>
              <View style={s.flex}>
                <Copy bold>{item.title}</Copy>
                <Copy size={11} color={c.muted}>
                  {item.text}
                </Copy>
              </View>
            </View>
          ))}
        </Card>
      </Section>
      <View style={{ marginTop: 12 }}>
        <Row
          title="Your data stays private"
          description="We only access the data you allow, and it’s always encrypted and secure. You can change permissions anytime in Settings."
          icon="lock"
          tone="green"
          onPress={() => openDetail('Privacy & Permissions')}
        />
        <Row
          title="Keeps syncing automatically"
          description="Once connected, your device will sync regularly in the background whenever it is nearby."
          icon="sync"
          onPress={() => openDetail('Automatic sync')}
        />
      </View>
      <DemoNote text="Live device connection and telemetry synchronization." />
      <Action
        style={{ marginTop: 12 }}
        onPress={async () => {
          if (connected) {
            router.replace(designRoutes.devices);
          } else {
            await connectDevice(device);
            openSheet({ kind: 'connection', title: device });
          }
        }}
      >
        {connected ? 'Connected · View devices' : 'Connect now'}
      </Action>
      <Action secondary style={{ marginTop: 8 }} onPress={() => openDetail('Device connection')}>
        Learn more
      </Action>
    </Screen>
  );
}

const st = StyleSheet.create({
  desktopDevicesGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopCol: {
    flex: 1,
  },
});
