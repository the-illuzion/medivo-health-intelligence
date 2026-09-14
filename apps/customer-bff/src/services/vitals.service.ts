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

class VitalsService {
  private baseMetrics: VitalMetric[] = [
    { name: 'Heart Rate', icon: 'heart', value: '76', unit: 'bpm', home: '72', change: '+8% above', tone: 'red', baseline: '70 bpm', description: 'Your resting heart rate has been above your personal baseline for 3 days. Keep track of changes and share persistent changes with your care team.' },
    { name: 'Blood Pressure', icon: 'pressure', value: '118/76', unit: 'mmHg', home: '118/76', change: 'Within', tone: 'blue', baseline: '120/80 mmHg', description: 'Your blood pressure readings help you follow patterns over time. Compare your daily readings with your usual range.' },
    { name: 'SpO₂', icon: 'drop', value: '98', unit: '%', home: '98', change: 'Within', tone: 'purple', baseline: '98%', description: 'Blood oxygen saturation measures how well oxygen is distributed to your body tissues.' },
    { name: 'Sleep', icon: 'moon', value: '7h 24m', unit: '', home: '7h 24m', change: '+12% above', tone: 'blue', baseline: '6h 30m', description: 'Sleep duration and restorative sleep stages play a vital role in recovery and immune health.' },
    { name: 'Activity', icon: 'activity', value: '8,421', unit: 'steps', home: '8,320', change: '+18% above', tone: 'green', baseline: '7,000 steps', description: 'Daily movement supports cardiovascular health, metabolic efficiency, and mental wellness.' },
    { name: 'Temperature', icon: 'temperature', value: '36.8', unit: '°C', home: '36.6', change: 'Within', tone: 'orange', baseline: '36.6 °C', description: 'Body temperature monitoring can indicate immune response and baseline circadian shifts.' },
    { name: 'Stress', icon: 'brain', value: 'Low', unit: '', home: 'Low', change: '−20% below', tone: 'purple', baseline: 'Moderate', description: 'Autonomic nervous system recovery calculated from Heart Rate Variability (HRV).' },
  ];

  private periodValues: Record<'Day' | 'Week' | 'Month', string[]> = {
    Day: ['76', '118/76', '98', '7h 24m', '8,421', '36.8', 'Low'],
    Week: ['74', '119/77', '98', '7h 12m', '8,320', '36.6', 'Low'],
    Month: ['72', '120/78', '97', '7h 02m', '7,984', '36.7', 'Moderate'],
  };

  private insightsList: HealthInsight[] = [
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
  ];

  private activeAlert: HealthAlert = {
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
  };

  public getVitals(_userId: string, period: 'Day' | 'Week' | 'Month' = 'Day') {
    const periodIdx = ['Day', 'Week', 'Month'].indexOf(period);
    const scoreMap = { Day: 78, Week: 82, Month: 85 };
    const deltaMap = { Day: 6, Week: 7, Month: 8 };

    const metrics = this.baseMetrics.map((m, idx) => ({
      ...m,
      value: this.periodValues[period][idx] || m.value,
      change: idx === 0 ? (['+8% above', '+5% above', 'Within'][periodIdx]) : m.change,
    }));

    const healthScore: HealthScoreInfo = {
      score: scoreMap[period],
      deltaPts: deltaMap[period],
      comparisonPeriod: period === 'Day' ? 'yesterday' : period === 'Week' ? 'last week' : 'last month',
    };

    const changesMap: Record<'Day' | 'Week' | 'Month', HealthChangeSummary[]> = {
      Day: [
        {
          title: 'Activity',
          change: 'Biggest improvement',
          text: '22% higher than your baseline. You took 8,421 steps today.',
          tone: 'green',
          icon: 'up',
        },
        {
          title: 'Heart Rate',
          change: 'Elevated today',
          text: '5% higher resting heart rate (76 bpm) compared to your 70 bpm personal baseline.',
          tone: 'red',
          icon: 'down',
        },
      ],
      Week: [
        {
          title: 'Activity',
          change: 'Biggest improvement',
          text: '18% higher than your baseline. You averaged 8,320 steps per day this week.',
          tone: 'green',
          icon: 'up',
        },
        {
          title: 'Heart Rate',
          change: 'Trend normalizing',
          text: 'Average resting heart rate stabilized at 74 bpm across the past 7 days.',
          tone: 'red',
          icon: 'down',
        },
      ],
      Month: [
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
    };

    const changesSummary: HealthChangeSummary[] = changesMap[period] || changesMap.Day;

    return {
      period,
      healthScore,
      metrics,
      changesSummary,
      itemsToWatchCount: this.getAlerts(_userId).length,
    };
  }

  public getVitalByName(_userId: string, name: string): VitalMetric {
    const found = this.baseMetrics.find((m) => m.name.toLowerCase() === name.toLowerCase());
    return (
      found || {
        name,
        icon: 'heart',
        value: '72',
        unit: 'bpm',
        home: '72',
        change: 'Within',
        tone: 'blue',
        baseline: '70 bpm',
        description: `Your ${name.toLowerCase()} readings help you follow patterns over time.`,
      }
    );
  }

  public getInsights(_userId: string): HealthInsight[] {
    return this.insightsList;
  }

  public getAlerts(_userId: string): HealthAlert[] {
    return [this.activeAlert];
  }

  public addManualReading(_userId: string, dto: { metricType: string; valueString: string; unit?: string; source?: string }) {
    const existing = this.baseMetrics.find((m) => m.name.toLowerCase() === dto.metricType.toLowerCase());
    if (existing) {
      existing.value = dto.valueString;
      existing.home = dto.valueString;
    }
    return { success: true, reading: dto };
  }
}

export const vitalsService = new VitalsService();
