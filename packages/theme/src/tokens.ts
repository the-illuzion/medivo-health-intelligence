export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  textSoft: string;
  success: string;
  warning: string;
  error: string;
  cardShadow: string;
}

export const darkThemeColors: ThemeColors = {
  primary: '#10B981',
  primaryHover: '#059669',
  primaryLight: '#34D399',
  accent: '#6366F1',
  accentHover: '#4F46E5',
  accentLight: '#818CF8',
  background: '#0D1F1C',
  surface: '#162E29',
  surfaceElevated: '#1C3833',
  border: '#2A4A43',
  textPrimary: '#FFFFFF',
  textMuted: '#94A3B8',
  textSoft: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  cardShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
};

export const lightThemeColors: ThemeColors = {
  primary: '#0D9488',
  primaryHover: '#0F766E',
  primaryLight: '#2DD4BF',
  accent: '#4F46E5',
  accentHover: '#4338CA',
  accentLight: '#6366F1',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textMuted: '#475569',
  textSoft: '#64748B',
  success: '#10B981',
  warning: '#D97706',
  error: '#DC2626',
  cardShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif',
  fontFamilyMono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
};
