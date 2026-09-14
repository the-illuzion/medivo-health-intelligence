import { create } from 'zustand';
import { apiClient } from '@medivo/api-client';

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  isActive: boolean;
}

export interface CareNetworkMember {
  id: string;
  name: string;
  relationship: string;
  role: string;
  isMale: boolean;
  isActive: boolean;
}

export interface HealthRecordItem {
  id: string;
  title: string;
  recordType: 'lab' | 'medical' | 'prescription';
  doctorName: string;
  recordDate: string;
  notes: string;
}

export interface HealthProfileData {
  userId: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  location: string;
  email: string;
  healthConditions: string[];
  allergies: string[];
  healthGoals: string[];
  lifestyle: {
    sleep: string;
    activity: string;
    diet: string;
  };
  medications: MedicationItem[];
  careNetwork: CareNetworkMember[];
  healthRecords: HealthRecordItem[];
  preferences: {
    notifications: boolean;
    healthDataSharing: boolean;
    backgroundAppRefresh: boolean;
  };
}

interface HealthProfileState {
  profile: HealthProfileData;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updatePreferences: (key: keyof HealthProfileData['preferences'], val: boolean) => void;
  addMedication: (name: string, dosage: string, frequency?: string) => Promise<void>;
  addCareMember: (name: string, relationship: string, role?: string, isMale?: boolean) => Promise<void>;
  addHealthRecord: (title: string, recordType: 'lab' | 'medical' | 'prescription', doctorName?: string, recordDate?: string) => Promise<void>;
}

const initialProfile: HealthProfileData = {
  userId: '',
  name: '',
  age: 0,
  gender: 'Not specified',
  dateOfBirth: 'Not specified',
  bloodGroup: 'Not specified',
  location: 'Not specified',
  email: '',
  healthConditions: [],
  allergies: [],
  healthGoals: [],
  lifestyle: {
    sleep: 'Not specified',
    activity: 'Not specified',
    diet: 'Not specified',
  },
  medications: [],
  careNetwork: [],
  healthRecords: [],
  preferences: {
    notifications: true,
    healthDataSharing: true,
    backgroundAppRefresh: false,
  },
};

export const useHealthProfileStore = create<HealthProfileState>((set, get) => ({
  profile: initialProfile,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.healthProfile.get();
      if (res) {
        set({ profile: res, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateName: async (name: string) => {
    set((state) => ({ profile: { ...state.profile, name } }));
    try {
      await apiClient.healthProfile.update({ name });
    } catch {
    }
  },

  updatePreferences: (key, val) => {
    set((state) => ({
      profile: {
        ...state.profile,
        preferences: {
          ...state.profile.preferences,
          [key]: val,
        },
      },
    }));
  },

  addMedication: async (name, dosage, frequency = 'Daily') => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name,
      dosage,
      frequency,
      instructions: '',
      isActive: true,
    };
    set((state) => ({
      profile: {
        ...state.profile,
        medications: [...state.profile.medications, newMed],
      },
    }));
    try {
      await apiClient.healthProfile.addMedication({ name, dosage, frequency });
    } catch {
    }
  },

  addCareMember: async (name, relationship, role = 'Active', isMale = false) => {
    const newMember: CareNetworkMember = {
      id: `cn-${Date.now()}`,
      name,
      relationship,
      role,
      isMale,
      isActive: true,
    };
    set((state) => ({
      profile: {
        ...state.profile,
        careNetwork: [...state.profile.careNetwork, newMember],
      },
    }));
    try {
      await apiClient.healthProfile.addCareMember({ memberName: name, relationship, role, isMale });
    } catch {
    }
  },

  addHealthRecord: async (title, recordType, doctorName = 'Attending Physician', recordDate) => {
    const newRec: HealthRecordItem = {
      id: `rec-${Date.now()}`,
      title,
      recordType,
      doctorName,
      recordDate: recordDate || new Date().toISOString().slice(0, 10),
      notes: '',
    };
    set((state) => ({
      profile: {
        ...state.profile,
        healthRecords: [...state.profile.healthRecords, newRec],
      },
    }));
    try {
      await apiClient.healthProfile.addRecord({ title, recordType, doctorName, recordDate });
    } catch {
    }
  },
}));
