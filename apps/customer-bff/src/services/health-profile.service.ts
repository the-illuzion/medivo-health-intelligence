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

class HealthProfileService {
  private profiles = new Map<string, HealthProfileData>();

  private createDefaultProfile(userId: string): HealthProfileData {
    return {
      userId,
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
  }

  public getProfile(userId: string, userSession?: { name?: string; email?: string }): HealthProfileData {
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, this.createDefaultProfile(userId));
    }
    const profile = this.profiles.get(userId)!;
    if (userSession?.name) profile.name = userSession.name;
    if (userSession?.email) profile.email = userSession.email;
    return profile;
  }

  public updateProfile(userId: string, partial: Partial<HealthProfileData>): HealthProfileData {
    const profile = this.getProfile(userId);
    Object.assign(profile, partial);
    return profile;
  }

  public addMedication(userId: string, item: { name: string; dosage: string; frequency?: string; instructions?: string }): HealthProfileData {
    const profile = this.getProfile(userId);
    profile.medications.push({
      id: `med-${Date.now()}`,
      name: item.name,
      dosage: item.dosage,
      frequency: item.frequency || 'Daily',
      instructions: item.instructions || '',
      isActive: true,
    });
    return profile;
  }

  public addCareMember(userId: string, item: { memberName: string; relationship: string; role?: string; isMale?: boolean }): HealthProfileData {
    const profile = this.getProfile(userId);
    profile.careNetwork.push({
      id: `cn-${Date.now()}`,
      name: item.memberName,
      relationship: item.relationship,
      role: item.role || 'Active',
      isMale: item.isMale ?? false,
      isActive: true,
    });
    return profile;
  }

  public addHealthRecord(userId: string, item: { title: string; recordType: 'lab' | 'medical' | 'prescription'; doctorName?: string; recordDate?: string; notes?: string }): HealthProfileData {
    const profile = this.getProfile(userId);
    profile.healthRecords.push({
      id: `rec-${Date.now()}`,
      title: item.title,
      recordType: item.recordType,
      doctorName: item.doctorName || 'Attending Physician',
      recordDate: item.recordDate || new Date().toISOString().slice(0, 10),
      notes: item.notes || '',
    });
    return profile;
  }
}

export const healthProfileService = new HealthProfileService();
