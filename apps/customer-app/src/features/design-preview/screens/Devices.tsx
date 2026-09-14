import React from 'react';
import { View, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
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
  const p = usePreview();
  const router = useRouter();
  const count = p.devices.filter((d) => d.enabled).length + (p.ringConnected ? 1 : 0);
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
          <Heading size={19}>{count} devices connected</Heading>
          <Copy color={c.muted} style={s.top4}>
            ↻ Last sync: 6 min ago
          </Copy>
          <Copy color={c.green}>✓ All critical sources active</Copy>
          <Copy size={11} color={c.muted}>
            Your devices are working well and keeping your health data up to date.
          </Copy>
        </View>
      </Card>
      <View style={[s.panel, { backgroundColor: c.greenSoft }]}>
        <Heading size={17}>Connected ({p.devices.filter((d) => d.enabled).length})</Heading>
        <Copy size={12} color={c.muted}>
          ● Devices are syncing and working properly.
        </Copy>
      </View>
      {p.devices.map((d, i) => (
        <Card key={d.name} style={{ marginTop: 7 }}>
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
                <Copy size={10}>78%</Copy>
              </View>
              <Copy size={9} color={c.muted}>
                ~ 1 day left
              </Copy>
            </View>
            <Switch
              thumbColor="white"
              accessibilityLabel={`${d.name} sync`}
              value={d.enabled}
              trackColor={{ false: '#c9d3df', true: c.blue }}
              onValueChange={(enabled) =>
                p.setDevices((current) =>
                  current.map((item, j) => (i === j ? { ...item, enabled } : item)),
                )
              }
            />
          </View>
          <Copy size={10} color={c.muted} style={{ marginBottom: 5 }}>
            Data shared with Medivo
          </Copy>
          <Sharing items={d.sharing} />
        </Card>
      ))}
      <View style={[s.panel, { backgroundColor: p.ringConnected ? c.greenSoft : c.redSoft }]}>
        <Heading size={17}>{p.ringConnected ? 'Reconnected (1)' : 'Needs Attention (1)'}</Heading>
        <Copy size={12} color={c.muted}>
          {p.ringConnected ? 'Your ring is syncing again.' : '● Action required to resume syncing.'}
        </Copy>
      </View>
      <Card style={{ marginTop: 7 }}>
        <View style={s.row}>
          <DeviceArt kind="ring" size={42} />
          <View style={s.flex}>
            <Heading size={14}>Oura Ring</Heading>
            <Copy size={11} color={p.ringConnected ? c.green : c.orange}>
              ● {p.ringConnected ? 'Connected' : 'Action required'}
            </Copy>
            <Copy size={10} color={c.muted}>
              Last sync: {p.ringConnected ? 'Just now' : '1 day ago'}
            </Copy>
          </View>
          <Action
            onPress={() => p.setRingConnected((v) => !v)}
            style={{ minHeight: 34, paddingHorizontal: 9 }}
          >
            {p.ringConnected ? 'Disconnect' : 'Reconnect'}
          </Action>
        </View>
        {!p.ringConnected && (
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
              onPress={() => p.openDetail('Background sync settings')}
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
      <Section title="Add a new device" style={s.panel}>
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
          style={{ marginTop: 10 }}
          onPress={() => router.push(designRoutes.connect)}
        >
          Connect Apple Watch
        </Action>
      </Section>
      <DemoNote text="Demo device states only. No external services or permissions are accessed." />
    </Screen>
  );
}
export function ConnectDevice() {
  const { device: requested } = useLocalSearchParams<{ device?: string }>();
  const device = requested || 'Apple Watch';
  const p = usePreview();
  const router = useRouter();
  const connected = p.devices.some((d) => d.name === device && d.sync === 'Just now');
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
          onPress={() => p.openDetail('Privacy & Permissions')}
        />
        <Row
          title="Keeps syncing automatically"
          description="Once connected, your device will sync regularly in the background whenever it is nearby."
          icon="sync"
          onPress={() => p.openDetail('Automatic sync')}
        />
      </View>
      <DemoNote text="This connection is simulated. No account, health data, or permissions are accessed." />
      <Action
        style={{ marginTop: 12 }}
        onPress={() => {
          if (connected) router.replace(designRoutes.devices);
          else {
            p.connectDevice(device);
            p.setSheet({ kind: 'connection', title: device });
          }
        }}
      >
        {connected ? 'Connected · View devices' : 'Connect now'}
      </Action>
      <Action secondary style={{ marginTop: 8 }} onPress={() => p.openDetail('Device connection')}>
        Learn more
      </Action>
    </Screen>
  );
}
