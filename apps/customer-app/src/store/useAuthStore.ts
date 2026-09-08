import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@medivo/api-client';
import { authStorage } from '../utils/authStorage';
import { useScanStore } from './useScanStore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  skinType: string;
  score?: number;
  hipaaConsent: boolean;
  registered?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, skinType?: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  completeOnboarding: (skinType: string, goals: string[]) => Promise<boolean>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isOnboarded: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.auth.login(email, password);
          apiClient.setAuthToken(res.token);
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isOnboarded: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            error: err.message || 'Invalid email or password. Please try again.',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          return false;
        }
      },

      register: async (name: string, email: string, password: string, skinType: string = 'Combination') => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.auth.register(name, email, password, skinType);
          apiClient.setAuthToken(res.token);
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isOnboarded: false,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            error: err.message || 'Registration failed. Please try again.',
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          return false;
        }
      },

      verifyOtp: async (_code: string) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 600));
        set({ isLoading: false });
        return true;
      },

      resetPassword: async (_email: string) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 600));
        set({ isLoading: false });
        return true;
      },

      completeOnboarding: async (skinType: string, _goals: string[]) => {
        set((state) => ({
          user: state.user ? { ...state.user, skinType } : null,
          isOnboarded: true,
        }));
        return true;
      },

      updateProfile: async (updatedData: Partial<UserProfile>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        }));
        return true;
      },

      logout: async () => {
        try {
          await apiClient.auth.logout();
        } catch (e) {
        } finally {
          apiClient.setAuthToken(null);
          useScanStore.getState().resetScanState();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isOnboarded: false,
            error: null,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'medivo_auth_session',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          if (state.token) {
            apiClient.setAuthToken(state.token);
          }
        }
      },
    }
  )
);
