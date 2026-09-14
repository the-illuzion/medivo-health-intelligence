import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

export interface VitalMetric {
  name: string;
  icon: string;
  value: string;
  unit: string;
  home: string;
  change: string;
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  baseline: string;
  description?: string;
}

export interface HealthScoreInfo {
  score: number | null;
  deltaPts: number;
  comparisonPeriod: string;
}

export interface HealthChangeSummary {
  title: string;
  change: string;
  text: string;
  tone: 'green' | 'red' | 'blue';
  icon: string;
}

export interface HealthInsight {
  tag: string;
  title: string;
  highlight: string;
  end: string;
  text: string;
  why: string;
  icon: string;
  tone: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface HealthAlert {
  title: string;
  subtitle: string;
  severity: string;
  metricName: string;
  currentVal: string;
  baselineVal: string;
  possibleReasons: string;
  actionItems: string[];
}

interface VitalsState {
  metrics: VitalMetric[];
  healthScore: HealthScoreInfo;
  changesSummary: HealthChangeSummary[];
  insights: HealthInsight[];
  alerts: HealthAlert[];
  period: 'Day' | 'Week' | 'Month';
  isLoading: boolean;
  error: string | null;

  setPeriod: (period: 'Day' | 'Week' | 'Month') => void;
  fetchVitals: (period?: 'Day' | 'Week' | 'Month') => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  addManualReading: (reading: { metricType: string; valueString: string; unit?: string; source?: string }) => Promise<void>;
}

const initialBlankMetrics: VitalMetric[] = [
  { name: 'Heart Rate', icon: 'heart', value: '--', unit: 'bpm', home: '--', change: 'No data', tone: 'blue', baseline: '70 bpm' },
  { name: 'Blood Pressure', icon: 'pressure', value: '--/--', unit: 'mmHg', home: '--/--', change: 'No data', tone: 'blue', baseline: '120/80 mmHg' },
  { name: 'SpO₂', icon: 'drop', value: '--', unit: '%', home: '--', change: 'No data', tone: 'blue', baseline: '98%' },
  { name: 'Sleep', icon: 'moon', value: '--', unit: '', home: '--', change: 'No data', tone: 'blue', baseline: '7h 00m' },
  { name: 'Activity', icon: 'activity', value: '--', unit: 'steps', home: '--', change: 'No data', tone: 'blue', baseline: '8,000 steps' },
  { name: 'Temperature', icon: 'temperature', value: '--', unit: '°C', home: '--', change: 'No data', tone: 'blue', baseline: '36.6 °C' },
  { name: 'Stress', icon: 'brain', value: '--', unit: '', home: '--', change: 'No data', tone: 'blue', baseline: 'Optimal' },
];

export const useVitalsStore = create<VitalsState>((set, get) => ({
  metrics: initialBlankMetrics,
  healthScore: { score: null, deltaPts: 0, comparisonPeriod: 'No prior baseline' },
  changesSummary: [],
  insights: [],
  alerts: [],
  period: 'Day',
  isLoading: false,
  error: null,

  setPeriod: (period) => {
    set({ period });
    get().fetchVitals(period);
  },

  fetchVitals: async (period) => {
    const targetPeriod = period || get().period;
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.vitals.getOverview(targetPeriod);
      if (res) {
        set({
          metrics: res.metrics || get().metrics,
          healthScore: res.healthScore || get().healthScore,
          changesSummary: res.changesSummary || [],
          isLoading: false,
        });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchInsights: async () => {
    try {
      const data = await apiClient.vitals.getInsights();
      if (data && Array.isArray(data)) {
        set({ insights: data });
      }
    } catch {
    }
  },

  fetchAlerts: async () => {
    try {
      const data = await apiClient.vitals.getAlerts();
      if (data && Array.isArray(data)) {
        set({ alerts: data });
      }
    } catch {
    }
  },

  addManualReading: async (reading) => {
    try {
      await apiClient.vitals.addReading(reading);
      set((state) => ({
        metrics: state.metrics.map((m) =>
          m.name.toLowerCase() === reading.metricType.toLowerCase()
            ? { ...m, value: reading.valueString, home: reading.valueString, change: 'Within', tone: 'green' }
            : m
        ),
      }));
    } catch {
      set((state) => ({
        metrics: state.metrics.map((m) =>
          m.name.toLowerCase() === reading.metricType.toLowerCase()
            ? { ...m, value: reading.valueString, home: reading.valueString, change: 'Within', tone: 'green' }
            : m
        ),
      }));
    }
  },
}));

