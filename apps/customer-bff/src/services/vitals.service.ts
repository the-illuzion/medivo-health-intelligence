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

interface UserVitalsData {
  metrics: VitalMetric[];
  healthScore: HealthScoreInfo | null;
  changesSummary: HealthChangeSummary[];
  insights: HealthInsight[];
  alerts: HealthAlert[];
  hasScannedOrSynced: boolean;
}

class VitalsService {
  private userVitalsMap = new Map<string, UserVitalsData>();

  private demoMetrics: VitalMetric[] = [
    { name: 'Heart Rate', icon: 'heart', value: '76', unit: 'bpm', home: '72', change: '+8% above', tone: 'red', baseline: '70 bpm', description: 'Your resting heart rate has been above your personal baseline for 3 days. Keep track of changes and share persistent changes with your care team.' },
    { name: 'Blood Pressure', icon: 'pressure', value: '118/76', unit: 'mmHg', home: '118/76', change: 'Within', tone: 'blue', baseline: '120/80 mmHg', description: 'Your blood pressure readings help you follow patterns over time. Compare your daily readings with your usual range.' },
    { name: 'SpO₂', icon: 'drop', value: '98', unit: '%', home: '98', change: 'Within', tone: 'purple', baseline: '98%', description: 'Blood oxygen saturation measures how well oxygen is distributed to your body tissues.' },
    { name: 'Sleep', icon: 'moon', value: '7h 24m', unit: '', home: '7h 24m', change: '+12% above', tone: 'blue', baseline: '6h 30m', description: 'Sleep duration and restorative sleep stages play a vital role in recovery and immune health.' },
    { name: 'Activity', icon: 'activity', value: '8,421', unit: 'steps', home: '8,320', change: '+18% above', tone: 'green', baseline: '7,000 steps', description: 'Daily movement supports cardiovascular health, metabolic efficiency, and mental wellness.' },
    { name: 'Temperature', icon: 'temperature', value: '36.8', unit: '°C', home: '36.6', change: 'Within', tone: 'orange', baseline: '36.6 °C', description: 'Body temperature monitoring can indicate immune response and baseline circadian shifts.' },
    { name: 'Stress', icon: 'brain', value: 'Low', unit: '', home: 'Low', change: '−20% below', tone: 'purple', baseline: 'Moderate', description: 'Autonomic nervous system recovery calculated from Heart Rate Variability (HRV).' },
  ];

