import { DatabasePool } from '../DatabasePool.js';

export async function seedDemoHealthData(): Promise<void> {
  const userId = 'usr-101';
  const today = new Date().toISOString().slice(0, 10);

  // 1. Seed Vitals Readings
  const vitals = [
    { id: 'vit-hr-1', metric_type: 'Heart Rate', value_numeric: 76, value_string: '76', unit: 'bpm', baseline_value: 70, change_pct: 8, change_label: '+8% above', tone: 'red', source: 'Apple Watch' },
    { id: 'vit-bp-1', metric_type: 'Blood Pressure', value_numeric: 118, value_string: '118/76', unit: 'mmHg', baseline_value: 120, change_pct: 0, change_label: 'Within', tone: 'blue', source: 'Withings BP Monitor' },
    { id: 'vit-spo2-1', metric_type: 'SpO₂', value_numeric: 98, value_string: '98', unit: '%', baseline_value: 98, change_pct: 0, change_label: 'Within', tone: 'purple', source: 'Apple Watch' },
    { id: 'vit-slp-1', metric_type: 'Sleep', value_numeric: 7.4, value_string: '7h 24m', unit: '', baseline_value: 6.6, change_pct: 12, change_label: '+12% above', tone: 'blue', source: 'Apple Watch' },
    { id: 'vit-act-1', metric_type: 'Activity', value_numeric: 8421, value_string: '8,421', unit: 'steps', baseline_value: 7100, change_pct: 18, change_label: '+18% above', tone: 'green', source: 'Apple Watch' },
    { id: 'vit-tmp-1', metric_type: 'Temperature', value_numeric: 36.8, value_string: '36.8', unit: '°C', baseline_value: 36.6, change_pct: 0, change_label: 'Within', tone: 'orange', source: 'Manual' },
    { id: 'vit-str-1', metric_type: 'Stress', value_numeric: 25, value_string: 'Low', unit: '', baseline_value: 40, change_pct: -20, change_label: '−20% below', tone: 'purple', source: 'Apple Watch' },
  ];

  for (const v of vitals) {
    try {
      await DatabasePool.query(
        `INSERT INTO health_schema.vitals_readings (id, user_id, metric_type, value_numeric, value_string, unit, baseline_value, change_pct, change_label, tone, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET value_string = EXCLUDED.value_string, value_numeric = EXCLUDED.value_numeric;`,
        [v.id, userId, v.metric_type, v.value_numeric, v.value_string, v.unit, v.baseline_value, v.change_pct, v.change_label, v.tone, v.source]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Vitals Warning]:', err.message);
    }
  }

  // 2. Seed Care Plan & Care Tasks
  try {
    const planId = `plan-${userId}-${today}`;
    const careNotes = [
      { doctor: 'Sarah Kim, NP', date: 'Apr 28, 2025', note: 'Your blood pressure has been steady this week. Keep up the good work!' },
      { doctor: 'Dr. Neha Verma', date: 'Apr 25, 2025', note: 'Keep recording your daily readings.' },
    ];
    const whyItMatters = "Today's plan is based on your hypertension care plan and recent readings. These activities help keep your blood pressure stable, support your heart health, and track your progress.";

    await DatabasePool.query(
      `INSERT INTO health_schema.care_plans (id, user_id, plan_date, title, adherence_pct, care_team_notes, why_it_matters)
       VALUES ($1, $2, $3, 'Hypertension Care Plan', 33, $4, $5)
       ON CONFLICT (user_id, plan_date) DO UPDATE SET care_team_notes = EXCLUDED.care_team_notes;`,
      [planId, userId, today, JSON.stringify(careNotes), whyItMatters]
    );

    const tasks = [
      { id: 'tsk-1', period: 'Morning', scheduled_time: '8:00 AM', name: 'Take morning medication', description: 'Lisinopril 10 mg · 1 tablet', icon: 'pill', tone: 'blue', status: 'Completed', task_order: 1 },
      { id: 'tsk-2', period: 'Morning', scheduled_time: '8:30 AM', name: 'Log breakfast', description: 'Add a quick note or photo', icon: 'food', tone: 'green', status: 'Completed', task_order: 2 },
      { id: 'tsk-3', period: 'Morning', scheduled_time: '9:00 AM', name: 'Light activity', description: '10–20 minutes of walking or stretching', icon: 'activity', tone: 'blue', status: 'Pending', task_order: 3 },
      { id: 'tsk-4', period: 'Afternoon', scheduled_time: '12:30 PM', name: 'Lunch & log meal', description: 'Record what you eat', icon: 'food', tone: 'green', status: 'Upcoming', task_order: 4 },
      { id: 'tsk-5', period: 'Afternoon', scheduled_time: '3:00 PM', name: 'Check vitals', description: 'Blood pressure, heart rate, oxygen (SpO₂)', icon: 'heart', tone: 'red', status: 'Upcoming', task_order: 5 },
      { id: 'tsk-6', period: 'Evening', scheduled_time: '9:00 PM', name: 'Sleep prep', description: 'Take medication and get ready for bed', icon: 'bed', tone: 'purple', status: 'Upcoming', task_order: 6 },
    ];

    for (const t of tasks) {
      await DatabasePool.query(
        `INSERT INTO health_schema.care_tasks (id, plan_id, user_id, period, scheduled_time, name, description, icon, tone, status, task_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, name = EXCLUDED.name;`,
        [t.id, planId, userId, t.period, t.scheduled_time, t.name, t.description, t.icon, t.tone, t.status, t.task_order]
      );
    }
  } catch (err: any) {
    console.warn('[DemoSeeder Care Plan Warning]:', err.message);
  }

  // 3. Seed Medications
  const medications = [
    { id: 'med-1', name: 'Lisinopril', dosage: '10 mg', frequency: 'Each morning', instructions: '1 tablet with water' },
    { id: 'med-2', name: 'Vitamin D', dosage: '1 tablet', frequency: 'With breakfast', instructions: 'Daily supplement' },
  ];
  for (const m of medications) {
    try {
      await DatabasePool.query(
        `INSERT INTO profile_schema.user_medications (id, user_id, name, dosage, frequency, instructions, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (id) DO UPDATE SET dosage = EXCLUDED.dosage;`,
        [m.id, userId, m.name, m.dosage, m.frequency, m.instructions]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Medications Warning]:', err.message);
    }
  }

  // 4. Seed Care Network
  const careNetwork = [
    { id: 'cn-1', member_name: 'Rahul Sharma', relationship: 'Family Member', role: 'Family Caregiver', is_male: true },
    { id: 'cn-2', member_name: 'Dr. Neha Verma', relationship: 'Primary Physician', role: 'Cardiologist', is_male: false },
  ];
  for (const c of careNetwork) {
    try {
      await DatabasePool.query(
        `INSERT INTO profile_schema.care_network (id, user_id, member_name, relationship, role, is_male, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;`,
        [c.id, userId, c.member_name, c.relationship, c.role, c.is_male]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Care Network Warning]:', err.message);
    }
  }

  // 5. Seed Health Records
  const records = [
    { id: 'rec-1', title: 'Blood count', record_type: 'lab', doctor_name: 'Apex Diagnostic Labs', record_date: '2025-04-21', notes: 'Routine CBC panel normal' },
    { id: 'rec-2', title: 'Lipid profile', record_type: 'lab', doctor_name: 'Apex Diagnostic Labs', record_date: '2025-03-10', notes: 'Cholesterol within normal limit' },
    { id: 'rec-3', title: 'Annual health review', record_type: 'medical', doctor_name: 'Dr. Neha Verma', record_date: '2025-04-15', notes: 'Blood pressure stable on Lisinopril' },
    { id: 'rec-4', title: 'Lisinopril Prescription', record_type: 'prescription', doctor_name: 'Dr. Neha Verma', record_date: '2025-04-15', notes: 'Lisinopril 10mg daily' },
  ];
  for (const r of records) {
    try {
      await DatabasePool.query(
        `INSERT INTO profile_schema.health_records (id, user_id, title, record_type, doctor_name, record_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
        [r.id, userId, r.title, r.record_type, r.doctor_name, r.record_date, r.notes]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Records Warning]:', err.message);
    }
  }

  // 6. Seed Connected Devices
  const devices = [
    { id: 'dev-1', name: 'Apple Watch', kind: 'watch', battery_level: 78, battery_status: '~ 1 day left', sync_label: '8 min ago', scopes: ['Heart Rate', 'Sleep', 'Activity', 'Notifications'], enabled: true, attention: false },
    { id: 'dev-2', name: 'Withings BP Monitor', kind: 'monitor', battery_level: 90, battery_status: '~ 3 months left', sync_label: '2 hrs ago', scopes: ['Blood Pressure', 'Heart Rate'], enabled: true, attention: false },
    { id: 'dev-3', name: 'Dexcom CGM', kind: 'cgm', battery_level: 65, battery_status: '~ 6 days left', sync_label: '15 min ago', scopes: ['Glucose', 'Notifications'], enabled: true, attention: false },
    { id: 'dev-4', name: 'Oura Ring', kind: 'ring', battery_level: 40, battery_status: 'Action required', sync_label: '1 day ago', scopes: ['Sleep', 'Activity', 'Heart Rate'], enabled: false, attention: true },
  ];
  for (const d of devices) {
    try {
      await DatabasePool.query(
        `INSERT INTO user_schema.user_devices (id, user_id, name, kind, battery_level, battery_status, sync_label, sharing_scopes, is_enabled, needs_attention)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET is_enabled = EXCLUDED.is_enabled, battery_level = EXCLUDED.battery_level;`,
        [d.id, userId, d.name, d.kind, d.battery_level, d.battery_status, d.sync_label, JSON.stringify(d.scopes), d.enabled, d.attention]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Devices Warning]:', err.message);
    }
  }

  // 7. Seed AI Health Insights
  const insights = [
    {
      id: 'ins-1',
      tag: 'Better Sleep',
      title: 'Sleep quality',
      highlight: 'up 12%',
      end_text: 'this week',
      text: 'You’re getting more deep sleep compared to last week. Great progress!',
      why: 'Better sleep helps with mood, focus and faster recovery.',
      icon: 'moon',
      tone: 'blue',
    },
    {
      id: 'ins-2',
      tag: 'More Activity',
      title: 'Daily activity',
      highlight: 'increased 8%',
      end_text: '',
      text: 'You took 8,320 steps today — that’s 8% more than last week.',
      why: 'Staying active supports heart health, energy and better sleep.',
      icon: 'activity',
      tone: 'green',
    },
    {
      id: 'ins-3',
      tag: 'Steady Progress',
      title: 'Your week is',
      highlight: 'trending well',
      end_text: '',
      text: 'Improved sleep and regular movement are creating steady momentum for your health.',
      why: 'Small, repeatable habits support long-term wellness.',
      icon: 'heart',
      tone: 'purple',
    },
  ];
  for (const ins of insights) {
    try {
      await DatabasePool.query(
        `INSERT INTO ai_schema.health_insights (id, user_id, tag, title, highlight, end_text, text, why, icon, tone, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;`,
        [ins.id, userId, ins.tag, ins.title, ins.highlight, ins.end_text, ins.text, ins.why, ins.icon, ins.tone]
      );
    } catch (err: any) {
      console.warn('[DemoSeeder Insights Warning]:', err.message);
    }
  }

  // 8. Seed AI Health Alerts
  try {
    const alertActions = [
      'Recheck your vitals today',
      'Rest and stay hydrated',
      'If this continues or you have symptoms, contact your care team.',
    ];
    await DatabasePool.query(
      `INSERT INTO ai_schema.health_alerts (id, user_id, title, subtitle, severity, metric_name, current_val, baseline_val, possible_reasons, action_items, is_resolved)
       VALUES ('alt-1', $1, 'Resting Heart Rate is higher than usual', 'Your resting heart rate is 18% above your personal baseline for the past 3 days.', 'warning', 'Heart Rate', '85 bpm', '72 bpm', 'This can be due to poor sleep, increased stress, illness (like a cold), or strenuous activity.', $2, FALSE)
       ON CONFLICT (id) DO UPDATE SET current_val = EXCLUDED.current_val;`,
      [userId, JSON.stringify(alertActions)]
    );
  } catch (err: any) {
    console.warn('[DemoSeeder Alerts Warning]:', err.message);
  }
}
