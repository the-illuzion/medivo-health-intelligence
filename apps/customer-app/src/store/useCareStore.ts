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

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const initialPlan: CarePlanData = {
  date: getTodayStr(),
  planTitle: 'General Care Plan',
  adherencePercentage: 0,
  completedTasksCount: 0,
  totalTasksCount: 0,
  nextTask: null,
  overallStatus: 'No tasks scheduled',
  tasks: [],
  careTeamNotes: [],
  whyItMatters: {
    title: 'Daily Care Plan',
    description: 'Your care plan adapts dynamically based on your recorded scans, medications, and connected health devices.',
    points: [
      'Take daily face scans to establish clinical baselines.',
      'Connect wearables for continuous health telemetry.',
      'Review recommendations with your clinician.',
    ],
  },
  fullCarePlan: {
    title: 'Personalized Care Plan',
    description: 'Personal health schedule',
    rows: ['No active restrictions recorded. Complete regular scans to build personalized schedules.'],
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
