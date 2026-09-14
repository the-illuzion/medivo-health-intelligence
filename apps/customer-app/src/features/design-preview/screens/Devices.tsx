import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  PageHeading,
  Section,
  Tile,
  s,
} from '../components/UI';
import { colors as c, designRoutes } from '../tokens';
import { useAuthStore } from '../../../store/useAuthStore';
import { appleHealthService } from '../../../services/health/appleHealth';
import { healthApi, type HealthConnection } from '../../../services/health/healthApi';

const APPLE_HEALTH_DATA = [
  'Steps',
  'Heart Rate',
  'Resting Heart Rate',
  'Active Energy',
  'Sleep',
  'HRV',
] as const;

const COMING_SOON_INTEGRATIONS = [
  {
    name: 'Fitbit',
    icon: 'activity',
    description: 'Activity, sleep and heart-rate data',
  },
  {
    name: 'Garmin',
    icon: 'watch',
    description: 'Fitness, recovery and activity data',
  },
  {
    name: 'Withings',
    icon: 'pressure',
    description: 'Blood pressure and connected health devices',
  },
  {
    name: 'Dexcom',
    icon: 'drop',
    description: 'Continuous glucose monitoring data',
  },
  {
    name: 'Oura',
    icon: 'moon',
    description: 'Sleep, readiness and activity data',
  },
] as const;

function formatLastSync(value: string | null | undefined): string {
  if (!value) return 'Not synced yet';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not synced yet';

  return parsed.toLocaleString();
}

function Sharing({ items }: { items: readonly string[] }) {
  return (
    <View style={s.wrap}>
      {items.map((item) => {
        const isSleep = item === 'Sleep';
        const isHeart = item.includes('Heart') || item === 'HRV';
        const icon = isSleep
          ? 'moon'
          : isHeart
            ? 'heart'
            : item === 'Steps' || item === 'Active Energy'
              ? 'activity'
              : 'drop';

        return (
          <Chip key={item} tone={isSleep ? 'purple' : isHeart ? 'red' : 'blue'} icon={icon}>
            {item}
          </Chip>
        );
      })}
    </View>
  );
}

