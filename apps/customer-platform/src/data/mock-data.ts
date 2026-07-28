import {
  Sparkles, Sun, Camera, MessageCircle, Clock, ShoppingBag,
  Droplet, Droplets, Activity, Layers, Moon, Home, User,
  TrendingUp, Shield, CalendarCheck, Stethoscope, CheckCircle2,
} from 'lucide-react';
import {
  NavItem, QuickAction, MetricData, ChartDataPoint, ReportMetric,
  Recommendation, ChatMessage, HistoryGroup, Product,
  RoutineStep, Doctor, Appointment, UserProfileData,
} from '../types';

export const INK = 'var(--color-ink)';
export const INK_SOFT = 'var(--color-ink-soft)';
export const TEXT_SECONDARY = 'var(--color-text-sec)';
export const TEXT_TERTIARY = 'var(--color-text-tert)';
export const TEXT_FAINT = 'var(--color-text-faint)';
export const FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif';
export const CARD_SHADOW = 'var(--card-shadow)';
export const BG_GRADIENT = 'var(--bg-gradient)';

export const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', screenKey: 'dashboard' },
  { icon: Camera, label: 'Scan', screenKey: 'faceMatch' },
  { icon: MessageCircle, label: 'AI Coach', screenKey: 'coach' },
  { icon: CalendarCheck, label: 'Routines', screenKey: 'routines' },
  { icon: Clock, label: 'History', screenKey: 'history' },
  { icon: ShoppingBag, label: 'Products', screenKey: 'products' },
  { icon: Stethoscope, label: 'Doctors', screenKey: 'consultations' },
  { icon: User, label: 'Profile', screenKey: 'profile' },
];

export const quickActions: QuickAction[] = [
  { icon: Camera, label: 'Face Scan', bg: '#E0E7FF', color: '#4338CA', target: 'faceMatch' },
  { icon: MessageCircle, label: 'AI Coach', bg: '#E0F2FE', color: '#0284C7', target: 'coach' },
  { icon: CalendarCheck, label: 'Routines', bg: '#FEF3C7', color: '#D97706', target: 'routines' },
  { icon: Stethoscope, label: 'Consult', bg: '#FCE7F3', color: '#DB2777', target: 'consultations' },
  { icon: ShoppingBag, label: 'Shop', bg: '#EDE9FE', color: '#7C3AED', target: 'products' },
];

export const metricsData: MetricData[] = [
  { icon: Sparkles, label: 'Skin Score', score: 87, delta: 4, data: [79, 81, 83, 85, 87] },
  { icon: Droplet, label: 'Hydration', score: 76, unit: '%', delta: 8, data: [65, 68, 70, 73, 76] },
  { icon: Activity, label: 'Wrinkles', score: 91, delta: 1, data: [89, 90, 89, 91, 91] },
  { icon: Sun, label: 'Pigmentation', score: 84, delta: 3, data: [77, 79, 81, 82, 84] },
  { icon: Droplets, label: 'Oil Balance', score: 68, delta: -3, data: [74, 72, 70, 69, 68] },
  { icon: Layers, label: 'Texture', score: 79, delta: 4, data: [72, 74, 75, 77, 79] },
  { icon: Moon, label: 'Dark Circles', score: 73, delta: 6, data: [61, 65, 68, 70, 73], span2: true },
];

export const weeklyData: ChartDataPoint[] = [
  { label: 'Mon', score: 78 }, { label: 'Tue', score: 80 }, { label: 'Wed', score: 79 },
  { label: 'Thu', score: 83 }, { label: 'Fri', score: 85 }, { label: 'Sat', score: 84 }, { label: 'Sun', score: 87 },
];

export const monthlyData: ChartDataPoint[] = [
  { label: 'Week 1', score: 71 }, { label: 'Week 2', score: 75 }, { label: 'Week 3', score: 79 }, { label: 'Week 4', score: 87 },
];

