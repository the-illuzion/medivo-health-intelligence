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

export interface CarePlanResponse {
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

class CareService {
  private demoTasks: CareTask[] = [
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

  // In-memory store per user per date
  private plansStore = new Map<string, CareTask[]>();

  private getStoreKey(userId: string, date: string) {
    return `${userId}:${date}`;
  }

  public getCarePlan(userId: string, date: string): CarePlanResponse {
    const isDemo = userId === 'usr-101' || userId.toLowerCase().includes('demo');
    const key = this.getStoreKey(userId, date);

    if (!this.plansStore.has(key)) {
      if (isDemo) {
        this.plansStore.set(key, this.demoTasks.map((t) => ({ ...t })));
      } else {
        this.plansStore.set(key, []);
      }
    }

    const tasks = this.plansStore.get(key)!;
    const completedCount = tasks.filter((t) => t.status === 'Completed').length;
    const adherence = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    const nextTask = tasks.find((t) => t.status !== 'Completed') || null;

    return {
      date,
      planTitle: isDemo ? 'Hypertension Care Plan' : tasks.length > 0 ? 'Active Care Plan' : 'General Care Plan',
      adherencePercentage: adherence,
      completedTasksCount: completedCount,
      totalTasksCount: tasks.length,
      nextTask,
      overallStatus:
        tasks.length === 0
          ? 'No tasks scheduled'
          : adherence >= 70
            ? 'On track'
            : adherence >= 30
              ? 'In progress'
              : 'Needs attention',
      tasks,
      careTeamNotes: isDemo
        ? [
            { doctor: 'Sarah Kim, NP', date: 'Apr 28, 2025', note: 'Your blood pressure has been steady this week. Keep up the good work!' },
            { doctor: 'Dr. Neha Verma', date: 'Apr 25, 2025', note: 'Keep recording your daily readings.' },
          ]
        : [],
      whyItMatters: {
        title: 'Why this matters',
        description: isDemo
          ? "Today's plan is based on your hypertension care plan and recent readings. These activities help keep your blood pressure stable, support your heart health, and track your progress."
          : 'Your care plan adapts dynamically based on your recorded scans, medications, and connected health devices.',
        points: [
          'Take medications as prescribed by your care team.',
          'Follow your personalized activity and meal plan.',
          'Track your readings and discuss changes at your next appointment.',
        ],
      },
      fullCarePlan: {
        title: 'Full care plan',
        description: isDemo ? 'Hypertension care plan · Weekly overview' : 'Personal health schedule',
        rows: isDemo
          ? [
              'Daily: Morning medication, meals, light activity and vital readings.',
              'Weekly: Review your health trends with your care team.',
              'Next review: May 5, 2025 · Dr. Neha Verma.',
            ]
          : ['No active restrictions recorded. Complete regular scans to build personalized schedules.'],
      },
    };
  }

  public toggleTaskStatus(userId: string, date: string, taskId: string, explicitStatus?: 'Completed' | 'Pending' | 'Upcoming') {
    const key = this.getStoreKey(userId, date);
    if (!this.plansStore.has(key)) {
      this.getCarePlan(userId, date);
    }

    const tasks = this.plansStore.get(key) || [];
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return null;

    if (explicitStatus) {
      task.status = explicitStatus;
    } else {
      task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    }

    return this.getCarePlan(userId, date);
  }

  public markAllDone(userId: string, date: string) {
    const key = this.getStoreKey(userId, date);
    if (!this.plansStore.has(key)) {
      this.getCarePlan(userId, date);
    }

    const tasks = this.plansStore.get(key) || [];
    tasks.forEach((t) => {
      t.status = 'Completed';
    });

    return this.getCarePlan(userId, date);
  }

  public recordScanAction(userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const key = this.getStoreKey(userId, today);
    if (!this.plansStore.has(key)) {
      this.plansStore.set(key, []);
    }
    const tasks = this.plansStore.get(key)!;
    const existing = tasks.find((t) => t.name === 'Optical AI Health Scan');
    if (!existing) {
      tasks.unshift({
        id: `tsk-scan-${Date.now()}`,
        period: 'Morning',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        name: 'Optical AI Health Scan',
        description: 'Biometric facial scan completed',
        icon: 'heart',
        tone: 'green',
        status: 'Completed',
      });
    }
  }

  public addMedicationTask(userId: string, name: string, dosage: string, frequency = 'Daily') {
    const today = new Date().toISOString().slice(0, 10);
    const key = this.getStoreKey(userId, today);
    if (!this.plansStore.has(key)) {
      this.plansStore.set(key, []);
    }
    const tasks = this.plansStore.get(key)!;
    tasks.push({
      id: `tsk-med-${Date.now()}`,
      period: 'Morning',
      time: '8:00 AM',
      name: `Take ${name}`,
      description: `${dosage} · ${frequency}`,
      icon: 'pill',
      tone: 'blue',
      status: 'Pending',
    });
  }
}

export const careService = new CareService();

