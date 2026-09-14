import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Shell';
import {
  Action,
  Card,
  Copy,
  DemoNote,
  Heading,
  Icon,
  Row,
  Section,
  TextAction,
  Tile,
  s,
} from '../components/UI';
import { Avatar, DeviceArt } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { colors as c, designRoutes } from '../tokens';
import type { Tone } from '../data/mock';
export default function Profile() {
  const p = usePreview();
  const router = useRouter();
  const health: [string, string, string, Tone][] = [
    ['Personal Information', 'Age, gender, location, etc.', 'user', 'blue'],
    ['Health Conditions', 'Add existing conditions', 'heartpulse', 'red'],
    ['Medications', 'Current medications', 'pill', 'green'],
    ['Allergies', 'Known allergies', 'file', 'blue'],
    ['Health Goals', 'Your wellness goals', 'target', 'red'],
    ['Lifestyle', 'Sleep, activity, diet, etc.', 'user', 'purple'],
  ];
  return (
    <Screen>
      <Card>
        <View style={s.row}>
          <Avatar male size={65} />
          <View style={s.flex}>
            <Heading size={16}>{p.profileName}</Heading>
            <Copy size={11} color={c.muted}>
              32 years · Male
            </Copy>
            <Copy size={10} color={c.muted}>
              prateek@example.com
            </Copy>
            <Copy size={9} color={c.blue}>
              Sample profile
            </Copy>
          </View>
          <TextAction onPress={() => p.openDetail('Edit Profile')}>Edit Profile</TextAction>
        </View>
        <View style={[s.grid3, { marginTop: 10 }]}>
          {[
            ['user', 'Male', 'Gender'],
            ['calendar', 'Jan 12, 1992', 'Date of birth'],
            ['drop', 'O+', 'Blood group'],
            ['pin', 'Gurgaon, India', 'Location'],
          ].map(([icon, value, label]) => (
            <View
              key={label}
              style={[s.third, { backgroundColor: '#f6f8fc', padding: 6, borderRadius: 6 }]}
            >
              <Icon name={icon} size={15} color={c.muted} />
              <Copy size={8} bold style={s.top4}>
                {value}
              </Copy>
              <Copy size={8} color={c.muted}>
                {label}
              </Copy>
            </View>
          ))}
        </View>
      </Card>
      <Card style={[s.row, { backgroundColor: c.greenSoft, marginTop: 9 }]}>
        <Tile name="shield" tone="green" />
        <View style={s.flex}>
          <Copy bold size={12} color={c.green}>
            Your health data is secure
          </Copy>
          <Copy size={10} color={c.muted}>
            We use industry-standard encryption to keep your information private and safe.
          </Copy>
        </View>
        <TextAction onPress={() => p.openDetail('Privacy & Permissions')}>Learn more</TextAction>
      </Card>
      <Section
        title="Health Profile"
        action="View & Edit"
        onAction={() => p.openDetail('Personal Information')}
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
                onPress={() => p.openDetail(title)}
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
        <Copy size={10} color={c.muted}>
          Manage your wearables and health devices.
        </Copy>
        <View style={[s.grid3, { marginTop: 8 }]}>
          {p.devices.slice(0, 3).map((d) => (
            <Card
              key={d.name}
              style={[s.third, { padding: 6 }]}
              onPress={() => router.push(designRoutes.devices)}
            >
              <DeviceArt kind={d.kind} size={32} />
              <Copy size={9} bold style={s.top4}>
                {d.name}
              </Copy>
              <Copy size={8} color={d.enabled ? c.green : c.muted}>
                ● {d.enabled ? 'Connected' : 'Paused'}
              </Copy>
              <Copy size={8} color={c.muted}>
                Last sync: {d.sync}
              </Copy>
            </Card>
          ))}
        </View>
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
              <Copy size={9} bold style={s.top4}>
                {title}
              </Copy>
              <Copy size={8} color={c.muted}>
                {sub}
              </Copy>
            </Card>
          ))}
        </View>
      </Section>
      <Section title="Medication" style={s.card}>
        <Copy size={10} color={c.muted}>
          Keep your medication list up to date.
        </Copy>
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
        <Copy size={10} color={c.muted}>
          Family, caregivers and healthcare providers.
        </Copy>
        <View style={[s.grid3, { marginTop: 8 }]}>
          {['Rahul Sharma', 'Dr. Neha Verma', 'Add Member'].map((title, i) => (
            <Card
              key={title}
              style={[s.third, { padding: 7 }]}
              onPress={() => p.openDetail(i === 2 ? 'Add Member' : title)}
            >
              {i === 2 ? <Tile name="plus" size={30} /> : <Avatar size={30} male={i === 0} />}
              <Copy size={9} bold style={s.top4}>
                {title}
              </Copy>
              <Copy size={8} color={c.muted}>
                {['Family Member', 'Primary Physician', 'Family, caregiver or clinician'][i]}
              </Copy>
              {i < 2 && (
                <Copy size={8} color={c.green}>
                  ● Active
                </Copy>
              )}
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
        <Copy size={10} color={c.muted}>
          Sync with other health and lifestyle apps
        </Copy>
        <View style={[s.grid3, { marginTop: 8 }]}>
          {['Google Fit', 'MyFitnessPal'].map((title, i) => (
            <Card key={title} style={[s.third, { padding: 8 }]}>
              <View style={[s.row, { gap: 6 }]}>
                <Tile name={i === 0 ? 'heart' : 'activity'} size={26} />
                <View style={s.flex}>
                  <Copy size={10} bold>
                    {title}
                  </Copy>
                  <Copy size={9} color={c.muted}>
                    {p.devices.some((d) => d.name === title) ? 'Connected' : 'Not connected'}
                  </Copy>
                </View>
              </View>
              <TextAction
                onPress={() =>
                  router.push({ pathname: designRoutes.connect, params: { device: title } })
                }
              >
                Connect
              </TextAction>
            </Card>
          ))}
        </View>
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
      <Action secondary onPress={() => router.replace('/(tabs)')}>
        Open existing app
      </Action>
      <DemoNote text="Design preview only. Open the existing app to use your current integrated features." />
    </Screen>
  );
}
