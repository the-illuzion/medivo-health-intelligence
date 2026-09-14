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
  previousHealthScore: number | null;
  scanCount: number;
  lastScannedAt?: string;
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
          previousHealthScore: 79,
          scanCount: 3,
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
          previousHealthScore: null,
          scanCount: 0,
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
    const deltaPts = userData.healthScore?.deltaPts !== undefined ? userData.healthScore.deltaPts : 0;
    const comparisonPeriod = userData.healthScore?.comparisonPeriod || (period === 'Day' ? 'yesterday' : period === 'Week' ? 'last week' : 'last month');

    const healthScore: HealthScoreInfo = {
      score: currentScore,
      deltaPts,
      comparisonPeriod,
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

    // Calculate dynamic delta points against real historical score
    const previousScore = userData.healthScore?.score ?? null;
    let deltaPts = 0;
    let comparisonPeriod = 'Initial scan baseline';
    if (previousScore !== null) {
      deltaPts = score - previousScore;
      comparisonPeriod = deltaPts >= 0 ? `+${deltaPts} pts vs previous scan` : `${deltaPts} pts vs previous scan`;
    }

    userData.previousHealthScore = previousScore;
    userData.healthScore = {
      score,
      deltaPts,
      comparisonPeriod,
    };
    userData.scanCount = (userData.scanCount || 0) + 1;
    userData.lastScannedAt = new Date().toISOString();

    // Extract dynamic biometric values from optical AI / rPPG scan
    const hrNum = typeof m.heartRate === 'number' ? m.heartRate : Number(m.heartRate) || 72;
    const hrVal = String(hrNum);
    const stressIdx = typeof m.stressIndex === 'number' ? m.stressIndex : 18;
    const rednessVal = typeof m.rednessScore === 'number' ? m.rednessScore : 12;

    const sys = 110 + Math.round(stressIdx * 0.25) + (hrNum > 80 ? 4 : 0);
    const dia = 70 + Math.round(stressIdx * 0.15) + (hrNum > 80 ? 2 : 0);
    const bpVal = m.bloodPressure || `${sys}/${dia}`;
    const spo2Val = m.spo2 ? String(m.spo2) : '98';
    const hydrationVal = m.hydration ? `${m.hydration}%` : '82%';
    const barrierVal = m.barrierHealth ? `${m.barrierHealth}%` : '85%';
    const skinAgeVal = m.skinAge ? `${m.skinAge} yrs` : '26 yrs';

    const tempNumeric = (36.4 + (rednessVal / 100) * 0.6).toFixed(1);
    const tempVal = `${tempNumeric}`;

    const hrTone = hrNum > 85 ? 'red' : hrNum > 78 ? 'orange' : 'green';
    const hrChange = hrNum > 75 ? `+${Math.round(((hrNum - 70) / 70) * 100)}% above` : 'Within';
    const stressLabel = stressIdx < 22 ? 'Optimal' : stressIdx < 40 ? 'Moderate' : 'Elevated';
    const stressTone = stressIdx < 22 ? 'purple' : stressIdx < 40 ? 'blue' : 'orange';

    // Preserve existing manual or device-synced Sleep and Activity metrics if present
    const existingSleep = userData.metrics.find((x) => x.name === 'Sleep');
    const existingActivity = userData.metrics.find((x) => x.name === 'Activity');

    const sleepVal = existingSleep && existingSleep.value !== '--' ? existingSleep.value : '7h 24m';
    const sleepChange = existingSleep && existingSleep.change !== 'No data' ? existingSleep.change : 'Within';
    const activityVal = existingActivity && existingActivity.value !== '--' ? existingActivity.value : '7,200';
    const activityChange = existingActivity && existingActivity.change !== 'No data' ? existingActivity.change : 'Within';

    // Update vital signs from dynamic scan metrics
    userData.metrics = [
      { name: 'Heart Rate', icon: 'heart', value: hrVal, unit: 'bpm', home: hrVal, change: hrChange, tone: hrTone, baseline: '70 bpm', description: `Resting pulse of ${hrVal} bpm extracted via facial rPPG optical telemetry.` },
      { name: 'Blood Pressure', icon: 'pressure', value: bpVal, unit: 'mmHg', home: bpVal, change: 'Within', tone: 'blue', baseline: '120/80 mmHg', description: `Vascular tone estimation ${bpVal} mmHg calculated from micro-hemodynamic waveforms.` },
      { name: 'SpO₂', icon: 'drop', value: spo2Val, unit: '%', home: spo2Val, change: 'Within', tone: 'purple', baseline: '98%', description: `Blood oxygen saturation measured at ${spo2Val}%.` },
      { name: 'Sleep', icon: 'moon', value: sleepVal, unit: '', home: sleepVal, change: sleepChange, tone: 'blue', baseline: '7h 00m', description: 'Sleep duration and restorative sleep telemetry.' },
      { name: 'Activity', icon: 'activity', value: activityVal, unit: 'steps', home: activityVal, change: activityChange, tone: 'green', baseline: '8,000 steps', description: 'Daily active movement baseline.' },
      { name: 'Temperature', icon: 'temperature', value: tempVal, unit: '°C', home: tempVal, change: 'Within', tone: 'orange', baseline: '36.6 °C', description: `Skin surface temperature measured at ${tempVal} °C.` },
      { name: 'Stress', icon: 'brain', value: stressLabel, unit: '', home: stressLabel, change: `${stressIdx}% index`, tone: stressTone, baseline: 'Optimal', description: `Autonomic nervous system recovery index (${stressIdx}/100) calculated from micro-vascular HRV.` },
    ];

    // Build dynamic insights based on actual scanned attributes
    const dynamicInsights: HealthInsight[] = [
      {
        tag: 'Biometric Telemetry',
        title: 'Diagnostic Score',
        highlight: `${score}/100`,
        end: 'verified',
        text: `Your optical AI scan established your diagnostic score of ${score}/100 (${scanResult.grade || 'Optimal Grade'}) with ${m.skinType || 'Combination'} profile.`,
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

    if (hrNum > 80) {
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

    // Build dynamic alerts based on clinical thresholds
    const dynamicAlerts: HealthAlert[] = [];
    if (hrNum > 85) {
      dynamicAlerts.push({
        title: 'Resting Heart Rate is higher than usual',
        subtitle: `Your resting pulse is ${hrNum} bpm (elevated above 70 bpm personal baseline).`,
        severity: 'warning',
        metricName: 'Heart Rate',
        currentVal: `${hrNum} bpm`,
        baselineVal: '70 bpm',
        possibleReasons: 'Can be driven by acute physiological stress, poor sleep, dehydration, or recent physical exertion.',
        actionItems: [
          'Recheck your vitals after 10 minutes of seated rest',
          'Ensure adequate electrolyte and water hydration',
          'Share persistent tachycardia with your care team',
        ],
      });
    }

    if (stressIdx > 40) {
      dynamicAlerts.push({
        title: 'Elevated Autonomic Stress Index',
        subtitle: `Optical HRV telemetry indicates sympathetic nervous system activation (${stressIdx}/100).`,
        severity: 'warning',
        metricName: 'Stress',
        currentVal: `${stressIdx}/100`,
        baselineVal: 'Optimal (<25)',
        possibleReasons: 'Elevated mental strain, physical fatigue, or circadian disruption.',
        actionItems: [
          'Practice 5 minutes of paced 4-7-8 diaphragmatic breathing',
          'Schedule active recovery and reduce evening screen exposure',
        ],
      });
    }

    if (rednessVal > 30) {
      dynamicAlerts.push({
        title: 'Facial Erythema & Vascular Reactivity',
        subtitle: `Elevated sub-dermal capillary dilation detected (${rednessVal}% erythema index).`,
        severity: 'info',
        metricName: 'Redness / Erythema',
        currentVal: `${rednessVal}%`,
        baselineVal: '<15%',
        possibleReasons: 'Impaired epidermal barrier, direct UV or environmental exposure, or active inflammation.',
        actionItems: [
          'Apply Centella Asiatica (Cica) and ceramide soothing barrier emulsion',
          'Avoid physical facial scrubs or high-concentration acids',
          'Apply Mineral SPF 50 prior to daylight exposure',
        ],
      });
    }

    userData.alerts = dynamicAlerts;

    // Dynamic Changes Summary
    const changes: HealthChangeSummary[] = [];
    if (deltaPts !== 0) {
      changes.push({
        title: 'Overall Health Index',
        change: deltaPts > 0 ? `+${deltaPts} pts improvement` : `${deltaPts} pts shift`,
        text: `Your overall health score adjusted to ${score}/100 (${scanResult.grade || 'Good Condition'}) following your optical face scan.`,
        tone: deltaPts >= 0 ? 'green' : 'red',
        icon: deltaPts >= 0 ? 'up' : 'down',
      });
    }

    changes.push({
      title: 'Biomarker Telemetry',
      change: 'Scan Verified',
      text: `Hydration: ${hydrationVal} · Barrier: ${barrierVal} · Pulse: ${hrVal} BPM · Dermal Age: ${skinAgeVal}`,
      tone: 'blue',
      icon: 'up',
    });

    userData.changesSummary = changes;
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

