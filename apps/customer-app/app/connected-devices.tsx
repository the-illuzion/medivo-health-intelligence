import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, HeartPulse, RefreshCw, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { appleHealthService } from '../src/services/health/appleHealth';
import { healthApi, type HealthConnection } from '../src/services/health/healthApi';

function formatLastSync(value: string | null | undefined): string {
  if (!value) return 'Not synced yet';
  return new Date(value).toLocaleString();
}

export default function ConnectedDevicesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [connection, setConnection] = useState<HealthConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadConnection = useCallback(async () => {
    try {
      const result = await healthApi.getAppleHealthConnection();
      setConnection(result);
    } catch {
      setConnection(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConnection();
  }, [loadConnection]);

  const handleConnectOrSync = async () => {
    if (!user?.id) {
      Alert.alert('Sign in required', 'Please sign in before connecting Apple Health.');
      return;
    }

    setIsSyncing(true);
    try {
      const result = await appleHealthService.connectAndSync(user.id);
      if (!result.available) {
        Alert.alert('Apple Health unavailable', 'Apple Health is not available on this device.');
        return;
      }
      await loadConnection();
      Alert.alert(
        connection ? 'Apple Health synced' : 'Apple Health connected',
        `Synced ${result.syncedSamples} health samples.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sync Apple Health.';
      Alert.alert('Apple Health sync failed', message);
    } finally {
      setIsSyncing(false);
    }
  };

  const isIos = Platform.OS === 'ios';

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#090D16]"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="px-4 sm:px-6 pt-6 gap-6 max-w-4xl mx-auto w-full">
        <View className="flex-row items-center">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#111827] items-center justify-center mr-3"
          >
            <ArrowLeft size={20} color="#64748B" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white text-2xl font-extrabold tracking-tight">
              Connected Devices
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Control which health sources share data with Medivo.
            </Text>
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-[#374151] p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 items-center justify-center mr-3">
                <HeartPulse size={24} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white text-base font-extrabold">Apple Health</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Steps, heart rate, resting heart rate, active energy, sleep and HRV
                </Text>
              </View>
            </View>
            {connection ? <CheckCircle2 size={22} color="#059669" /> : null}
          </View>

          <View className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

          {isLoading ? (
            <View className="py-4 items-center">
              <ActivityIndicator />
            </View>
          ) : (
            <>
              <View className="flex-row justify-between mb-2">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Status</Text>
                <Text className={`text-xs font-bold ${connection ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}>
                  {connection ? 'Connected' : 'Not connected'}
                </Text>
              </View>
              <View className="flex-row justify-between mb-5">
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Last sync</Text>
                <Text className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  {formatLastSync(connection?.lastSyncedAt)}
                </Text>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                disabled={!isIos || isSyncing}
                onPress={handleConnectOrSync}
                className={`rounded-2xl p-4 flex-row items-center justify-center ${
                  isIos ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                {isSyncing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <RefreshCw size={18} color="#FFFFFF" />
                    <Text className="text-white font-extrabold ml-2">
                      {connection ? 'Sync Now' : 'Connect Apple Health'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {!isIos ? (
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-3 text-center">
                  Apple Health connection is available in the Medivo iOS app.
                </Text>
              ) : null}
            </>
          )}
        </View>

        <View className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-4 flex-row">
          <ShieldCheck size={20} color="#059669" />
          <Text className="text-emerald-800 dark:text-emerald-300 text-xs leading-5 ml-3 flex-1">
            Medivo requests read-only access. You choose the HealthKit categories to share, and you can change those permissions at any time in Apple Health settings.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
