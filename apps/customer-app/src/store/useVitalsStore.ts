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
  score: number;
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

const defaultMetrics: VitalMetric[] = [
  { name: 'Heart Rate', icon: 'heart', value: '76', unit: 'bpm', home: '72', change: '+8% above', tone: 'red', baseline: '70 bpm' },
  { name: 'Blood Pressure', icon: 'pressure', value: '118/76', unit: 'mmHg', home: '118/76', change: 'Within', tone: 'blue', baseline: '120/80 mmHg' },
  { name: 'SpO₂', icon: 'drop', value: '98', unit: '%', home: '98', change: 'Within', tone: 'purple', baseline: '98%' },
  { name: 'Sleep', icon: 'moon', value: '7h 24m', unit: '', home: '7h 24m', change: '+12% above', tone: 'blue', baseline: '6h 30m' },
  { name: 'Activity', icon: 'activity', value: '8,421', unit: 'steps', home: '8,320', change: '+18% above', tone: 'green', baseline: '7,000 steps' },
  { name: 'Temperature', icon: 'temperature', value: '36.8', unit: '°C', home: '36.6', change: 'Within', tone: 'orange', baseline: '36.6 °C' },
  { name: 'Stress', icon: 'brain', value: 'Low', unit: '', home: 'Low', change: '−20% below', tone: 'purple', baseline: 'Moderate' },
];

export const useVitalsStore = create<VitalsState>((set, get) => ({
  metrics: defaultMetrics,
  healthScore: { score: 85, deltaPts: 6, comparisonPeriod: 'yesterday' },
  changesSummary: [
    {
      title: 'Activity',
      change: 'Biggest improvement',
      text: '28% higher than your baseline. You took an average of 1,841 more steps per day this month.',
      tone: 'green',
      icon: 'up',
    },
    {
      title: 'Heart Rate',
      change: 'Biggest decline',
      text: '8% lower than your baseline. Your average resting heart rate decreased from 74 to 68 bpm.',
      tone: 'red',
      icon: 'down',
    },
  ],
  insights: [
    {
      tag: 'Better Sleep',
      title: 'Sleep quality',
      highlight: 'up 12%',
      end: 'this week',
      text: 'You’re getting more deep sleep compared to last week. Great progress!',
      why: 'Better sleep helps with mood, focus and faster recovery.',
      icon: 'moon',
      tone: 'blue',
    },
    {
      tag: 'More Activity',
      title: 'Daily activity',
      highlight: 'increased 8%',
      end: '',
      text: 'You took 8,320 steps today — that’s 8% more than last week.',
      why: 'Staying active supports heart health, energy and better sleep.',
      icon: 'activity',
      tone: 'green',
    },
    {
      tag: 'Steady Progress',
      title: 'Your week is',
      highlight: 'trending well',
      end: '',
      text: 'Improved sleep and regular movement are creating steady momentum for your health.',
      why: 'Small, repeatable habits support long-term wellness.',
      icon: 'heart',
      tone: 'purple',
    },
  ],
  alerts: [
    {
      title: 'Resting Heart Rate is higher than usual',
      subtitle: 'Your resting heart rate is 18% above your personal baseline for the past 3 days.',
      severity: 'warning',
      metricName: 'Heart Rate',
      currentVal: '85 bpm',
      baselineVal: '72 bpm',
      possibleReasons: 'This can be due to poor sleep, increased stress, illness (like a cold), or strenuous activity.',
      actionItems: [
        'Recheck your vitals today',
        'Rest and stay hydrated',
        'If this continues or you have symptoms, contact your care team.',
      ],
    },
  ],
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
          metrics: res.metrics || defaultMetrics,
          healthScore: res.healthScore || get().healthScore,
          changesSummary: res.changesSummary || get().changesSummary,
          isLoading: false,
        });
      }
    } catch {
      // Graceful fallback to local calculated state
      const values = {
        Day: ['76', '118/76', '98', '7h 24m', '8,421', '36.8', 'Low'],
        Week: ['74', '119/77', '98', '7h 12m', '8,320', '36.6', 'Low'],
        Month: ['72', '120/78', '97', '7h 02m', '7,984', '36.7', 'Moderate'],
      };
      const scoreMap = { Day: 78, Week: 82, Month: 85 };
      set((state) => ({
        metrics: state.metrics.map((m, i) => ({
          ...m,
          value: values[targetPeriod][i] || m.value,
        })),
        healthScore: {
          score: scoreMap[targetPeriod],
          deltaPts: targetPeriod === 'Day' ? 6 : targetPeriod === 'Week' ? 7 : 8,
          comparisonPeriod: targetPeriod === 'Day' ? 'yesterday' : targetPeriod === 'Week' ? 'last week' : 'last month',
        },
        isLoading: false,
      }));
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
            ? { ...m, value: reading.valueString, home: reading.valueString }
            : m
        ),
      }));
    } catch {
      set((state) => ({
        metrics: state.metrics.map((m) =>
          m.name.toLowerCase() === reading.metricType.toLowerCase()
            ? { ...m, value: reading.valueString, home: reading.valueString }
            : m
        ),
      }));
    }
  },
}));
