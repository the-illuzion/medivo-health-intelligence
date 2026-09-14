import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  healthApi,
  type HealthConnection,
  type HealthMetricSummaryItem,
  type HealthMetricType,
  type HealthSummary,
  type HealthSummaryPeriod,
} from '../services/health/healthApi';
import { useAuthStore } from '../store/useAuthStore';

export function useHealthSummary(period: HealthSummaryPeriod = 'day') {
  const userId = useAuthStore((state) => state.user?.id);
  const [connection, setConnection] = useState<HealthConnection | null>(null);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setConnection(null);
      setSummary(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const nextConnection = await healthApi.getAppleHealthConnection();
      setConnection(nextConnection);

      if (!nextConnection) return;

      const nextSummary = await healthApi.getAppleHealthSummary(period);
      setSummary(nextSummary);
    } catch (nextError) {
      setSummary(null);
      setError(nextError instanceof Error ? nextError.message : 'Unable to load health data.');
    } finally {
      setIsLoading(false);
    }
  }, [period, userId]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const metrics = useMemo(() => {
    const byType = new Map<HealthMetricType, HealthMetricSummaryItem>();
    summary?.metrics.forEach((metric) => byType.set(metric.metricType, metric));
    return byType;
  }, [summary]);

  return {
    connection,
    summary,
    metrics,
    isLoading,
    error,
    refresh,
  };
}
