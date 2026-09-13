import { useEffect, useState } from 'react';
import { Button, Carousel, Chip, Icon, IconTile, Ring, Row, Sheet, Trend } from '../components/UI';
import { ScanPortrait } from '../components/Illustrations';
import { insights, metrics } from '../data/mock';
export function InsightsSheet({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  return (
    <Sheet title="Insights for You" onClose={onClose}>
      <div className="sheet-heading">
        <IconTile name="bulb" />
        <div>
          <h2>Insights for You</h2>
          <p>Small changes. A healthier you.</p>
        </div>
      </div>
      <Carousel index={index} onChange={setIndex} label="Health insights">
        {insights.map((s) => (
          <article className={`insight-card ${s.tone}`} key={s.tag}>
            <Chip tone={s.tone}>{s.tag}</Chip>
            <span className="insight-illustration">
              <Icon name={s.icon} size={64} />
            </span>
            <h3>
              {s.title}
              <br />
              <em>{s.highlight}</em>
              <br />
              {s.end}
            </h3>
            <p>{s.text}</p>
            <div className="insight-why">
              <IconTile
                name={s.tone === 'blue' ? 'heart' : 'zap'}
                tone={s.tone === 'blue' ? 'red' : 'green'}
              />
              <div>
                <b>Why this matters</b>
                <p>{s.why}</p>
              </div>
            </div>
          </article>
        ))}
      </Carousel>
      <Button onClick={onClose}>Got it</Button>
    </Sheet>
  );
}
export function AlertSheet({ onClose, onDetails }: { onClose: () => void; onDetails: () => void }) {
  const [index, setIndex] = useState(0);
  return (
    <Sheet title="Health alert" onClose={onClose}>
      <div className="sheet-heading alert-heading">
        <IconTile name="up" tone="orange" />
        <div>
          <h2>Resting Heart Rate is higher than usual</h2>
          <Chip tone="red">
            <Icon name="alert" size={13} />
            Needs attention
          </Chip>
          <p>Your resting heart rate is 18% above your personal baseline for the past 3 days.</p>
        </div>
      </div>
      <div className="alert-carousel">
        <Carousel index={index} onChange={setIndex} label="Health alert information">
          {[
            <article className="alert-info red" key="changed">
              <IconTile name="heart" tone="red" />
              <h3>What changed?</h3>
              <p>Your resting heart rate is 18% above your baseline for the past 3 days.</p>
              <b className="alert-reading">
                <Icon name="chart" />
                72 → 85 bpm
              </b>
              <small>Your average RHR</small>
            </article>,
            <article className="alert-info blue" key="reasons">
              <IconTile name="moon" />
              <h3>Possible reasons</h3>
              <p>
                This can be due to poor sleep, increased stress, illness (like a cold), or strenuous
                activity.
              </p>
            </article>,
            <article className="alert-info green" key="next">
              <IconTile name="done" tone="green" />
              <h3>What to do now</h3>
              {[
                'Recheck your vitals today',
                'Rest and stay hydrated',
                'If this continues or you have symptoms, contact your care team.',
              ].map((t) => (
                <p className="check-line" key={t}>
                  <Icon name="done" size={15} />
                  {t}
                </p>
              ))}
            </article>,
          ]}
        </Carousel>
      </div>
      <Button onClick={onDetails}>View details</Button>
    </Sheet>
  );
}
export function MetricSheet({ name, onClose }: { name: string; onClose: () => void }) {
  const metric = metrics.find((m) => m.name === name) || metrics[0];
  return (
    <Sheet title={`${name} details`} onClose={onClose}>
      <div className="sheet-heading">
        <IconTile name={metric.icon} tone={metric.tone} />
        <div>
          <h2>{name}</h2>
          <p>Your latest reading and personal baseline</p>
        </div>
      </div>
      <div className="metric-detail card">
        <strong>
          {metric.value} <small>{metric.unit}</small>
        </strong>
        <Trend tone={metric.tone} />
        <Chip tone={name === 'Heart Rate' ? 'orange' : 'green'}>
          {metric.change} your usual range
        </Chip>
      </div>
      <h3>About this reading</h3>
      <p className="sheet-body-copy">
        {name === 'Heart Rate'
          ? 'Your resting heart rate has been above your personal baseline for 3 days. Keep track of changes and share persistent changes with your care team.'
          : `Your ${name.toLowerCase()} readings help you follow patterns over time. Compare your daily readings with your usual range.`}
      </p>
      <p className="demo-caption">Illustrative data only. This is not medical advice.</p>
      <Button onClick={onClose}>Done</Button>
    </Sheet>
  );
}
export function ScanSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  useEffect(() => {
    if (step === 1) {
      const timeout = setTimeout(() => setStep(2), 1800);
      return () => clearTimeout(timeout);
    }
  }, [step]);
  return (
    <Sheet title="Face scan" onClose={onClose}>
      <div className="sheet-heading">
        <IconTile name="camera" />
        <div>
          <h2>
            {step === 0
              ? 'Ready for your scan?'
              : step === 1
                ? 'Analyzing your scan…'
                : 'Your scan is complete'}
          </h2>
          <p>
            {step === 2 ? 'Your demo readings are ready.' : 'A quick check-in with your health.'}
          </p>
        </div>
      </div>
      {step < 2 ? (
        <div className={`scan-preview ${step === 1 ? 'scanning' : ''}`}>
          <ScanPortrait />
        </div>
      ) : (
        <div className="scan-result">
          <Ring />
          <h3>All good</h3>
          <p>Heart Rate 72 bpm · SpO₂ 98%</p>
        </div>
      )}
      {step === 0 && (
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          I agree to start a simulated scan. No camera or personal health data will be used.
        </label>
      )}
      <p className="demo-caption">Simulation only. This is not medical advice.</p>
      <Button
        disabled={(step === 0 && !consent) || step === 1}
        onClick={() => (step === 2 ? onClose() : setStep(1))}
      >
        {step === 0 ? 'Start simulated scan' : step === 1 ? 'Analyzing…' : 'Done'}
      </Button>
    </Sheet>
  );
}
const content: Record<string, { description: string; rows: string[] }> = {
  'Care team notes': {
    description: 'Your care team is here to support your progress.',
    rows: [
      'Sarah Kim, NP · Apr 28: Your blood pressure has been steady this week. Keep up the good work!',
      'Dr. Neha Verma · Apr 25: Keep recording your daily readings.',
    ],
  },
  'Why this matters': {
    description: 'Small daily actions support your long-term health.',
    rows: [
      'Take medications as prescribed by your care team.',
      'Follow your personalized activity and meal plan.',
      'Track your readings and discuss changes at your next appointment.',
    ],
  },
  'Full care plan': {
    description: 'Hypertension care plan · Weekly overview',
    rows: [
      'Daily: Morning medication, meals, light activity and vital readings.',
      'Weekly: Review your health trends with your care team.',
      'Next review: May 5, 2025 · Dr. Neha Verma.',
    ],
  },
  'Personal Information': {
    description: 'Your health profile',
    rows: ['Male · Jan 12, 1992', 'Blood group O+', 'Gurgaon, India'],
  },
  'Health Conditions': {
    description: 'Conditions in your demo health profile.',
    rows: ['Hypertension · Managed with your care team'],
  },
  Medications: {
    description: 'Your current medication list',
    rows: ['Lisinopril · 10 mg · Each morning', 'Vitamin D · 1 tablet · With breakfast'],
  },
  Allergies: { description: 'Known allergies', rows: ['No known allergies recorded'] },
  'Health Goals': {
    description: 'Your wellness goals',
    rows: [
      'Keep a consistent sleep schedule',
      'Walk for 30 minutes daily',
      'Track blood pressure regularly',
    ],
  },
  Lifestyle: {
    description: 'Your everyday habits',
    rows: ['Sleep · Usually 7–8 hours', 'Activity · Light to moderate', 'Diet · Balanced meals'],
  },
  'Lab Reports': {
    description: '2 connected demo reports',
    rows: ['Blood count · Apr 21, 2025', 'Lipid profile · Mar 10, 2025'],
  },
  'Medical Records': {
    description: '1 connected demo record',
    rows: ['Annual health review · Apr 15, 2025'],
  },
  Prescriptions: {
    description: '1 connected demo prescription',
    rows: ['Dr. Neha Verma · Apr 15, 2025 · Lisinopril'],
  },
  'Care Network': {
    description: 'People supporting your health',
    rows: ['Rahul Sharma · Family member · Active', 'Dr. Neha Verma · Primary physician · Active'],
  },
  'Recent data sources': {
    description: 'Your recent health data',
    rows: [
      'Apple Watch · Last synced 2 hours ago',
      'BP Monitor · Last synced yesterday',
      'Uploaded PDF · Added 3 days ago',
    ],
  },
  Notifications: {
    description: 'You have 3 updates',
    rows: [
      'Your weekly insights are ready. Sleep quality is up 12%.',
      'Care plan reminder: Light activity is pending.',
      'Oura Ring needs background sync permission.',
    ],
  },
  'Need Help': {
    description: 'Medivo help center',
    rows: [
      'How do I connect a device? Open Profile → Connected Devices → Add a new device.',
      'How do I complete a task? Open Care and tap the task.',
      'Is this real health data? This standalone prototype uses mock data only.',
    ],
  },
  'Device connection': {
    description: 'Connect your device to keep your health overview up to date.',
    rows: [
      'Choose the data you want to sync.',
      'You can pause syncing or change permissions at any time.',
      'This prototype simulates the connection locally.',
    ],
  },
  'Automatic sync': {
    description: 'Your device keeps your data up to date.',
    rows: [
      'Sync runs when your device is nearby.',
      'Enable background refresh for regular updates.',
      'You can pause syncing in Manage Devices.',
    ],
  },
};
export function GeneralSheet({
  title,
  onClose,
  onSave,
  onSettings,
  entries,
}: {
  entries: string[];
  title: string;
  onClose: () => void;
  onSave: (value: string) => void;
  onSettings: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [value, setValue] = useState(title === 'Edit Profile' ? 'Prateek Gautam' : '');
  const [enabled, setEnabled] = useState(true);
  const isForm = [
    'Edit Profile',
    'Add Member',
    'Add Medication',
    'Manual Entry',
    'Vitals Check',
    'Upload Photo',
  ].includes(title);
  const info = content[title] || {
    description:
      title.includes('Watch') || title.includes('CGM') || title.includes('Monitor')
        ? 'Connected device details'
        : 'Your Medivo settings',
    rows:
      title.includes('Watch') || title.includes('CGM') || title.includes('Monitor')
        ? ['Connected · Last sync just now', 'Battery 78% · Data sharing enabled']
        : ['Manage this information in your Medivo profile.'],
  };
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="sheet-heading">
        <IconTile
          name={
            title.includes('Privacy') ? 'shield' : title.includes('Settings') ? 'settings' : 'file'
          }
        />
        <div>
          <h2>{title}</h2>
          <p>
            {saved
              ? 'Saved for this demo session.'
              : isForm
                ? 'Update your demo information.'
                : info.description}
          </p>
        </div>
      </div>
      {saved ? (
        <div className="saved-state">
          <IconTile name="done" tone="green" />
          <h3>Saved successfully</h3>
        </div>
      ) : isForm ? (
        <form
          id="detail-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(value);
            setSaved(true);
          }}
          className="detail-form"
        >
          {title === 'Upload Photo' ? (
            <label>
              Choose a photo or PDF
              <input
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={(e) => setValue(e.target.files?.[0]?.name || '')}
              />
              <small>File name only is used in the demo; nothing is uploaded.</small>
            </label>
          ) : (
            <>
              <label>
                {title === 'Edit Profile'
                  ? 'Full name'
                  : title === 'Add Member'
                    ? 'Member name'
                    : title === 'Add Medication'
                      ? 'Medication name'
                      : 'Reading'}
                <input
                  required
                  maxLength={80}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={
                    title === 'Vitals Check'
                      ? 'e.g. 118/76 mmHg'
                      : title === 'Manual Entry'
                        ? 'e.g. Heart Rate: 72 bpm'
                        : 'Enter name'
                  }
                />
              </label>
              {title === 'Manual Entry' || title === 'Vitals Check' ? (
                <label>
                  Metric
                  <select>
                    <option>Blood Pressure</option>
                    <option>Heart Rate</option>
                    <option>SpO₂</option>
                    <option>Temperature</option>
                  </select>
                </label>
              ) : (
                <label>
                  {title === 'Add Member'
                    ? 'Relationship'
                    : title === 'Add Medication'
                      ? 'Dosage'
                      : 'Location'}
                  <input
                    placeholder={
                      title === 'Add Member'
                        ? 'Family member'
                        : title === 'Add Medication'
                          ? '10 mg daily'
                          : 'Gurgaon, India'
                    }
                  />
                </label>
              )}
            </>
          )}
        </form>
      ) : title === 'Privacy & Permissions' ||
        title === 'Account Settings' ||
        title === 'Background sync settings' ? (
        <>
          <p className="sheet-body-copy">
            {title === 'Privacy & Permissions'
              ? 'You control what you share. This prototype uses only demo data and does not connect to external services.'
              : 'Manage local demo preferences.'}
          </p>
          {[
            title === 'Background sync settings' ? 'Background app refresh' : 'Notifications',
            'Health data sharing',
          ].map((t, i) => (
            <div className="preference-row" key={t}>
              <b>{t}</b>
              <input
                type="checkbox"
                aria-label={t}
                checked={i === 0 ? enabled : undefined}
                defaultChecked={i === 1 ? true : undefined}
                onChange={i === 0 ? (e) => setEnabled(e.target.checked) : undefined}
              />
            </div>
          ))}
        </>
      ) : (
        <div className="general-content">
          {[...info.rows, ...entries].map((r) => (
            <div className="card general-row" key={r}>
              <Icon name="check" size={17} />
              <p>{r}</p>
            </div>
          ))}
        </div>
      )}
      {isForm && !saved ? (
        <Button
          type="submit"
          onClick={() => {
            const form = document.getElementById('detail-form') as HTMLFormElement | null;
            form?.requestSubmit();
          }}
        >
          Save
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (title === 'Background sync settings' && enabled) onSettings();
            onClose();
          }}
        >
          {title === 'Background sync settings' ? 'Save settings' : 'Done'}
        </Button>
      )}
    </Sheet>
  );
}
