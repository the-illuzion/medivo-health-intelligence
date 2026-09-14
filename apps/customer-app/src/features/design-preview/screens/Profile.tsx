import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Shell';
import {
  Card,
  Copy,
  Heading,
  Icon,
  Row,
  Section,
  TextAction,
  Tile,
  s,
} from '../components/UI';
import { Avatar } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { colors as c, designRoutes } from '../tokens';
import type { Tone } from '../data/mock';
import { useAuthStore } from '../../../store/useAuthStore';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import { formatHealthLastSync } from '../../../services/health/healthDisplay';

export default function Profile() {
  const p = usePreview();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { connection } = useHealthSummary('day');
  const health: [string, string, string, Tone][] = [
    ['Personal Information', 'Account profile details', 'user', 'blue'],
    ['Health Conditions', 'Add existing conditions', 'heartpulse', 'red'],
    ['Medications', 'Current medications', 'pill', 'green'],
    ['Allergies', 'Known allergies', 'file', 'blue'],
    ['Health Goals', 'Your wellness goals', 'target', 'red'],
    ['Lifestyle', 'Sleep, activity, diet, etc.', 'user', 'purple'],
  ];

  const memberSince = user?.registered
    ? new Date(user.registered).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'Available in account';

  return (
    <Screen>
      <Card>
        <View style={s.row}>
          <Avatar size={65} />
          <View style={s.flex}>
            <Heading size={16}>{user?.name || 'Medivo user'}</Heading>
            <Copy size={10} color={c.muted}>{user?.email || 'Signed-in account'}</Copy>
            <Copy size={9} color={c.blue}>Authenticated profile</Copy>
          </View>
          <TextAction onPress={() => router.push('/edit-profile')}>Edit Profile</TextAction>
        </View>
        <View style={[s.grid3, { marginTop: 10 }]}>
          {[
            ['user', user?.skinType || 'Not set', 'Skin profile'],
            ['calendar', memberSince, 'Member since'],
            ['shield', user?.hipaaConsent ? 'Granted' : 'Not granted', 'Health consent'],
            ['heart', connection ? 'Connected' : 'Not connected', 'Apple Health'],
          ].map(([icon, value, label]) => (
            <View
              key={label}
              style={[s.third, { backgroundColor: '#f6f8fc', padding: 6, borderRadius: 6 }]}
            >
              <Icon name={icon} size={15} color={c.muted} />
              <Copy size={8} bold style={s.top4}>{value}</Copy>
              <Copy size={8} color={c.muted}>{label}</Copy>
            </View>
          ))}
        </View>
      </Card>

      <Card style={[s.row, { backgroundColor: c.greenSoft, marginTop: 9 }]}>
        <Tile name="shield" tone="green" />
        <View style={s.flex}>
          <Copy bold size={12} color={c.green}>Your health data is protected</Copy>
          <Copy size={10} color={c.muted}>
            Apple Health access is read-only and controlled by your iOS Health permissions.
          </Copy>
        </View>
        <TextAction onPress={() => router.push(designRoutes.devices)}>Permissions</TextAction>
      </Card>

      <Section
        title="Health Profile"
        action="View & Edit"
        onAction={() => router.push('/edit-profile')}
      >
        <View style={s.grid2}>
          {health.map(([title, sub, icon, tone]) => (
            <View style={s.half} key={title}>
              <Row
                compact
                title={title}
                description={sub}
                icon={icon}
                tone={tone}
                onPress={() =>
                  title === 'Personal Information'
                    ? router.push('/edit-profile')
                    : p.openDetail(title)
                }
              />
            </View>
          ))}
        </View>
      </Section>

      <Section
        title="Connected Devices"
        action="View All"
        onAction={() => router.push(designRoutes.devices)}
        style={s.card}
      >
        <Copy size={10} color={c.muted}>Live connection state from Medivo.</Copy>
        <Card
          style={{ marginTop: 8, padding: 9 }}
          onPress={() => router.push(designRoutes.devices)}
        >
          <View style={[s.row, { gap: 8 }]}>
            <Tile name="heart" tone="red" size={32} />
            <View style={s.flex}>
              <Copy size={10} bold>Apple Health</Copy>
              <Copy size={9} color={connection ? c.green : c.muted}>
                ● {connection ? 'Connected' : 'Not connected'}
              </Copy>
              <Copy size={8} color={c.muted}>
                Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}
              </Copy>
            </View>
            <TextAction onPress={() => router.push(designRoutes.devices)}>
              {connection ? 'Manage' : 'Connect'}
            </TextAction>
          </View>
        </Card>
      </Section>

      <Section title="Health Records" style={s.card}>
        <Copy size={10} color={c.muted}>
          Connect your medical records, lab reports and prescriptions.
        </Copy>
        <View style={[s.grid3, { marginTop: 8 }]}>
          {[
            ['Lab Reports', 'lab', '2 connected'],
            ['Medical Records', 'file', '1 connected'],
            ['Prescriptions', 'pill', '1 connected'],
          ].map(([title, icon, sub]) => (
            <Card style={[s.third, { padding: 7 }]} key={title} onPress={() => p.openDetail(title)}>
              <Tile name={icon} size={25} />
              <Copy size={9} bold style={s.top4}>{title}</Copy>
              <Copy size={8} color={c.muted}>{sub}</Copy>
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Medication" style={s.card}>
        <Copy size={10} color={c.muted}>Keep your medication list up to date.</Copy>
        <View style={[s.row, { marginTop: 8 }]}>
          <View style={s.flex}>
            <Row
              compact
              title={`${2 + (p.entries.Medications?.length || 0)} active medications`}
              description="Last updated 2 weeks ago"
              icon="pill"
              onPress={() => p.openDetail('Medications')}
            />
          </View>
          <TextAction onPress={() => p.openDetail('Add Medication')}>+ Add Medication</TextAction>
        </View>
      </Section>

      <Section
        title="Care Network"
        action="View All"
        onAction={() => p.openDetail('Care Network')}
        style={s.card}
      >
        <Copy size={10} color={c.muted}>Family, caregivers and healthcare providers.</Copy>
        <View style={[s.grid3, { marginTop: 8 }]}>
          {['Rahul Sharma', 'Dr. Neha Verma', 'Add Member'].map((title, i) => (
            <Card
              key={title}
              style={[s.third, { padding: 7 }]}
              onPress={() => p.openDetail(i === 2 ? 'Add Member' : title)}
            >
              {i === 2 ? <Tile name="plus" size={30} /> : <Avatar size={30} male={i === 0} />}
              <Copy size={9} bold style={s.top4}>{title}</Copy>
              <Copy size={8} color={c.muted}>
                {['Family Member', 'Primary Physician', 'Family, caregiver or clinician'][i]}
              </Copy>
              {i < 2 ? <Copy size={8} color={c.green}>● Active</Copy> : null}
            </Card>
          ))}
        </View>
      </Section>

      <Section
        title="Integrations"
        action="Manage"
        onAction={() => router.push(designRoutes.devices)}
        style={s.card}
      >
        <Copy size={10} color={c.muted}>Health data integrations available to this build.</Copy>
        <Card style={{ marginTop: 8, padding: 8 }} onPress={() => router.push(designRoutes.devices)}>
          <View style={[s.row, { gap: 6 }]}>
            <Tile name="heart" tone="red" size={28} />
            <View style={s.flex}>
              <Copy size={10} bold>Apple Health</Copy>
              <Copy size={9} color={connection ? c.green : c.muted}>
                {connection ? 'Connected' : 'Available to connect'}
              </Copy>
            </View>
            <TextAction onPress={() => router.push(designRoutes.devices)}>
              {connection ? 'Manage' : 'Connect'}
            </TextAction>
          </View>
        </Card>
      </Section>

      <Section title="Account & Preferences">
        <Row
          title="Privacy & Permissions"
          description="Control your data, privacy settings and app permissions."
          icon="shield"
          onPress={() => p.openDetail('Privacy & Permissions')}
        />
        <Row
          title="Account Settings"
          description="App preferences, notifications and more."
          icon="settings"
          onPress={() => p.openDetail('Account Settings')}
        />
        <Row
          title="Need Help?"
          description="Get support or view our help center"
          icon="help"
          onPress={() => p.openDetail('Need Help')}
        />
      </Section>
    </Screen>
  );
}