export const reportMetrics: ReportMetric[] = [
  { icon: Sparkles, label: 'Skin Score', score: 87, delta: 4, note: 'Your overall skin health continues trending upward.' },
  { icon: Droplet, label: 'Hydration', score: 76, unit: '%', delta: 8, note: 'Moisture levels are improving — keep up the water intake.' },
  { icon: Activity, label: 'Wrinkles', score: 91, delta: 1, note: 'Fine lines remain minimal and stable.' },
  { icon: Sun, label: 'Pigmentation', score: 84, delta: 3, note: 'Sun spots are fading gradually with consistent SPF use.' },
  { icon: Droplets, label: 'Oil Balance', score: 68, delta: -3, note: 'Slightly elevated oil production — try a lighter moisturizer.' },
  { icon: Layers, label: 'Texture', score: 79, delta: 4, note: 'Skin texture is smoothing out nicely.' },
  { icon: Moon, label: 'Dark Circles', score: 73, delta: 6, note: 'Under-eye circles are visibly reducing.' },
];

export const recommendations: Recommendation[] = [
  { icon: Droplet, text: 'Increase water intake' },
  { icon: Sparkles, text: 'Try a Vitamin C serum' },
  { icon: Moon, text: 'Consistent sleep' },
];

export const initialMessages: ChatMessage[] = [
  { sender: 'ai', text: "Good morning, Sarah! I noticed your hydration score jumped 8% this week 🎉 What's been working?" },
  { sender: 'user', text: "I've been drinking more water and using the new moisturizer" },
  { sender: 'ai', text: "That's a great combo — the moisturizer helps lock in what you're drinking. Want me to adjust your evening routine to build on this?" },
];

export const chatSuggestions = ['Yes, adjust it', 'Rate my sleep', 'Suggest a routine'];

export const overviewData: ChartDataPoint[] = [
  { label: 'Jun 8', score: 75 }, { label: 'Jun 15', score: 73 }, { label: 'Jun 22', score: 78 }, { label: 'Jun 29', score: 79 },
  { label: 'Jul 6', score: 82 }, { label: 'Jul 13', score: 81 }, { label: 'Jul 20', score: 83 }, { label: 'Jul 27', score: 87 },
];

export const historyGroups: HistoryGroup[] = [
  { month: 'July 2026', entries: [
    { date: 'Jul 27', time: '8:42 AM', healthScore: 87, skinScore: 84, delta: 4 },
    { date: 'Jul 20', time: '9:15 AM', healthScore: 83, skinScore: 80, delta: 2 },
    { date: 'Jul 13', time: '8:30 AM', healthScore: 81, skinScore: 78, delta: -1 },
    { date: 'Jul 6', time: '9:02 AM', healthScore: 82, skinScore: 79, delta: 3 },
  ] },
  { month: 'June 2026', entries: [
    { date: 'Jun 29', time: '8:50 AM', healthScore: 79, skinScore: 76, delta: 1 },
    { date: 'Jun 22', time: '9:20 AM', healthScore: 78, skinScore: 75, delta: 5 },
    { date: 'Jun 15', time: '8:40 AM', healthScore: 73, skinScore: 70, delta: -2 },
    { date: 'Jun 8', time: '9:05 AM', healthScore: 75, skinScore: 72, delta: 2 },
  ] },
];

export const categories = ['All', 'Cleansers', 'Serums', 'Moisturizers', 'SPF'];

export const products: Product[] = [
  { id: 1, name: 'Hydra Renew Serum', category: 'Serums', price: 48, rating: 4.8, tag: 'Matches your Hydration goal', icon: Droplet, tint: '#E0E7FF', accent: '#4338CA' },
  { id: 2, name: 'Overnight Repair Cream', category: 'Moisturizers', price: 62, rating: 4.9, tag: 'Boosts Skin Score overnight', icon: Moon, tint: '#EDE9FE', accent: '#7C3AED' },
  { id: 3, name: 'Balancing Clay Cleanser', category: 'Cleansers', price: 34, rating: 4.6, tag: 'Targets Oil Balance', icon: Droplets, tint: '#FEF3C7', accent: '#D97706' },
  { id: 4, name: 'Vitamin C Brightening Drops', category: 'Serums', price: 56, rating: 4.7, tag: 'Supports Pigmentation', icon: Sun, tint: '#D1FAE5', accent: '#059669' },
  { id: 5, name: 'Retinol Smoothing Complex', category: 'Serums', price: 58, rating: 4.8, tag: 'Improves Texture', icon: Layers, tint: '#E0F2FE', accent: '#0284C7' },
  { id: 6, name: 'Mineral SPF 50 Shield', category: 'SPF', price: 32, rating: 4.9, tag: 'Protects your progress', icon: Shield, tint: '#FCE7F3', accent: '#DB2777' },
];

