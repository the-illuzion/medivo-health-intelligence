export interface AppleHealthSyncResult {
  available: boolean;
  syncedSamples: number;
  deletedSamples: number;
  lastSyncedAt: string | null;
}

export const appleHealthService = {
  async isAvailable(): Promise<boolean> {
    return false;
  },

  async resetSyncState(_userId: string): Promise<void> {
    return;
  },

  async connectAndSync(_userId: string): Promise<AppleHealthSyncResult> {
    throw new Error('Apple Health is only available in the iOS app.');
  },
};
