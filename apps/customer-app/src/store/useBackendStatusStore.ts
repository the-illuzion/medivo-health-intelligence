import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

interface BackendStatusState {
  isBackendDown: boolean;
  isChecking: boolean;
  errorMessage: string | null;
  lastChecked: string | null;
  setBackendDown: (isDown: boolean, message?: string) => void;
  checkHealth: () => Promise<boolean>;
}

export const useBackendStatusStore = create<BackendStatusState>((set, get) => {
  // Wire up apiClient error listener on store initialization
  apiClient.onError = (err: Error) => {
    console.warn('[Backend Status Listener]: API Request Failure —', err.message);
    set({
      isBackendDown: true,
      errorMessage: err.message || 'Backend service is unreachable',
      lastChecked: new Date().toISOString(),
    });
  };

  return {
    isBackendDown: false,
    isChecking: false,
    errorMessage: null,
    lastChecked: null,

    setBackendDown: (isDown: boolean, message?: string) => {
      set({
        isBackendDown: isDown,
        errorMessage: isDown ? message || 'Backend service is unreachable' : null,
        lastChecked: new Date().toISOString(),
      });
    },

    checkHealth: async () => {
      set({ isChecking: true });
      try {
        await apiClient.healthCheck();
        set({
          isBackendDown: false,
          errorMessage: null,
          isChecking: false,
          lastChecked: new Date().toISOString(),
        });
        return true;
      } catch (err: any) {
        console.warn('[Health Check Failed]:', err.message);
        set({
          isBackendDown: true,
          errorMessage: err.message || 'Unable to establish connection to Medivo API servers.',
          isChecking: false,
          lastChecked: new Date().toISOString(),
        });
        return false;
      }
    },
  };
});
