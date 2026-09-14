import { Button, Chip, Icon, IconTile, Ring, Section } from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { initialDevices, metrics, type Page } from '../data/mock';
export function Home({
  navigate,
  openSheet,
}: {
  navigate: (p: Page) => void;
  openSheet: (s: string) => void;
}) {
  const order = [0, 2, 5, 1, 3, 4];
  return (
    <div className="home-page">
      <div className="greeting">
        <div>
          <h1>Good morning, Aanya</h1>
          <p>Here’s your health overview for today.</p>
        </div>
        <time>Tue, 12 Nov 2024</time>
      </div>
      <button className="health-status" onClick={() => navigate('status')}>
        <Ring />
        <div>
          <span>Your Health Status</span>
          <h2>
            All good <Icon name="done" size={23} />
          </h2>
          <p>
            Your vital signs are within your normal range.
            <br />
            Keep up the good work!
          </p>
        </div>
        <span className="round-arrow">
          <Icon name="chevron" />
        </span>
      </button>
      <button className="insight-banner" onClick={() => openSheet('insights')}>
        <IconTile name="bulb" />
        <div>
          <b>Insight for You</b>
          <p>
            Your sleep duration has improved by 12% this week, which is positively impacting your
            recovery.
          </p>
        </div>
        <Icon name="chevron" size={17} />
      </button>
      <Section title="Key Health Metrics" action="View All" onAction={() => navigate('metrics')}>
        <div className="metric-grid">
          {order.map((i) => {
            const m = metrics[i];
            return (
              <button
                className="card mini-metric"
                key={m.name}
                onClick={() => openSheet(`metric:${m.name}`)}
              >
                <IconTile
                  name={i === 2 ? 'lungs' : i === 1 ? 'drop' : m.icon}
                  tone={
                    i === 5
                      ? 'purple'
                      : i === 3
                        ? 'orange'
                        : i === 1
                          ? 'green'
                          : i === 2
                            ? 'blue'
                            : m.tone
                  }
                />
                <div>
                  <small>{m.name === 'Temperature' ? 'Body Temp' : m.name}</small>
                  <div className="metric-value">
                    <b>{m.home}</b> <span>{m.unit}</span>
                  </div>
                  <span className={`metric-change ${i === 2 || i === 5 ? 'muted' : 'positive'}`}>
                    {i === 0
                      ? '↓ 2% from baseline'
                      : i === 1
                        ? '↓ 5% from baseline'
                        : i === 3
                          ? '↑ 12% from last week'
                          : i === 4
                            ? '↑ 8% from last week'
                            : '→ No change'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>
      <div className="alert-banner">
        <button className="alert-copy" onClick={() => openSheet('alert')}>
          <IconTile name="up" tone="orange" />
          <div>
            <h3>Resting Heart Rate is higher than usual</h3>
            <p>Your resting heart rate is 18% above your personal baseline for the past 3 days.</p>
          </div>
          <Icon name="chevron" size={18} />
        </button>
        <Button secondary onClick={() => openSheet('alert')}>
          View details
        </Button>
      </div>
      <Section
        title="Today’s Care Plan"
        action="See all"
        onAction={() => navigate('care')}
        className="white-section"
      >
        <div className="three-columns">
          {[
            { name: 'Take Medication', icon: 'pill', sub: '8:00 AM', state: 'Completed' },
            { name: 'Light Activity', icon: 'activity', sub: '30 min walk', state: 'Pending' },
            { name: 'Recheck Vitals', icon: 'drop', sub: 'Around 6:00 PM', state: 'Upcoming' },
          ].map((t) => (
            <button className="card care-preview" key={t.name} onClick={() => navigate('care')}>
              <IconTile name={t.icon} />
              <b>{t.name}</b>
              <small>{t.sub}</small>
              <Chip tone={t.state === 'Completed' ? 'green' : 'blue'}>
                <Icon name={t.state === 'Completed' ? 'done' : 'clock'} size={12} />
                {t.state}
              </Chip>
            </button>
          ))}
        </div>
      </Section>
      <Section
        title="Connected Devices"
        action="Manage"
        onAction={() => navigate('devices')}
        className="white-section"
      >
        <div className="three-columns">
          {initialDevices.map((d) => (
            <button
              className="card device-preview"
              onClick={() => navigate('devices')}
              key={d.name}
            >
              <DeviceArt kind={d.kind} />
              <div>
                <b>{d.name}</b>
                <small>
                  <i className="status-dot" />
                  Synced {d.sync}
                </small>
              </div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
