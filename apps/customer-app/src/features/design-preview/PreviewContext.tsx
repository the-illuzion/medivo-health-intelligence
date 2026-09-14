import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { initialTasks, initialDevices } from './data/mock';
export type SheetKind = 'insights' | 'alert' | 'scan' | 'detail' | 'connection';
export interface PreviewSheet {
  kind: SheetKind;
  title?: string;
}
function usePreviewState() {
  const [tasks, setTasks] = useState(() => initialTasks.map((t) => ({ ...t })));
  const [devices, setDevices] = useState(() => initialDevices.map((d) => ({ ...d })));
  const [ringConnected, setRingConnected] = useState(false);
  const [profileName, setProfileName] = useState('Alex Morgan');
  const [entries, setEntries] = useState<Record<string, string[]>>({});
  const [period, setPeriod] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [careDate, setCareDate] = useState('2025-04-28');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [recentSource, setRecentSource] = useState('Uploaded PDF');
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    Notifications: true,
    'Health data sharing': true,
    'Background app refresh': false,
  });
  const [sheet, setSheet] = useState<PreviewSheet | null>(null);
  const openDetail = (title: string) => setSheet({ kind: 'detail', title });
  const toggleTask = (id: number) =>
    setTasks((current) =>
      current.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t,
      ),
    );
  const connectDevice = (name: string) =>
    setDevices((current) =>
      current.some((d) => d.name === name)
        ? current.map((d) => (d.name === name ? { ...d, enabled: true, sync: 'Just now' } : d))
        : [
            ...current,
            {
              name,
              kind: 'watch',
              sync: 'Just now',
              sharing: ['Heart Rate', 'Sleep', 'Activity'],
              enabled: true,
            },
          ],
    );
  const saveEntry = (title: string, value: string) => {
    if (title === 'Edit Profile') setProfileName(value);
    if (['Upload Photo', 'Manual Entry', 'Vitals Check'].includes(title)) setRecentSource(value);
    const destination =
      title === 'Add Medication'
        ? 'Medications'
        : title === 'Add Member'
          ? 'Care Network'
          : title === 'Edit Profile'
            ? 'Personal Information'
            : title;
    setEntries((current) => ({
      ...current,
      [destination]: [...(current[destination] || []), value],
    }));
  };
  return {
    tasks,
    setTasks,
    toggleTask,
    devices,
    setDevices,
    ringConnected,
    setRingConnected,
    profileName,
    entries,
    period,
    setPeriod,
    careDate,
    setCareDate,
    collapsed,
    setCollapsed,
    recentSource,
    preferences,
    setPreferences,
    sheet,
    setSheet,
    openDetail,
    connectDevice,
    saveEntry,
  };
}
type PreviewState = ReturnType<typeof usePreviewState>;
const PreviewContext = createContext<PreviewState | null>(null);
export function PreviewProvider({ children }: { children: ReactNode }) {
  const state = usePreviewState();
  return <PreviewContext.Provider value={state}>{children}</PreviewContext.Provider>;
}
export function usePreview() {
  const value = useContext(PreviewContext);
  if (!value) throw new Error('Design preview must be rendered within PreviewProvider');
  return value;
}