export const meshDots = [
  { top: '20%', left: '50%' }, { top: '27%', left: '32%' }, { top: '27%', left: '68%' },
  { top: '48%', left: '24%' }, { top: '48%', left: '76%' }, { top: '55%', left: '50%' },
  { top: '70%', left: '34%' }, { top: '70%', left: '66%' }, { top: '80%', left: '50%' },
];

export const scanMessages = [
  'Checking hydration levels...', 'Detecting texture patterns...', 'Analyzing pigmentation...',
  'Mapping fine lines...', 'Finalizing your Skin Score...',
];

export const routineStepsData: RoutineStep[] = [
  { id: 'm1', title: 'Gentle Cleansing', timeOfDay: 'morning', stepNumber: 1, duration: '2 min', productName: 'Balancing Clay Cleanser', completed: true, icon: Droplets, accent: '#D97706' },
  { id: 'm2', title: 'Vitamin C Boost', timeOfDay: 'morning', stepNumber: 2, duration: '1 min', productName: 'Vitamin C Brightening Drops', completed: true, icon: Sun, accent: '#059669' },
  { id: 'm3', title: 'Hydration Lock', timeOfDay: 'morning', stepNumber: 3, duration: '1 min', productName: 'Hydra Renew Serum', completed: false, icon: Droplet, accent: '#4338CA' },
  { id: 'm4', title: 'SPF 50 Protection', timeOfDay: 'morning', stepNumber: 4, duration: '1 min', productName: 'Mineral SPF 50 Shield', completed: false, icon: Shield, accent: '#DB2777' },
  
  { id: 'e1', title: 'Double Cleansing', timeOfDay: 'evening', stepNumber: 1, duration: '3 min', productName: 'Balancing Clay Cleanser', completed: false, icon: Droplets, accent: '#D97706' },
  { id: 'e2', title: 'Texture Repair', timeOfDay: 'evening', stepNumber: 2, duration: '2 min', productName: 'Retinol Smoothing Complex', completed: false, icon: Layers, accent: '#0284C7' },
  { id: 'e3', title: 'Overnight Hydration', timeOfDay: 'evening', stepNumber: 3, duration: '2 min', productName: 'Overnight Repair Cream', completed: false, icon: Moon, accent: '#7C3AED' },
];

export const doctorsData: Doctor[] = [
  { id: 1, name: 'Dr. Elena Rostova', title: 'Board Certified Dermatologist', rating: 4.9, reviewsCount: 124, specialty: 'Skin Health & Anti-Aging', price: 95, nextAvailable: 'Today, 3:30 PM', avatarBg: 'linear-gradient(135deg, #4338CA, #6366F1)', slots: ['3:30 PM', '4:15 PM', '5:00 PM'] },
  { id: 2, name: 'Dr. Marcus Vance', title: 'Clinical Cosmetic Specialist', rating: 4.8, reviewsCount: 98, specialty: 'Acne & Pigmentation', price: 85, nextAvailable: 'Tomorrow, 10:00 AM', avatarBg: 'linear-gradient(135deg, #0EA5E9, #0284C7)', slots: ['10:00 AM', '11:30 AM', '2:00 PM'] },
  { id: 3, name: 'Dr. Sophia Chen', title: 'Dermatopathologist & Researcher', rating: 5.0, reviewsCount: 210, specialty: 'Sensitivities & Eczema', price: 110, nextAvailable: 'Thursday, 1:00 PM', avatarBg: 'linear-gradient(135deg, #059669, #10B981)', slots: ['1:00 PM', '3:00 PM', '4:30 PM'] },
];

export const appointmentsData: Appointment[] = [
  { id: 'apt-1', doctorName: 'Dr. Elena Rostova', specialty: 'Skin Health Review', date: 'Jul 30, 2026', time: '3:30 PM', status: 'upcoming', avatarBg: 'linear-gradient(135deg, #4338CA, #6366F1)' },
];

export const userProfileData: UserProfileData = {
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  avatarInitials: 'SJ',
  plan: 'Medivo Pro Member',
  healthScore: 87,
  skinType: 'Combination - Sensitive',
  goals: ['Hydration Improvement', 'Dark Circle Reduction', 'Sun Protection'],
  hipaaConsent: true,
  appleHealthSync: true,
  googleFitSync: false,
  notificationsEnabled: true,
};