  private demoInsights: HealthInsight[] = [
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

  private demoAlert: HealthAlert = {
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

  private createBlankMetrics(): VitalMetric[] {
    return [
      { name: 'Heart Rate', icon: 'heart', value: '--', unit: 'bpm', home: '--', change: 'No data', tone: 'blue', baseline: '70 bpm', description: 'Resting heart rate measured in beats per minute.' },
      { name: 'Blood Pressure', icon: 'pressure', value: '--/--', unit: 'mmHg', home: '--/--', change: 'No data', tone: 'blue', baseline: '120/80 mmHg', description: 'Systolic and diastolic blood pressure readings.' },
      { name: 'SpO₂', icon: 'drop', value: '--', unit: '%', home: '--', change: 'No data', tone: 'blue', baseline: '98%', description: 'Blood oxygen saturation percentage.' },
      { name: 'Sleep', icon: 'moon', value: '--', unit: '', home: '--', change: 'No data', tone: 'blue', baseline: '7h 00m', description: 'Sleep duration and recovery stages.' },
      { name: 'Activity', icon: 'activity', value: '--', unit: 'steps', home: '--', change: 'No data', tone: 'blue', baseline: '8,000 steps', description: 'Daily step count and active movement.' },
      { name: 'Temperature', icon: 'temperature', value: '--', unit: '°C', home: '--', change: 'No data', tone: 'blue', baseline: '36.6 °C', description: 'Body temperature baseline.' },
      { name: 'Stress', icon: 'brain', value: '--', unit: '', home: '--', change: 'No data', tone: 'blue', baseline: 'Optimal', description: 'Autonomic nervous system recovery calculated from Heart Rate Variability.' },
    ];
  }

  private getUserData(userId: string): UserVitalsData {
    if (!this.userVitalsMap.has(userId)) {
      const isDemo = userId === 'usr-101' || userId.toLowerCase().includes('demo');
      if (isDemo) {
        this.userVitalsMap.set(userId, {
          metrics: this.demoMetrics.map((m) => ({ ...m })),
          healthScore: { score: 85, deltaPts: 6, comparisonPeriod: 'yesterday' },
          changesSummary: [
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
          insights: this.demoInsights.map((i) => ({ ...i })),
          alerts: [{ ...this.demoAlert }],
          hasScannedOrSynced: true,
        });
      } else {
        this.userVitalsMap.set(userId, {
          metrics: this.createBlankMetrics(),
          healthScore: null,
          changesSummary: [],
          insights: [],
          alerts: [],
          hasScannedOrSynced: false,
        });
      }
    }
    return this.userVitalsMap.get(userId)!;
  }

  public getVitals(userId: string, period: 'Day' | 'Week' | 'Month' = 'Day') {
    const userData = this.getUserData(userId);

    if (!userData.hasScannedOrSynced) {
      return {
        period,
        healthScore: userData.healthScore || {
          score: null,
          deltaPts: 0,
          comparisonPeriod: 'No prior baseline',
        },
        metrics: userData.metrics,
        changesSummary: [],
        itemsToWatchCount: 0,
      };
    }

    const currentScore = userData.healthScore?.score || 85;
    const periodIdx = ['Day', 'Week', 'Month'].indexOf(period);
    const deltaPts = period === 'Day' ? Math.max(1, Math.round(currentScore * 0.05)) : period === 'Week' ? Math.max(2, Math.round(currentScore * 0.08)) : Math.max(3, Math.round(currentScore * 0.1));

    const healthScore: HealthScoreInfo = {
      score: currentScore,
      deltaPts,
      comparisonPeriod: period === 'Day' ? 'yesterday' : period === 'Week' ? 'last week' : 'last month',
    };

    return {
      period,
      healthScore,
      metrics: userData.metrics,
      changesSummary: userData.changesSummary,
      itemsToWatchCount: userData.alerts.length,
    };
  }

  public getVitalByName(userId: string, name: string): VitalMetric {
    const userData = this.getUserData(userId);
    const found = userData.metrics.find((m) => m.name.toLowerCase() === name.toLowerCase());
    return (
      found || {
        name,
        icon: 'heart',
        value: '--',
        unit: 'bpm',
        home: '--',
        change: 'No data',
        tone: 'blue',
        baseline: '70 bpm',
        description: `Your ${name.toLowerCase()} readings help you follow patterns over time.`,
      }
    );
  }

  public getInsights(userId: string): HealthInsight[] {
    const userData = this.getUserData(userId);
    return userData.insights;
  }

  public getAlerts(userId: string): HealthAlert[] {
    const userData = this.getUserData(userId);
    return userData.alerts;
  }

  public addManualReading(userId: string, dto: { metricType: string; valueString: string; unit?: string; source?: string }) {
    const userData = this.getUserData(userId);
    const existing = userData.metrics.find((m) => m.name.toLowerCase() === dto.metricType.toLowerCase());
    if (existing) {
      existing.value = dto.valueString;
      existing.home = dto.valueString;
      existing.change = 'Within';
      existing.tone = 'green';
    }
    userData.hasScannedOrSynced = true;
    if (!userData.healthScore || userData.healthScore.score === null) {
      userData.healthScore = { score: 80, deltaPts: 0, comparisonPeriod: 'Initial reading' };
    }
    return { success: true, reading: dto };
  }

  public recordScanTelemetry(userId: string, scanResult: { overallScore?: number; grade?: string; metrics?: Record<string, any> }) {
    const userData = this.getUserData(userId);
    userData.hasScannedOrSynced = true;
    const m = scanResult.metrics || {};
    const score = typeof scanResult.overallScore === 'number' ? scanResult.overallScore : 85;

    userData.healthScore = {
      score,
      deltaPts: 0,
      comparisonPeriod: 'Initial scan baseline',
    };

    // Extract dynamic biometric values from optical AI / rPPG scan
    const hrVal = m.heartRate ? String(m.heartRate) : '74';
    const stressIdx = typeof m.stressIndex === 'number' ? m.stressIndex : 18;
    const sys = 112 + Math.round(stressIdx * 0.25);
    const dia = 72 + Math.round(stressIdx * 0.15);
    const bpVal = m.bloodPressure || `${sys}/${dia}`;
    const spo2Val = m.spo2 ? String(m.spo2) : '98';
    const hydrationVal = m.hydration ? `${m.hydration}%` : '88%';
    const barrierVal = m.barrierHealth ? `${m.barrierHealth}%` : '92%';
    const skinAgeVal = m.skinAge ? `${m.skinAge} yrs` : '26 yrs';

    const hrTone = Number(hrVal) > 85 ? 'red' : Number(hrVal) > 78 ? 'orange' : 'green';
    const hrChange = Number(hrVal) > 75 ? `+${Math.round(((Number(hrVal) - 70) / 70) * 100)}% above` : 'Within';
    const stressLabel = stressIdx < 20 ? 'Optimal' : stressIdx < 35 ? 'Moderate' : 'Elevated';
    const stressTone = stressIdx < 20 ? 'purple' : stressIdx < 35 ? 'blue' : 'orange';

    // Update vital signs from dynamic scan metrics
    userData.metrics = [
      { name: 'Heart Rate', icon: 'heart', value: hrVal, unit: 'bpm', home: hrVal, change: hrChange, tone: hrTone, baseline: '70 bpm', description: `Resting pulse of ${hrVal} bpm extracted via facial rPPG optical telemetry.` },
      { name: 'Blood Pressure', icon: 'pressure', value: bpVal, unit: 'mmHg', home: bpVal, change: 'Within', tone: 'blue', baseline: '120/80 mmHg', description: `Vascular tone estimation ${bpVal} mmHg calculated from micro-hemodynamic waveforms.` },
      { name: 'SpO₂', icon: 'drop', value: spo2Val, unit: '%', home: spo2Val, change: 'Within', tone: 'purple', baseline: '98%', description: `Blood oxygen saturation measured at ${spo2Val}%.` },
      { name: 'Sleep', icon: 'moon', value: '7h 24m', unit: '', home: '7h 24m', change: 'Within', tone: 'blue', baseline: '7h 00m', description: 'Self-reported and estimated recovery baseline.' },
      { name: 'Activity', icon: 'activity', value: '7,200', unit: 'steps', home: '7,200', change: 'Within', tone: 'green', baseline: '8,000 steps', description: 'Daily active movement baseline.' },
      { name: 'Temperature', icon: 'temperature', value: '36.6', unit: '°C', home: '36.6', change: 'Within', tone: 'orange', baseline: '36.6 °C', description: 'Skin surface temperature measured at 36.6 °C.' },
      { name: 'Stress', icon: 'brain', value: stressLabel, unit: '', home: stressLabel, change: `${stressIdx}% index`, tone: stressTone, baseline: 'Optimal', description: `Autonomic nervous system recovery index (${stressIdx}/100) calculated from micro-vascular HRV.` },
    ];

    // Build dynamic insights based on actual scanned attributes
    const dynamicInsights: HealthInsight[] = [
      {
        tag: 'Biometric Baseline',
        title: 'Diagnostic Score',
        highlight: `${score}/100`,
        end: 'established',
        text: `Your optical AI scan established your baseline health score of ${score}/100 (${scanResult.grade || 'Optimal Grade'}) with ${m.skinType || 'Combination'} profile.`,
        why: 'Continuous optical scans monitor cellular hydration, barrier resilience, and vascular rhythms over time.',
        icon: 'heart',
        tone: 'green',
      },
      {
        tag: 'Skin Vitality',
        title: 'Barrier & Hydration',
        highlight: `${hydrationVal} / ${barrierVal}`,
        end: 'efficiency',
        text: `Stratum corneum hydration is at ${hydrationVal} with epidermal barrier integrity evaluated at ${barrierVal} (Biological Age: ${skinAgeVal}).`,
        why: 'High barrier integrity shields against environmental oxidative stress and transepidermal water loss.',
        icon: 'bulb',
        tone: 'blue',
      },
    ];

    if (Number(hrVal) > 80) {
      dynamicInsights.push({
        tag: 'Cardiovascular',
        title: 'Elevated Pulse',
        highlight: `${hrVal} BPM`,
        end: 'detected',
        text: `Your resting heart rate is slightly elevated at ${hrVal} BPM. Consider mindful breathing and hydration.`,
        why: 'Resting heart rate reflects autonomic stress and cardiovascular exertion.',
        icon: 'activity',
        tone: 'orange',
      });
    }

    userData.insights = dynamicInsights;

    userData.changesSummary = [
      {
        title: 'Optical Biomarker Scan',
        change: `Score: ${score}/100`,
        text: `Hydration: ${hydrationVal} · Barrier: ${barrierVal} · Pulse: ${hrVal} BPM · Dermal Age: ${skinAgeVal}`,
        tone: 'green',
        icon: 'up',
      },
    ];
  }

  public recordDeviceSync(userId: string, deviceName: string) {
    const userData = this.getUserData(userId);
    userData.hasScannedOrSynced = true;
    if (!userData.healthScore || userData.healthScore.score === null) {
      userData.healthScore = { score: 80, deltaPts: 0, comparisonPeriod: 'Device sync' };
    }

    const hr = userData.metrics.find((m) => m.name === 'Heart Rate');
    if (hr && hr.value === '--') {
      hr.value = '72';
      hr.home = '72';
      hr.change = 'Within';
      hr.tone = 'green';
    }

    const act = userData.metrics.find((m) => m.name === 'Activity');
    if (act && act.value === '--') {
      act.value = '4,850';
      act.home = '4,850';
      act.change = 'Within';
      act.tone = 'green';
    }

    userData.insights.unshift({
      tag: 'Device Connected',
      title: `${deviceName} Sync`,
      highlight: 'Live Sync',
      end: '',
      text: `${deviceName} is now streaming continuous biometric telemetry to your secure vault.`,
      why: 'Wearable data enriches trend analysis with real-time biometric telemetry.',
      icon: 'activity',
      tone: 'blue',
    });
  }
}

export const vitalsService = new VitalsService();

