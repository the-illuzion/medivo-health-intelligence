import { ComponentType, SVGProps } from 'react';

export type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; color?: string; strokeWidth?: number | string }>;

export type ScreenKey =
  | 'dashboard'
  | 'faceMatch'
  | 'scanReport'
  | 'coach'
  | 'history'
  | 'routines'
  | 'products'
  | 'consultations'
  | 'profile';

export type FaceMatchStage = 'init' | 'positioning' | 'detected' | 'scanning' | 'complete';
export type ScanStage = FaceMatchStage;

export interface NavItem {
  icon: any;
  label: string;
  screenKey: ScreenKey;
  badge?: string;
}

export interface QuickAction {
  icon: any;
  label: string;
  bg: string;
  color: string;
  target: ScreenKey;
}

export interface MetricData {
  icon: any;
  label: string;
  score: number;
  unit?: string;
  delta: number;
  data: number[];
  span2?: boolean;
}

export interface ChartDataPoint {
  label: string;
  score: number;
}

export interface ReportMetric {
  icon: any;
  label: string;
  score: number;
  unit?: string;
  delta: number;
  note: string;
}

export interface Recommendation {
  icon: any;
  text: string;
}

export interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

export interface HistoryItem {
  date: string;
  time: string;
  healthScore: number;
  skinScore: number;
  delta: number;
}

export interface HistoryGroup {
  month: string;
  entries: HistoryItem[];
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  tag: string;
  icon: any;
  tint: string;
  accent: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  timeOfDay: 'morning' | 'evening';
  stepNumber: number;
  duration: string;
  productName: string;
  completed: boolean;
  icon: any;
  accent: string;
}

export interface Doctor {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  specialty: string;
  price: number;
  nextAvailable: string;
  avatarBg: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  avatarBg: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarInitials: string;
  plan: string;
  healthScore: number;
  skinType: string;
  goals: string[];
  hipaaConsent: boolean;
  appleHealthSync: boolean;
  googleFitSync: boolean;
  notificationsEnabled: boolean;
}

export interface NavigationProps {
  onPush: (nextScreen: ScreenKey) => void;
  onSwitchTab: (nextTab: ScreenKey) => void;
  onBack: () => void;
}
