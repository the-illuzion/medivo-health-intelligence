import { useCallback, useEffect, useState } from 'react';
import { Button, Header, Icon, Navigation, Sheet } from './components/UI';
import { Home } from './features/Home';
import { Metrics } from './features/Metrics';
import { Care } from './features/Care';
import { Scan } from './features/Scan';
import { Profile } from './features/Profile';
import { Connect, Devices } from './features/Devices';
import { Status } from './features/Status';
import { AlertSheet, GeneralSheet, InsightsSheet, MetricSheet, ScanSheet } from './features/Sheets';
import type { Page } from './data/mock';
const pages: Page[] = [
  'home',
  'metrics',
  'scan',
  'care',
  'profile',
  'devices',
  'connect',
  'status',
];
function currentPage(): Page {
  const hash = window.location.hash.slice(1) as Page;
  return pages.includes(hash) ? hash : 'home';
}
export default function App() {
  const [page, setPage] = useState<Page>(currentPage);
  const [sheet, setSheet] = useState('');
  const [name, setName] = useState('Prateek Gautam');
  const [device, setDevice] = useState('Apple Watch');
  const [connectedDevice, setConnectedDevice] = useState('');
  const [ringConnected, setRingConnected] = useState(false);
  const [recentUpload, setRecentUpload] = useState('');
  const [entries, setEntries] = useState<Record<string, string[]>>({});
  const navigate = useCallback((p: Page) => {
    window.location.hash = p;
    setPage(p);
    setSheet('');
    window.scrollTo(0, 0);
  }, []);
  const close = useCallback(() => setSheet(''), []);
  useEffect(() => {
    const change = () => {
      setPage(currentPage());
      setSheet('');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  const openSheet = (s: string) => {
    if (s.startsWith('choose:')) {
      setDevice(s.slice(7));
      navigate('connect');
    } else setSheet(s);
  };
  return (
    <div className="app-shell">
      <div inert={!!sheet}>
        {page !== 'status' && (
          <Header navigate={navigate} notify={() => setSheet('Notifications')} />
        )}
        <main className={page === 'status' ? '' : 'main-content'}>
          {page === 'home' && <Home navigate={navigate} openSheet={openSheet} />}
          <div hidden={page !== 'metrics'}>{<Metrics openSheet={openSheet} />}</div>
          <div hidden={page !== 'care'}>
            <Care openSheet={openSheet} />
          </div>
          {page === 'scan' && (
            <Scan navigate={navigate} openSheet={openSheet} recentUpload={recentUpload} />
          )}{' '}
          {page === 'profile' && <Profile navigate={navigate} openSheet={openSheet} name={name} />}
          <div hidden={page !== 'devices'}>
            <Devices
              navigate={(p) => {
                if (p === 'connect') setDevice('Apple Watch');
                navigate(p);
              }}
              openSheet={openSheet}
              ringConnected={ringConnected}
              setRingConnected={setRingConnected}
              connectedDevice={connectedDevice}
            />
          </div>
          {page === 'connect' && (
            <Connect
              navigate={navigate}
              openSheet={openSheet}
              device={device}
              connected={connectedDevice === device}
              onConnect={() => {
                if (connectedDevice === device) navigate('devices');
                else {
                  setConnectedDevice(device);
                  setSheet('connection-success');
                }
              }}
            />
          )}{' '}
          {page === 'status' && <Status onDone={() => navigate('home')} />}
        </main>
        {page !== 'status' && page !== 'connect' && <Navigation page={page} navigate={navigate} />}
      </div>{' '}
      {sheet === 'insights' ? (
        <InsightsSheet onClose={close} />
      ) : sheet === 'alert' ? (
        <AlertSheet onClose={close} onDetails={() => setSheet('metric:Heart Rate')} />
      ) : sheet.startsWith('metric:') ? (
        <MetricSheet name={sheet.slice(7)} onClose={close} />
      ) : sheet === 'scan' ? (
        <ScanSheet onClose={close} />
      ) : sheet === 'connection-success' ? (
        <Sheet title="Device connected" onClose={close}>
          <div className="connection-success">
            <Icon name="done" size={55} />
            <h2>{device} connected</h2>
            <p>Your demo device is ready to sync heart rate, sleep and activity.</p>
          </div>
          <Button onClick={() => navigate('devices')}>View devices</Button>
        </Sheet>
      ) : sheet ? (
        <GeneralSheet
          key={sheet}
          title={sheet}
          entries={entries[sheet] || []}
          onClose={close}
          onSettings={() => setRingConnected(true)}
          onSave={(value) => {
            if (sheet === 'Edit Profile') setName(value);
            if (['Upload Photo', 'Manual Entry', 'Vitals Check'].includes(sheet))
              setRecentUpload(value);
            const destination =
              sheet === 'Add Medication'
                ? 'Medications'
                : sheet === 'Add Member'
                  ? 'Care Network'
                  : sheet === 'Edit Profile'
                    ? 'Personal Information'
                    : sheet;
            setEntries((current) => ({
              ...current,
              [destination]: [...(current[destination] || []), value],
            }));
          }}
        />
      ) : null}
    </div>
  );
}
