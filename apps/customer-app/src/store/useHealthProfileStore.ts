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
  userId: 'usr-101',
  name: 'Alex Morgan',
  age: 32,
  gender: 'Male',
  dateOfBirth: 'Jan 12, 1992',
  bloodGroup: 'O+',
  location: 'San Francisco, CA',
  email: 'alex.morgan@example.com',
  healthConditions: ['Hypertension · Managed with care team'],
  allergies: ['No known allergies recorded'],
  healthGoals: [
    'Keep a consistent sleep schedule',
    'Walk for 30 minutes daily',
    'Track blood pressure regularly',
  ],
  lifestyle: {
    sleep: 'Usually 7–8 hours',
    activity: 'Light to moderate',
    diet: 'Balanced meals',
  },
  medications: [
    { id: 'med-1', name: 'Lisinopril', dosage: '10 mg', frequency: 'Each morning', instructions: '1 tablet with water', isActive: true },
    { id: 'med-2', name: 'Vitamin D', dosage: '1 tablet', frequency: 'With breakfast', instructions: 'Daily supplement', isActive: true },
  ],
  careNetwork: [
    { id: 'cn-1', name: 'Rahul Sharma', relationship: 'Family Member', role: 'Active', isMale: true, isActive: true },
    { id: 'cn-2', name: 'Dr. Neha Verma', relationship: 'Primary Physician', role: 'Active', isMale: false, isActive: true },
  ],
  healthRecords: [
    { id: 'rec-1', title: 'Blood count', recordType: 'lab', doctorName: 'Apex Diagnostic Labs', recordDate: 'Apr 21, 2025', notes: 'Routine CBC normal' },
    { id: 'rec-2', title: 'Lipid profile', recordType: 'lab', doctorName: 'Apex Diagnostic Labs', recordDate: 'Mar 10, 2025', notes: 'Cholesterol within normal limit' },
    { id: 'rec-3', title: 'Annual health review', recordType: 'medical', doctorName: 'Dr. Neha Verma', recordDate: 'Apr 15, 2025', notes: 'Blood pressure stable' },
    { id: 'rec-4', title: 'Prescription: Lisinopril', recordType: 'prescription', doctorName: 'Dr. Neha Verma', recordDate: 'Apr 15, 2025', notes: 'Lisinopril 10 mg daily' },
  ],
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
