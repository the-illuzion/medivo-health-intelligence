import { useCallback, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { appleHealthService } from '../services/health/appleHealth';
import { healthApi } from '../services/health/healthApi';
import { notifyAppleHealthSyncCompleted } from '../services/health/appleHealthSyncEvents';
import { useAuthStore } from '../store/useAuthStore';

const AUTO_SYNC_MIN_INTERVAL_MS = 5 * 60 * 1000;
const lastAttemptAtByUser = new Map<string, number>();
const inFlightByUser = new Map<string, Promise<void>>();

async function runAutoSync(userId: string): Promise<void> {
  const existing = inFlightByUser.get(userId);
  if (existing) {
    await existing;
    return;
  }

  const now = Date.now();
  const lastAttemptAt = lastAttemptAtByUser.get(userId) ?? 0;
  if (now - lastAttemptAt < AUTO_SYNC_MIN_INTERVAL_MS) return;
  lastAttemptAtByUser.set(userId, now);

  const task = (async () => {
    const connection = await healthApi.getAppleHealthConnection();
    if (!connection) return;

    const result = await appleHealthService.sync(userId);
    if (result.available) {
      notifyAppleHealthSyncCompleted();
    }
  })()
    .catch((error) => {
      console.warn('[Apple Health] Automatic sync failed:', error);
    })
    .finally(() => {
      inFlightByUser.delete(userId);
    });

  inFlightByUser.set(userId, task);
  await task;
}

export function useAppleHealthAutoSync(): void {
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const syncIfEligible = useCallback(async () => {
    if (Platform.OS !== 'ios' || !isHydrated || !userId || !token) return;
    await runAutoSync(userId);
  }, [isHydrated, token, userId]);

  useEffect(() => {
    if (AppState.currentState === 'active') {
      void syncIfEligible();
    }
  }, [syncIfEligible]);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void syncIfEligible();
      }
    });

    return () => subscription.remove();
  }, [syncIfEligible]);
}
