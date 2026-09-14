import { useEffect, useState } from 'react';
import { Button, Chip, Icon, IconTile, PageHeading, Row, Section } from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { initialDevices, type Page } from '../data/mock';
export function Devices({
  navigate,
  openSheet,
  ringConnected,
  setRingConnected,
  connectedDevice,
}: {
  navigate: (p: Page) => void;
  openSheet: (s: string) => void;
  ringConnected: boolean;
  setRingConnected: (b: boolean) => void;
  connectedDevice: string;
}) {
  const [devices, setDevices] = useState(initialDevices);
  useEffect(() => {
    if (connectedDevice && connectedDevice !== 'Apple Watch')
      setDevices((current) =>
        current.some((d) => d.name === connectedDevice)
          ? current
          : [
              ...current,
              {
                name: connectedDevice,
                kind: 'watch',
                sync: 'Just now',
                sharing: ['Heart Rate', 'Sleep', 'Activity'],
                enabled: true,
              },
            ],
      );
  }, [connectedDevice]);
  return (
    <>
      <PageHeading
        title="Manage Devices"
        subtitle="Connect and manage your health devices in one place. Keep your data synced for better insights."
        back={() => navigate('profile')}
      />
      <div className="device-summary">
        <IconTile name="phone" />
        <div>
          <h2>
            {devices.filter((d) => d.enabled).length + (ringConnected ? 1 : 0)} devices connected
          </h2>
          <p>
            <Icon name="sync" size={15} />
            Last sync: 6 min ago
          </p>
          <p>
            <Icon name="done" size={15} />
            All critical sources active
          </p>
          <small>Your devices are working well and keeping your health data up to date.</small>
        </div>
      </div>
      <div className="device-section-label green">
        <h2>Connected ({devices.filter((d) => d.enabled).length + (ringConnected ? 1 : 0)})</h2>
        <p>
          <i className="status-dot" />
          Devices are syncing and working properly.
        </p>
      </div>
      {devices.map((d, i) => (
        <div className="card device-card" key={d.name}>
          <div className="device-top">
            <DeviceArt kind={d.kind} />
            <div className="device-name">
              <h3>{d.name}</h3>
              <span className={d.enabled ? 'positive' : 'muted'}>
                <i className={`status-dot ${d.enabled ? '' : 'off'}`} />
                {d.enabled ? 'Connected' : 'Sync paused'}
              </span>
              <small>Last sync: {d.sync}</small>
            </div>
            <span className="battery-copy">
              <span>
                <Icon name="battery" size={18} />
                78%
              </span>
              <small>~ 1 day left</small>
            </span>
            <button
              className={`toggle ${d.enabled ? 'on' : ''}`}
              role="switch"
              aria-checked={d.enabled}
              aria-label={`${d.name} sync`}
              onClick={() =>
                setDevices(
                  devices.map((item, j) => (j === i ? { ...item, enabled: !item.enabled } : item)),
                )
              }
            >
              <span />
            </button>
            <button
              className="icon-button"
              aria-label={`${d.name} details`}
              onClick={() => openSheet(d.name)}
            >
              <Icon name="chevron" size={18} />
            </button>
          </div>
          <small>Data shared with Medivo</small>
          <div className="sharing-chips">
            {d.sharing.map((s) => (
              <Chip
                key={s}
                tone={
                  s === 'Sleep' || s === 'Glucose'
                    ? 'purple'
                    : s === 'Blood Pressure'
                      ? 'green'
                      : s === 'Heart Rate'
                        ? 'red'
                        : 'blue'
                }
              >
                <Icon
                  name={
                    s === 'Sleep'
                      ? 'moon'
                      : s === 'Activity'
                        ? 'activity'
                        : s === 'Notifications'
                          ? 'bell'
                          : s === 'Heart Rate'
                            ? 'heart'
                            : 'drop'
                  }
                  size={14}
                />
                {s}
              </Chip>
            ))}
          </div>
        </div>
      ))}
      <div className={`device-section-label ${ringConnected ? 'green' : 'red'}`}>
        <h2>{ringConnected ? 'Reconnected (1)' : 'Needs Attention (1)'}</h2>
        <p>
          <i className={`status-dot ${ringConnected ? '' : 'error'}`} />
          {ringConnected ? 'Your ring is syncing again.' : 'Action required to resume syncing.'}
        </p>
      </div>
      <div className="card device-card">
        <div className="device-top">
          <DeviceArt kind="ring" />
          <div className="device-name">
            <h3>Oura Ring</h3>
            <span className={ringConnected ? 'positive' : 'warning'}>
              ● {ringConnected ? 'Connected' : 'Action required'}
            </span>
            <small>Last sync: {ringConnected ? 'Just now' : '1 day ago'}</small>
          </div>
          <button className="button small-button" onClick={() => setRingConnected(!ringConnected)}>
            {ringConnected ? 'Disconnect' : 'Reconnect'}
          </button>
        </div>
        {!ringConnected && (
          <div className="permission-banner">
            <Icon name="alert" />
            <div>
              <b>Background sync permission required</b>
              <small>
                Enable background app refresh to keep your data in sync and get the latest insights.
              </small>
            </div>
            <button className="text-button" onClick={() => openSheet('Background sync settings')}>
              Open Settings
            </button>
          </div>
        )}
        <small>Data shared with Medivo</small>
        <div className="sharing-chips">
          <Chip tone="purple">
            <Icon name="moon" size={14} />
            Sleep
          </Chip>
          <Chip tone="blue">
            <Icon name="activity" size={14} />
            Activity
          </Chip>
          <Chip tone="blue">
            <Icon name="heart" size={14} />
            Heart Rate
          </Chip>
        </div>
      </div>
      <Section title="Add a new device" className="add-device-section">
        <p>Connect your favorite devices to get a complete picture of your health.</p>
        <div className="three-columns">
          {['Apple Health', 'Fitbit', 'Garmin'].map((s, i) => (
            <button className="card add-device" key={s} onClick={() => openSheet(`choose:${s}`)}>
              <IconTile
                name={i === 0 ? 'heart' : i === 1 ? 'activity' : 'watch'}
                tone={i === 0 ? 'red' : 'blue'}
              />
              <b>{s}</b>
              <small>
                {i === 0
                  ? 'Sync health data from your iPhone'
                  : i === 1
                    ? 'Track activity, sleep and more'
                    : 'Connect your Garmin device'}
              </small>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </div>
        <Button secondary onClick={() => navigate('connect')}>
          <Icon name="plus" />
          Connect Apple Watch
        </Button>
      </Section>
    </>
  );
}
export function Connect({
  navigate,
  openSheet,
  device,
  onConnect,
  connected,
}: {
  navigate: (p: Page) => void;
  openSheet: (s: string) => void;
  device: string;
  onConnect: () => void;
  connected: boolean;
}) {
  return (
    <>
      <button className="text-button back-link" onClick={() => navigate('devices')}>
        <Icon name="back" />
        Back
      </button>
      <div className="connect-hero">
        <DeviceArt />
        <div>
          <b className="watch-wordmark">{device === 'Apple Watch' ? '● WATCH' : device}</b>
          <h1>Connect {device}</h1>
          <p>
            Sync your health data from {device} to get a more complete picture of your health, all
            in one place.
          </p>
          <div className="connect-badges">
            <Chip>
              <Icon name="shield" size={14} />
              Secure & Private
            </Chip>
            <Chip tone="blue">
              <Icon name="link" size={14} />
              {device === 'Apple Watch' ? 'Apple Health integration' : 'Health integration'}
            </Chip>
          </div>
        </div>
      </div>
      <Section title="What will sync?" className="blue-panel">
        <p>Get insights from the data you already track.</p>
        <div className="three-columns">
          {[
            {
              title: 'Heart Rate',
              icon: 'heart',
              text: 'Resting, active and workout heart rate',
              tone: 'red' as const,
            },
            {
              title: 'Sleep',
              icon: 'moon',
              text: 'Sleep duration and sleep stages',
              tone: 'purple' as const,
            },
            {
              title: 'Activity',
              icon: 'activity',
              text: 'Steps, active minutes and workout data',
              tone: 'blue' as const,
            },
          ].map((s) => (
            <div className="card sync-item" key={s.title}>
              <IconTile name={s.icon} tone={s.tone} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="How it works" className="blue-panel">
        <p>Get connected in just a few simple steps.</p>
        <div className="card connection-steps">
          {[
            {
              title: `Open the ${device === 'Apple Watch' ? 'Apple Health' : device} app`,
              text: 'You’ll be redirected to grant access.',
            },
            {
              title: 'Allow Medivo to access your data',
              text: 'Choose the health data you’d like to share.',
            },
            {
              title: 'Start syncing',
              text: 'Your data will sync automatically in the background.',
            },
          ].map((s, i) => (
            <div key={s.title}>
              <span className="step-number">{i + 1}</span>
              <div>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Row
        icon="lock"
        tone="green"
        title="Your data stays private"
        description="We only access the data you allow, and it’s always encrypted and secure. You can change permissions anytime in Settings."
        onClick={() => openSheet('Privacy & Permissions')}
      />
      <Row
        icon="sync"
        title="Keeps syncing automatically"
        description="Once connected, your device will sync regularly in the background whenever it is nearby."
        onClick={() => openSheet('Automatic sync')}
      />
      <Button onClick={onConnect}>
        {connected ? (
          <>
            <Icon name="done" />
            Connected · View devices
          </>
        ) : (
          'Connect now'
        )}
      </Button>
      <button className="text-button learn-more" onClick={() => openSheet('Device connection')}>
        Learn more
      </button>
      <p className="demo-caption">Demo connection only · No external account is accessed</p>
    </>
  );
}
