import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

export interface CareTask {
  id: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  name: string;
  description: string;
  icon: string;
  tone: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  status: 'Completed' | 'Pending' | 'Upcoming';
}

export interface CarePlanData {
  date: string;
  planTitle: string;
  adherencePercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  nextTask: CareTask | null;
  overallStatus: string;
  tasks: CareTask[];
  careTeamNotes: Array<{ doctor: string; date: string; note: string }>;
  whyItMatters: {
    title: string;
    description: string;
    points: string[];
  };
  fullCarePlan: {
    title: string;
    description: string;
    rows: string[];
  };
}

interface CareState {
  carePlan: CarePlanData;
  selectedDate: string;
  collapsedPeriods: string[];
  isLoading: boolean;
  error: string | null;

  setSelectedDate: (date: string) => void;
  shiftDate: (daysDelta: number) => void;
  fetchCarePlan: (date?: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  markAllCompleted: () => Promise<void>;
  togglePeriodCollapse: (period: string) => void;
}

const defaultTasks: CareTask[] = [
  {
    id: 'tsk-1',
    period: 'Morning',
    time: '8:00 AM',
    name: 'Take morning medication',
    description: 'Lisinopril 10 mg · 1 tablet',
    icon: 'pill',
    tone: 'blue',
    status: 'Completed',
  },
  {
    id: 'tsk-2',
    period: 'Morning',
    time: '8:30 AM',
    name: 'Log breakfast',
    description: 'Add a quick note or photo',
    icon: 'food',
    tone: 'green',
    status: 'Completed',
  },
  {
    id: 'tsk-3',
    period: 'Morning',
    time: '9:00 AM',
    name: 'Light activity',
    description: '10–20 minutes of walking or stretching',
    icon: 'activity',
    tone: 'blue',
    status: 'Pending',
  },
  {
    id: 'tsk-4',
    period: 'Afternoon',
    time: '12:30 PM',
    name: 'Lunch & log meal',
    description: 'Record what you eat',
    icon: 'food',
    tone: 'green',
    status: 'Upcoming',
  },
  {
    id: 'tsk-5',
    period: 'Afternoon',
    time: '3:00 PM',
    name: 'Check vitals',
    description: 'Blood pressure, heart rate, oxygen (SpO₂)',
    icon: 'heart',
    tone: 'red',
    status: 'Upcoming',
  },
  {
    id: 'tsk-6',
    period: 'Evening',
    time: '9:00 PM',
    name: 'Sleep prep',
    description: 'Take medication and get ready for bed',
    icon: 'bed',
    tone: 'purple',
    status: 'Upcoming',
  },
];

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const initialPlan: CarePlanData = {
  date: getTodayStr(),
  planTitle: 'Hypertension Care Plan',
  adherencePercentage: 33,
  completedTasksCount: 2,
  totalTasksCount: 6,
  nextTask: defaultTasks[2],
  overallStatus: 'On track',
  tasks: defaultTasks,
  careTeamNotes: [
    { doctor: 'Sarah Kim, NP', date: 'Apr 28, 2025', note: 'Your blood pressure has been steady this week. Keep up the good work!' },
    { doctor: 'Dr. Neha Verma', date: 'Apr 25, 2025', note: 'Keep recording your daily readings.' },
  ],
  whyItMatters: {
    title: 'Why this matters',
    description: "Today's plan is based on your hypertension care plan and recent readings. These activities help keep your blood pressure stable, support your heart health, and track your progress.",
    points: [
      'Take medications as prescribed by your care team.',
      'Follow your personalized activity and meal plan.',
      'Track your readings and discuss changes at your next appointment.',
    ],
  },
  fullCarePlan: {
    title: 'Full care plan',
    description: 'Hypertension care plan · Weekly overview',
    rows: [
      'Daily: Morning medication, meals, light activity and vital readings.',
      'Weekly: Review your health trends with your care team.',
      'Next review: May 5, 2025 · Dr. Neha Verma.',
    ],
  },
};

export const useCareStore = create<CareState>((set, get) => ({
  carePlan: initialPlan,
  selectedDate: getTodayStr(),
  collapsedPeriods: [],
  isLoading: false,
  error: null,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().fetchCarePlan(date);
  },

  shiftDate: (daysDelta: number) => {
    const currentDateStr = get().selectedDate;
    const d = new Date(`${currentDateStr}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + daysDelta);
    const newDateStr = d.toISOString().slice(0, 10);
    get().setSelectedDate(newDateStr);
  },

  fetchCarePlan: async (date) => {
    const targetDate = date || get().selectedDate;
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.care.getPlan(targetDate);
      if (res) {
        set({ carePlan: res, isLoading: false });
      }
    } catch {
      set((state) => ({
        carePlan: { ...state.carePlan, date: targetDate },
        isLoading: false,
      }));
    }
  },

  toggleTask: async (taskId: string) => {
    const { selectedDate, carePlan } = get();
    // Optimistic local update
    const updatedTasks = carePlan.tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: (t.status === 'Completed' ? 'Pending' : 'Completed') as CareTask['status'] }
        : t
    );
    const completedCount = updatedTasks.filter((t) => t.status === 'Completed').length;
    const adherence = Math.round((completedCount / updatedTasks.length) * 100);
    const nextTask = updatedTasks.find((t) => t.status !== 'Completed') || null;

    set({
      carePlan: {
        ...carePlan,
        tasks: updatedTasks,
        completedTasksCount: completedCount,
        adherencePercentage: adherence,
        nextTask,
      },
    });

    try {
      await apiClient.care.toggleTask(taskId, selectedDate);
    } catch {
    }
  },

  markAllCompleted: async () => {
    const { selectedDate, carePlan } = get();
    const updatedTasks = carePlan.tasks.map((t) => ({ ...t, status: 'Completed' as const }));
    set({
      carePlan: {
        ...carePlan,
        tasks: updatedTasks,
        completedTasksCount: updatedTasks.length,
        adherencePercentage: 100,
        nextTask: null,
      },
    });

    try {
      await apiClient.care.markAllTasks(selectedDate);
    } catch {
    }
  },

  togglePeriodCollapse: (period: string) => {
    set((state) => ({
      collapsedPeriods: state.collapsedPeriods.includes(period)
        ? state.collapsedPeriods.filter((p) => p !== period)
        : [...state.collapsedPeriods, period],
    }));
  },
}));
