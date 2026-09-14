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

class DeviceService {
  private initialDevices: ConnectedDevice[] = [
    {
      id: 'dev-1',
      name: 'Apple Watch',
      kind: 'watch',
      sync: '8 min ago',
      sharing: ['Heart Rate', 'Sleep', 'Activity', 'Notifications'],
      enabled: true,
      batteryLevel: 78,
      batteryStatus: '~ 1 day left',
      needsAttention: false,
    },
    {
      id: 'dev-2',
      name: 'Withings BP Monitor',
      kind: 'monitor',
      sync: '2 hrs ago',
      sharing: ['Blood Pressure', 'Heart Rate'],
      enabled: true,
      batteryLevel: 90,
      batteryStatus: '~ 3 months left',
      needsAttention: false,
    },
    {
      id: 'dev-3',
      name: 'Dexcom CGM',
      kind: 'cgm',
      sync: '15 min ago',
      sharing: ['Glucose', 'Notifications'],
      enabled: true,
      batteryLevel: 65,
      batteryStatus: '~ 6 days left',
      needsAttention: false,
    },
    {
      id: 'dev-4',
      name: 'Oura Ring',
      kind: 'ring',
      sync: '1 day ago',
      sharing: ['Sleep', 'Activity', 'Heart Rate'],
      enabled: false,
      batteryLevel: 40,
      batteryStatus: 'Action required',
      needsAttention: true,
    },
  ];

  private userDevices = new Map<string, ConnectedDevice[]>();

  public getDevices(userId: string): ConnectedDevice[] {
    if (!this.userDevices.has(userId)) {
      this.userDevices.set(userId, this.initialDevices.map((d) => ({ ...d })));
    }
    return this.userDevices.get(userId)!;
  }

  public toggleDeviceSync(userId: string, deviceId: string, isEnabled: boolean) {
    const devices = this.getDevices(userId);
    const device = devices.find((d) => d.id === deviceId || d.name.toLowerCase() === deviceId.toLowerCase());
    if (device) {
      device.enabled = isEnabled;
      device.sync = isEnabled ? 'Just now' : device.sync;
    }
    return devices;
  }

  public connectDevice(userId: string, name: string, kind: 'watch' | 'monitor' | 'ring' | 'cgm' = 'watch', sharing: string[] = ['Heart Rate', 'Sleep', 'Activity']) {
    const devices = this.getDevices(userId);
    const existing = devices.find((d) => d.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.enabled = true;
      existing.sync = 'Just now';
      existing.needsAttention = false;
    } else {
      devices.push({
        id: `dev-${Date.now()}`,
        name,
        kind,
        sync: 'Just now',
        sharing,
        enabled: true,
        batteryLevel: 100,
        batteryStatus: 'Full',
        needsAttention: false,
      });
    }
    return devices;
  }
}

export const deviceService = new DeviceService();
