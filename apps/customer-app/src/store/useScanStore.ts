import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@medivo/api-client';
import { SkinScanResult } from '@medivo/types';
import { authStorage } from '../utils/authStorage';

interface ScanState {
  activeScan: SkinScanResult | null;
  scanHistory: SkinScanResult[];
  isScanning: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  consentGiven: boolean;

  // Actions
  setConsentGiven: (consent: boolean) => void;
  performScan: (imageBase64: string) => Promise<SkinScanResult | null>;
  fetchScanHistory: () => Promise<SkinScanResult[]>;
  fetchScanById: (scanId: string) => Promise<SkinScanResult | null>;
  setActiveScan: (scan: SkinScanResult | null) => void;
  clearActiveScan: () => void;
  resetScanState: () => void;
  clearError: () => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      activeScan: null,
      scanHistory: [],
      isScanning: false,
      isLoadingHistory: false,
      error: null,
      consentGiven: true,

      setConsentGiven: (consent: boolean) => set({ consentGiven: consent }),

      performScan: async (imageBase64: string) => {
        const { consentGiven } = get();
        if (!consentGiven) {
          set({ error: 'HIPAA consent is required before performing an AI scan.' });
          return null;
        }

        set({ isScanning: true, error: null });
        try {
          const scanResult = await apiClient.scans.analyze(imageBase64, consentGiven, 'v1.0');
          set((state) => ({
            activeScan: scanResult,
            scanHistory: [scanResult, ...state.scanHistory.filter((s) => s.id !== scanResult.id)],
            isScanning: false,
            error: null,
          }));
          return scanResult;
        } catch (err: any) {
          const errorMessage = err?.message || 'AI Telemetry scan failed. Please try again.';
          set({ error: errorMessage, isScanning: false });
          return null;
        }
      },

      fetchScanHistory: async () => {
        set({ isLoadingHistory: true, error: null });
        try {
          const history = await apiClient.scans.getHistory();
          if (Array.isArray(history)) {
            set({
              scanHistory: history,
              activeScan: history.length > 0 ? (get().activeScan || history[0]) : null,
              isLoadingHistory: false,
            });
            return history;
          }
          set({ isLoadingHistory: false });
          return get().scanHistory;
        } catch (err: any) {
          console.warn('[useScanStore] fetchScanHistory failed:', err?.message);
          set({ isLoadingHistory: false });
          return get().scanHistory;
        }
      },

      fetchScanById: async (scanId: string) => {
        try {
          const scan = await apiClient.scans.getDetails(scanId);
          if (scan) {
            set({ activeScan: scan });
            return scan;
          }
          return null;
        } catch (err: any) {
          console.warn(`[useScanStore] fetchScanById (${scanId}) failed:`, err?.message);
          return null;
        }
      },

      setActiveScan: (scan: SkinScanResult | null) => set({ activeScan: scan }),
      clearActiveScan: () => set({ activeScan: null }),
      resetScanState: () => set({ activeScan: null, scanHistory: [], error: null, isScanning: false, isLoadingHistory: false }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'medivo_scan_telemetry_store',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        activeScan: state.activeScan,
        scanHistory: state.scanHistory,
        consentGiven: state.consentGiven,
      }),
    }
  )
);