export default function Devices() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [connection, setConnection] = useState<HealthConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isIos = Platform.OS === 'ios';
  const isConnected = Boolean(connection);
  const primaryDisabled = !isIos || isLoading || isSyncing || isResetting;
  const resetDisabled = isLoading || isSyncing || isResetting;

  const loadConnection = useCallback(async () => {
    if (!user?.id) {
      setConnection(null);
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const result = await healthApi.getAppleHealthConnection();
      setConnection(result);
    } catch (error) {
      setConnection(null);
      setLoadError(
        error instanceof Error ? error.message : 'Unable to load Apple Health connection status.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadConnection();
  }, [loadConnection]);

  const handleConnectOrSync = async () => {
    if (!isIos) {
      Alert.alert('Apple Health unavailable', 'Apple Health is available only on iPhone.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Sign in required', 'Please sign in before connecting Apple Health.');
      return;
    }

    const wasConnected = isConnected;
    setIsSyncing(true);

    try {
      const result = await appleHealthService.connectAndSync(user.id);
      if (!result.available) {
        Alert.alert('Apple Health unavailable', 'Apple Health is not available on this device.');
        return;
      }

      await loadConnection();
      Alert.alert(
        wasConnected ? 'Apple Health synced' : 'Apple Health connected',
        `Synced ${result.syncedSamples} health samples.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sync Apple Health.';
      Alert.alert('Apple Health sync failed', message);
    } finally {
      setIsSyncing(false);
    }
  };

  const performReset = async () => {
    if (!user?.id) {
      Alert.alert('Sign in required', 'Please sign in before resetting Apple Health.');
      return;
    }

    setIsResetting(true);
    let serverResetError: string | null = null;

    try {
      // Always clear the on-device HealthKit cursor first so the user can restart a fresh sync
      // even if the local BFF has not yet been rebuilt with the disconnect endpoint.
      await appleHealthService.resetSyncState(user.id);
      setConnection(null);
      setLoadError(null);

      try {
        await healthApi.disconnectAppleHealth();
      } catch (error) {
        serverResetError =
          error instanceof Error ? error.message : 'The Medivo server connection could not be reset.';
      }

      if (serverResetError) {
        Alert.alert(
          'Apple Health reset on this iPhone',
          `The local HealthKit sync cursor was cleared, but the Medivo server connection could not be disconnected yet: ${serverResetError}\n\nAfter the BFF is updated, run Disconnect Apple Health again. To make iOS ask for permissions again, revoke Medivo Health access in the Apple Health app before reconnecting.`,
        );
        return;
      }

      Alert.alert(
        isConnected ? 'Apple Health disconnected' : 'Medivo Apple Health reset',
        'Medivo connection state and the on-device sync cursor were reset. To make iOS ask for Health permissions again, open the Apple Health app, open your profile, find Apps / Apps and Services, choose Medivo Health, and turn off its Health permissions. Then return here and tap Connect Apple Health.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reset Apple Health.';
      Alert.alert('Apple Health reset failed', message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      isConnected ? 'Disconnect Apple Health?' : 'Reset Apple Health?',
      'This disconnects Apple Health in Medivo and clears Medivo’s incremental sync cursor. Existing health samples are kept. Apple controls Health permissions separately, so you can revoke those in the Health app before reconnecting.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isConnected ? 'Disconnect' : 'Reset',
          style: 'destructive',
          onPress: () => void performReset(),
        },
      ],
    );
  };

  return (
    <Screen>
      <PageHeading
        title="Manage Devices"
        subtitle="Connect health data sources and keep your Medivo insights up to date."
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.profile))}
      />

      <Card
        style={[
          s.row,
          { backgroundColor: isConnected ? c.greenSoft : c.blueSoft, alignItems: 'flex-start' },
        ]}
      >
        <Tile name={isConnected ? 'done' : 'phone'} tone={isConnected ? 'green' : 'blue'} size={48} />
        <View style={s.flex}>
          <Heading size={19}>{isConnected ? 'Apple Health connected' : 'No health source connected'}</Heading>
          <Copy color={c.muted} style={s.top4}>
            ↻ Last sync: {formatLastSync(connection?.lastSyncedAt)}
          </Copy>
          <Copy color={isConnected ? c.green : c.blue}>
            {isConnected ? '✓ Read-only health sync active' : 'Connect Apple Health to start syncing'}
          </Copy>
          <Copy size={11} color={c.muted}>
            Apple Watch measurements are included when your watch writes them to Apple Health.
          </Copy>
        </View>
      </Card>

      <View style={[s.panel, { backgroundColor: isConnected ? c.greenSoft : c.blueSoft }]}>
        <Heading size={17}>{isConnected ? 'Connected (1)' : 'Available health source'}</Heading>
        <Copy size={12} color={c.muted}>
          {isConnected
            ? '● Apple Health is sharing the categories you allowed.'
            : 'Connect Apple Health to share selected health categories with Medivo.'}
        </Copy>
      </View>

      <Card style={{ marginTop: 7 }}>
        <View style={[s.row, { alignItems: 'flex-start', gap: 10 }]}>
          <Tile name="heart" tone="red" size={44} />
          <View style={s.flex}>
            <Heading size={15}>Apple Health</Heading>
            {isLoading ? (
              <View style={[s.row, { gap: 6, marginTop: 4 }]}>
                <ActivityIndicator size="small" />
                <Copy size={11} color={c.muted}>
                  Checking connection…
                </Copy>
              </View>
            ) : (
              <>
                <Copy size={11} color={isConnected ? c.green : c.muted}>
                  ● {isConnected ? 'Connected' : 'Not connected'}
                </Copy>
                <Copy size={10} color={c.muted}>
                  Last sync: {formatLastSync(connection?.lastSyncedAt)}
                </Copy>
              </>
            )}
          </View>
          <Chip tone={isConnected ? 'green' : 'blue'}>{isConnected ? 'Live' : 'Available'}</Chip>
        </View>

        <Copy size={10} color={c.muted} style={{ marginTop: 12, marginBottom: 6 }}>
          Data Medivo can read when you allow access
        </Copy>
        <Sharing items={APPLE_HEALTH_DATA} />

        <View style={[s.panel, { backgroundColor: c.greenSoft, marginTop: 12 }]}>
          <Copy size={11} bold color={c.green}>
            Read-only access
          </Copy>
          <Copy size={10} color={c.muted} style={s.top4}>
            You choose the Health categories to share. Medivo does not write health records and does
            not pair directly with your Apple Watch.
          </Copy>
        </View>

        {loadError ? (
          <View style={[s.panel, { backgroundColor: c.redSoft, marginTop: 10 }]}>
            <Copy size={11} bold color={c.red}>
              Couldn’t load connection status
            </Copy>
            <Copy size={10} color={c.muted} style={s.top4}>
              {loadError}
            </Copy>
            <Action secondary style={{ marginTop: 8 }} onPress={() => void loadConnection()}>
              Retry
            </Action>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isConnected ? 'Sync Apple Health now' : 'Connect Apple Health'}
          accessibilityState={{ disabled: primaryDisabled }}
          disabled={primaryDisabled}
          onPress={() => void handleConnectOrSync()}
          style={{ marginTop: 12, width: '100%' }}
        >
          {({ pressed }) => (
            <View
              pointerEvents="none"
              style={{
                width: '100%',
                minHeight: 52,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: c.blue,
                backgroundColor: primaryDisabled ? '#8dbbff' : c.blue,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 16,
                opacity: pressed ? 0.8 : 1,
              }}
            >
              {isSyncing ? (
                <ActivityIndicator color={c.white} />
              ) : (
                <Copy size={14} bold color={c.white}>
                  {isConnected ? 'Sync Now' : 'Connect Apple Health'}
                </Copy>
              )}
            </View>
          )}
        </Pressable>

        {isIos ? (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isConnected ? 'Disconnect Apple Health' : 'Reset Apple Health sync'}
              accessibilityState={{ disabled: resetDisabled }}
              disabled={resetDisabled}
              onPress={handleReset}
              style={{ marginTop: 9, width: '100%' }}
            >
              {({ pressed }) => (
                <View
                  pointerEvents="none"
                  style={{
                    width: '100%',
                    minHeight: 46,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: c.red,
                    backgroundColor: c.redSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    opacity: pressed || resetDisabled ? 0.65 : 1,
                  }}
                >
                  {isResetting ? (
                    <ActivityIndicator color={c.red} />
                  ) : (
                    <Copy size={13} bold color={c.red}>
                      {isConnected ? 'Disconnect Apple Health' : 'Reset Apple Health Sync'}
                    </Copy>
                  )}
                </View>
              )}
            </Pressable>
            <Copy size={9} color={c.muted} style={{ marginTop: 7, textAlign: 'center' }}>
              Disconnect clears Medivo’s connection and sync cursor. Apple Health permissions are managed by iOS.
            </Copy>
          </>
        ) : (
          <Copy size={10} color={c.muted} style={{ marginTop: 8, textAlign: 'center' }}>
            Apple Health connection is available in the Medivo iOS app.
          </Copy>
        )}
      </Card>

      <Section title="More integrations" style={s.panel}>
        <Copy color={c.muted}>
          These providers are not connected to external services in this build yet.
        </Copy>
        <View style={[s.grid2, { marginTop: 9 }]}>
          {COMING_SOON_INTEGRATIONS.map((integration) => (
            <Card key={integration.name} style={[s.half, { padding: 10 }]}>
              <Tile name={integration.icon} tone="blue" size={30} />
              <Copy bold size={12} style={s.top4}>
                {integration.name}
              </Copy>
              <Copy size={9} color={c.orange} style={s.top4}>
                Coming soon
              </Copy>
              <Copy size={10} color={c.muted} style={s.top4}>
                {integration.description}
              </Copy>
            </Card>
          ))}
        </View>
      </Section>

      <DemoNote text="Apple Health is live on iOS. Fitbit, Garmin, Withings, Dexcom and Oura are shown as coming soon only." />
    </Screen>
  );
}

export function ConnectDevice() {
  const { device: requested } = useLocalSearchParams<{ device?: string }>();
  const router = useRouter();
  const device = requested || 'Fitbit';
  const isAppleHealth = device === 'Apple Health' || device === 'Apple Watch';

  return (
    <Screen>
      <PageHeading
        title={isAppleHealth ? 'Apple Health' : device}
        subtitle={
          isAppleHealth
            ? 'Apple Health is connected from the Manage Devices screen.'
            : `${device} is not enabled in this build yet.`
        }
        back={() => (router.canGoBack() ? router.back() : router.replace(designRoutes.devices))}
      />

      <Card>
        <View style={[s.row, { alignItems: 'flex-start' }]}>
          <Tile name={isAppleHealth ? 'heart' : 'link'} tone={isAppleHealth ? 'red' : 'blue'} size={44} />
          <View style={s.flex}>
            <Heading size={18}>{isAppleHealth ? 'Connect through Apple Health' : `${device} coming soon`}</Heading>
            <Copy color={c.muted} style={s.top4}>
              {isAppleHealth
                ? 'Use the live Apple Health card on Manage Devices to grant permissions and sync your data.'
                : `The ${device} card is currently a product preview and does not access an external account.`}
            </Copy>
          </View>
        </View>
      </Card>

      <Action style={{ marginTop: 12 }} onPress={() => router.replace(designRoutes.devices)}>
        {isAppleHealth ? 'Go to Apple Health' : 'Back to devices'}
      </Action>
      <DemoNote
        text={
          isAppleHealth
            ? 'Apple Health uses the native iOS HealthKit permission flow.'
            : `${device} is not connected to an external service in this build.`
        }
      />
    </Screen>
  );
}
