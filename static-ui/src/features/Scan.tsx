import { Icon, PageHeading, Row, Section } from '../components/UI';
import { DeviceArt, ScanPortrait } from '../components/Illustrations';
import type { Page } from '../data/mock';
export function Scan({
  navigate,
  openSheet,
  recentUpload,
}: {
  navigate: (p: Page) => void;
  openSheet: (s: string) => void;
  recentUpload: string;
}) {
  return (
    <>
      <PageHeading
        title="Start a Scan"
        subtitle="Capture a new scan or add supporting health data."
      />
      <div className="scan-panel">
        <ScanPortrait />
        <span className="scan-label">
          <Icon name="camera" size={16} />
          Face Scan
        </span>
        <button className="button scan-button" onClick={() => openSheet('scan')}>
          <Icon name="camera" />
          Begin Face Scan
        </button>
        <p>Position your face in the frame</p>
      </div>
      <Section title="Other ways to add health data">
        <div className="two-columns scan-options">
          <Row
            icon="heartpulse"
            title="Vitals Check"
            description="Measure key vitals"
            tone="green"
            onClick={() => openSheet('Vitals Check')}
          />
          <Row
            icon="image"
            title="Upload Photo"
            description="Add lab results or notes"
            onClick={() => openSheet('Upload Photo')}
          />
          <Row
            icon="file"
            title="Manual Entry"
            description="Log data manually"
            tone="orange"
            onClick={() => openSheet('Manual Entry')}
          />
          <Row
            icon="watch"
            title="Connect Device"
            description="Sync from your device"
            tone="purple"
            onClick={() => navigate('devices')}
          />
        </div>
      </Section>
      <Section
        title="Recent data sources"
        action="See all"
        onAction={() => openSheet('Recent data sources')}
      >
        <div className="three-columns recent-sources">
          <button className="card" onClick={() => navigate('devices')}>
            <DeviceArt />
            <div>
              <b>Apple Watch</b>
              <small>Last synced 2h ago</small>
            </div>
          </button>
          <button className="card" onClick={() => navigate('devices')}>
            <DeviceArt kind="monitor" />
            <div>
              <b>BP Monitor</b>
              <small>Last synced 1d ago</small>
            </div>
          </button>
          <button className="card" onClick={() => openSheet('Recent data sources')}>
            <Icon name="file" />
            <div>
              <b>{recentUpload || 'Uploaded PDF'}</b>
              <small>{recentUpload ? 'Added just now' : 'Added 3d ago'}</small>
            </div>
          </button>
        </div>
      </Section>
      <Section title="How it works">
        <div className="card scan-steps">
          {[
            { title: 'Capture', text: 'Take a quick scan', icon: 'camera' },
            { title: 'Analyze', text: 'AI reviews your data', icon: 'chart' },
            { title: 'Review', text: 'See insights in seconds', icon: 'file' },
          ].map((s, i) => (
            <div key={s.title}>
              <span className="step-number">{i + 1}</span>
              <Icon name={s.icon} size={23} />
              <b>{s.title}</b>
              <small>{s.text}</small>
            </div>
          ))}
        </div>
      </Section>
      <Row
        icon="shield"
        tone="green"
        title="Your health data stays protected"
        description="Encrypted, private, and never shared without your consent."
        onClick={() => openSheet('Privacy & Permissions')}
      />
      <p className="demo-caption">Simulated scan · No camera access or medical analysis</p>
    </>
  );
}
