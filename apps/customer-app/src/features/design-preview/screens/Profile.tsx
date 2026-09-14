import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
import {
  Action,
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
import { Avatar, DeviceArt } from '../components/Illustrations';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import { formatHealthLastSync } from '../../../services/health/healthDisplay';
import { colors as c, designRoutes } from '../tokens';
import type { Tone } from '../data/mock';

export default function Profile() {
  const router = useRouter();
  const desktop = useDesktop();
  const narrow = useWindowDimensions().width < 370;
  const { profile, fetchProfile } = useHealthProfileStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { user, logout } = useAuthStore();
  const { openDetail } = useSheetStore();
  const { connection } = useHealthSummary('day');

  useEffect(() => {
    void Promise.allSettled([fetchProfile(), fetchDevices()]);
  }, [fetchProfile, fetchDevices]);

  const displayName = user?.name || profile.name || 'Medivo user';
  const displayEmail = user?.email || profile.email || 'Signed-in account';
  const memberSince = user?.registered
    ? new Date(user.registered).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '—';

  const healthSections: [string, string, string, Tone][] = [
    ['Personal Information', 'Account profile details', 'user', 'blue'],
    ['Health Conditions', profile.healthConditions.length ? `${profile.healthConditions.length} recorded` : 'Add existing conditions', 'heartpulse', 'red'],
    ['Medications', profile.medications.length ? `${profile.medications.length} current medications` : 'Current medications', 'pill', 'green'],
    ['Allergies', profile.allergies.length ? `${profile.allergies.length} known allergies` : 'Known allergies', 'file', 'blue'],
    ['Health Goals', profile.healthGoals.length ? `${profile.healthGoals.length} wellness goals` : 'Your wellness goals', 'target', 'red'],
    ['Lifestyle', profile.lifestyle.sleep !== 'Not specified' ? `${profile.lifestyle.sleep}, ${profile.lifestyle.activity}` : 'Sleep, activity, diet, etc.', 'user', 'purple'],
  ];

  return (
    <Screen>
      <View style={desktop ? st.desktopProfileGrid : undefined}>
        <View style={desktop ? st.desktopCol : undefined}>
          <Card>
            <View style={s.row}>
              <Avatar male={profile.gender === 'Male'} size={65} />
              <View style={s.flex}>
                <Heading size={16}>{displayName}</Heading>
                <Copy size={10} color={c.muted}>
                  {displayEmail}
                </Copy>
                <Copy size={9} color={c.blue}>
                  Your health profile
                </Copy>
              </View>
              <TextAction onPress={() => router.push('/edit-profile')}>Edit Profile</TextAction>
            </View>

            <View style={[st.facts, { marginTop: 16 }]}>
              {[
                ['user', user?.skinType || 'Not set', 'Skin profile'],
                ['calendar', memberSince, 'Member since'],
                ['shield', user?.hipaaConsent ? 'Granted' : 'Not granted', 'Health consent'],
                ['heart', connection ? 'Connected' : 'Not connected', 'Apple Health'],
              ].map(([icon, value, label]) => (
                <View key={label} style={[st.fact, narrow && st.factMobile]}>
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
                Your health data is protected
              </Copy>
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
              {healthSections.map(([title, sub, icon, tone]) => (
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
                        : openDetail(title)
                    }
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

            <Card
              style={{ marginTop: 8, padding: 9 }}
              onPress={() => router.push(designRoutes.devices)}
            >
              <View style={[s.row, { gap: 8 }]}>
                <Tile name="heart" tone="red" size={32} />
                <View style={s.flex}>
                  <Copy size={10} bold>
                    Apple Health
                  </Copy>
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

            {devices.length > 0 ? (
              <View style={[s.grid3, { marginTop: 8 }]}>
                {devices.slice(0, 3).map((device) => (
                  <Card
                    key={device.id || device.name}
                    style={[s.third, { padding: 6 }]}
                    onPress={() => router.push(designRoutes.devices)}
                  >
                    <DeviceArt kind={device.kind} size={32} />
                    <Copy size={9} bold style={s.top4}>
                      {device.name}
                    </Copy>
                    <Copy size={8} color={device.enabled ? c.green : c.muted}>
                      ● {device.enabled ? 'Connected' : 'Paused'}
                    </Copy>
                    <Copy size={8} color={c.muted}>
                      Last sync: {device.sync}
                    </Copy>
                  </Card>
                ))}
              </View>
            ) : null}
          </Section>

          <Section title="Health Records" style={s.card}>
            <Copy size={10} color={c.muted}>
              Connect your medical records, lab reports and prescriptions.
            </Copy>
            <View style={[s.grid3, { marginTop: 8 }]}>
              {[
                [
                  'Lab Reports',
                  'lab',
                  `${profile.healthRecords.filter((record) => record.recordType === 'lab').length} connected`,
                ],
                [
                  'Medical Records',
                  'file',
                  `${profile.healthRecords.filter((record) => record.recordType === 'medical').length} connected`,
                ],
                [
                  'Prescriptions',
                  'pill',
                  `${profile.healthRecords.filter((record) => record.recordType === 'prescription').length} connected`,
                ],
              ].map(([title, icon, sub]) => (
                <Card
                  style={[s.third, { padding: 7 }]}
                  key={title}
                  onPress={() => openDetail(title)}
                >
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
                  description={
                    profile.medications[0]?.name
                      ? `Latest: ${profile.medications[0].name} (${profile.medications[0].dosage})`
                      : 'Keep track of prescriptions'
                  }
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
              {profile.careNetwork.slice(0, 2).map((member) => (
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
                  <Copy size={8} color={member.isActive ? c.green : c.muted}>
                    ● {member.isActive ? 'Active' : 'Inactive'}
                  </Copy>
                </Card>
              ))}
              <Card style={[s.third, { padding: 7 }]} onPress={() => openDetail('Add Member')}>
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
              Bring your health data together.
            </Copy>
            <Card
              style={{ marginTop: 8, padding: 8 }}
              onPress={() => router.push(designRoutes.devices)}
            >
              <View style={[s.row, { gap: 6 }]}>
                <Tile name="heart" tone="red" size={28} />
                <View style={s.flex}>
                  <Copy size={10} bold>
                    Apple Health
                  </Copy>
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
    </Screen>
  );
}

const st = StyleSheet.create({
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  fact: { flex: 1, minWidth: 0, backgroundColor: '#f6f8fc', padding: 8, borderRadius: 8 },
  factMobile: { flexBasis: '45%' },
  desktopProfileGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopCol: { flex: 1 },
});
