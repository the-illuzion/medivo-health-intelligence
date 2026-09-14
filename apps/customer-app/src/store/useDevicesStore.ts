import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

export interface ConnectedDevice {
  id: string;
  name: string;
  kind: 'watch' | 'monitor' | 'ring' | 'cgm';
  sync: string;
  sharing: string[];
  enabled: boolean;
  batteryLevel?: number;
  batteryStatus?: string;
  needsAttention?: boolean;
}

interface DevicesState {
  devices: ConnectedDevice[];
  ringConnected: boolean;
  isLoading: boolean;
  error: string | null;

  fetchDevices: () => Promise<void>;
  toggleDeviceSync: (deviceId: string) => Promise<void>;
  connectDevice: (name: string, kind?: ConnectedDevice['kind'], scopes?: string[]) => Promise<void>;
  setRingConnected: (connected: boolean) => void;
  toggleRingConnected: () => void;
}

export const useDevicesStore = create<DevicesState>((set, get) => ({
  devices: [],
  ringConnected: false,
  isLoading: false,
  error: null,

  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.devices.list();
      if (res && Array.isArray(res)) {
        set({ devices: res, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  toggleDeviceSync: async (deviceId: string) => {
    const { devices } = get();
    const target = devices.find((d) => d.id === deviceId || d.name === deviceId);
    if (!target) return;

    const newEnabled = !target.enabled;
    set({
      devices: devices.map((d) =>
        d.id === deviceId || d.name === deviceId
          ? { ...d, enabled: newEnabled, sync: newEnabled ? 'Just now' : d.sync }
          : d
      ),
    });

    try {
      await apiClient.devices.toggleSync(target.id, newEnabled);
    } catch {
    }
  },

  connectDevice: async (name: string, kind = 'watch', scopes = ['Heart Rate', 'Sleep', 'Activity']) => {
    const { devices } = get();
    const existing = devices.find((d) => d.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      set({
        devices: devices.map((d) =>
          d.name.toLowerCase() === name.toLowerCase()
            ? { ...d, enabled: true, sync: 'Just now', needsAttention: false }
            : d
        ),
      });
    } else {
      set({
        devices: [
          ...devices,
          {
            id: `dev-${Date.now()}`,
            name,
            kind,
            sync: 'Just now',
            sharing: scopes,
            enabled: true,
            batteryLevel: 100,
            batteryStatus: 'Full',
            needsAttention: false,
          },
        ],
      });
    }

    try {
      await apiClient.devices.connect(name, kind, scopes);
    } catch {
    }
  },

  setRingConnected: (connected: boolean) => set({ ringConnected: connected }),
  toggleRingConnected: () => set((state) => ({ ringConnected: !state.ringConnected })),
}));
