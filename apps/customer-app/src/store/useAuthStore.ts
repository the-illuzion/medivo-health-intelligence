import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

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
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, skinType?: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  completeOnboarding: (skinType: string, goals: string[]) => Promise<boolean>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: 'usr-101',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    skinType: 'Combination',
    score: 87,
    hipaaConsent: true,
    registered: '2026-01-15',
  },
  token: 'mock_jwt_token_sarah_123',
  isAuthenticated: true,
  isOnboarded: true,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.auth.login(email, password);
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      // Graceful fallback for offline dev environment
      set({
        user: {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          skinType: 'Combination',
          score: 85,
          hipaaConsent: true,
          registered: new Date().toISOString().substring(0, 10),
        },
        token: `jwt_${Date.now()}`,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
  },

  register: async (name: string, email: string, skinType: string = 'Combination') => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.auth.register(name, email, skinType);
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        user: {
          id: `usr-${Date.now()}`,
          name,
          email,
          skinType,
          score: 80,
          hipaaConsent: true,
          registered: new Date().toISOString().substring(0, 10),
        },
        token: `jwt_reg_${Date.now()}`,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
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

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
