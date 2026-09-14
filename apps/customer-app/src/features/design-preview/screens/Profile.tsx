import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
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
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { colors as c, designRoutes } from '../tokens';
import type { Tone } from '../data/mock';

export default function Profile() {
  const router = useRouter();
  const desktop = useDesktop();
  const { profile, fetchProfile } = useHealthProfileStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { user, logout } = useAuthStore();
  const { openDetail } = useSheetStore();

  useEffect(() => {
    fetchProfile();
    fetchDevices();
  }, []);

  const displayName = user?.name || profile.name || 'Alex Morgan';
  const displayEmail = user?.email || profile.email || 'alex.morgan@example.com';

  const healthSections: [string, string, string, Tone][] = [
    ['Personal Information', 'Age, gender, location, etc.', 'user', 'blue'],
    ['Health Conditions', profile.healthConditions[0] || 'Managed with care team', 'heartpulse', 'red'],
    ['Medications', `${profile.medications.length} active medications`, 'pill', 'green'],
    ['Allergies', profile.allergies[0] || 'No known allergies', 'file', 'blue'],
    ['Health Goals', `${profile.healthGoals.length} personalized goals`, 'target', 'red'],
    ['Lifestyle', `${profile.lifestyle.sleep} · ${profile.lifestyle.activity}`, 'user', 'purple'],
  ];

  return (
    <Screen>
      <View style={desktop ? st.desktopProfileGrid : undefined}>
        <View style={desktop ? st.desktopCol : undefined}>
          <Card>
            <View style={s.row}>
              <Avatar male size={65} />
              <View style={s.flex}>
                <Heading size={16}>{displayName}</Heading>
                <Copy size={11} color={c.muted}>
                  {profile.age || 32} years · {profile.gender || 'Male'}
                </Copy>
                <Copy size={10} color={c.muted}>
                  {displayEmail}
                </Copy>
                <Copy size={9} color={c.green}>
                  ● Confirmed Patient Identity
                </Copy>
              </View>
              <TextAction onPress={() => openDetail('Edit Profile')}>Edit Profile</TextAction>
            </View>
            <View style={[s.grid3, { marginTop: 10 }]}>
              {[
                ['user', profile.gender || 'Male', 'Gender'],
                ['calendar', profile.dateOfBirth || 'Jan 12, 1992', 'Date of birth'],
                ['drop', profile.bloodGroup || 'O+', 'Blood group'],
                ['pin', profile.location || 'San Francisco, CA', 'Location'],
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
                We use HIPAA-compliant encryption to keep your clinical information private and safe.
              </Copy>
            </View>
            <TextAction onPress={() => openDetail('Privacy & Permissions')}>Learn more</TextAction>
          </Card>
          <Section
            title="Health Profile"
            action="View & Edit"
            onAction={() => openDetail('Personal Information')}
          >
            <View style={s.grid2}>
              {healthSections.map(([title, sub, icon, tone]) => (
                <View style={s.half} key={title}>
                  <Row
                    compact
                    title={title}
                    description={sub}
                    icon={icon}
                    tone={tone}
                    onPress={() => openDetail(title)}
                  />
                </View>
              ))}
            </View>
          </Section>
        </View>

        <View style={desktop ? st.desktopCol : undefined}>
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
              {devices.slice(0, 3).map((d) => (
                <Card
                  key={d.id || d.name}
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
                ['Lab Reports', 'lab', `${profile.healthRecords.filter((r) => r.recordType === 'lab').length || 2} connected`],
                ['Medical Records', 'file', `${profile.healthRecords.filter((r) => r.recordType === 'medical').length || 1} connected`],
                ['Prescriptions', 'pill', `${profile.healthRecords.filter((r) => r.recordType === 'prescription').length || 1} connected`],
              ].map(([title, icon, sub]) => (
                <Card style={[s.third, { padding: 7 }]} key={title} onPress={() => openDetail(title)}>
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
                  title={`${profile.medications.length} active medications`}
                  description={profile.medications[0]?.name ? `Latest: ${profile.medications[0].name} (${profile.medications[0].dosage})` : 'Keep track of prescriptions'}
                  icon="pill"
                  onPress={() => openDetail('Medications')}
                />
              </View>
              <TextAction onPress={() => openDetail('Add Medication')}>+ Add Medication</TextAction>
            </View>
          </Section>
        </View>
      </View>

      <View style={desktop ? st.desktopProfileGrid : undefined}>
        <View style={desktop ? st.desktopCol : undefined}>
          <Section
            title="Care Network"
            action="View All"
            onAction={() => openDetail('Care Network')}
            style={s.card}
          >
            <Copy size={10} color={c.muted}>
              Family, caregivers and healthcare providers.
            </Copy>
            <View style={[s.grid3, { marginTop: 8 }]}>
              {profile.careNetwork.map((member) => (
                <Card
                  key={member.id || member.name}
                  style={[s.third, { padding: 7 }]}
                  onPress={() => openDetail(member.name)}
                >
                  <Avatar size={30} male={member.isMale} />
                  <Copy size={9} bold style={s.top4}>
                    {member.name}
                  </Copy>
                  <Copy size={8} color={c.muted}>
                    {member.relationship}
                  </Copy>
                  <Copy size={8} color={c.green}>
                    ● Active
                  </Copy>
                </Card>
              ))}
              <Card
                style={[s.third, { padding: 7 }]}
                onPress={() => openDetail('Add Member')}
              >
                <Tile name="plus" size={30} />
                <Copy size={9} bold style={s.top4}>
                  Add Member
                </Copy>
                <Copy size={8} color={c.muted}>
                  Family, caregiver or clinician
                </Copy>
              </Card>
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
                        {devices.some((d) => d.name === title) ? 'Connected' : 'Not connected'}
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
        </View>

        <View style={desktop ? st.desktopCol : undefined}>
          <Section title="Account & Preferences">
            <Row
              title="Privacy & Permissions"
              description="Control your data, privacy settings and app permissions."
              icon="shield"
              onPress={() => openDetail('Privacy & Permissions')}
            />
            <Row
              title="Account Settings"
              description="App preferences, notifications and more."
              icon="settings"
              onPress={() => openDetail('Account Settings')}
            />
            <Row
              title="Need Help?"
              description="Get support or view our help center"
              icon="help"
              onPress={() => openDetail('Need Help')}
            />
          </Section>
          <Action
            secondary
            style={{ marginTop: 14 }}
            onPress={async () => {
              await logout();
              router.replace('/login');
            }}
          >
            Sign out
          </Action>
        </View>
      </View>
      <DemoNote text="Live patient profile with synchronized care network and verified biomarker telemetry." />
    </Screen>
  );
}

const st = StyleSheet.create({
  desktopProfileGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopCol: {
    flex: 1,
  },
});
