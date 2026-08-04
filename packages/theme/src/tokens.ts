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

// Clean White Light Mode & Deep Slate/Navy Dark Mode Palette
export const darkThemeColors: ThemeColors = {
  primary: '#1F7FC4',       // Medivo Clinical Blue
  primaryHover: '#1565C0',  // Deep Hospital Blue
  primaryLight: '#38BDF8',  // Sky Cyan Blue
  accent: '#0284C7',       // Ocean Cyan
  accentHover: '#0369A1',  // Deep Cyan
  accentLight: '#7DD3FC',  // Light Cyan
  background: '#090D16',  // Pure Deep Slate/Navy Dark Background
  surface: '#111827',     // Slate Card Surface
  surfaceElevated: '#1F2937', // Slate Elevated Surface
  border: '#374151',      // Border Slate
  textPrimary: '#FFFFFF', // High Contrast White Text
  textMuted: '#CBD5E1',   // Slate Muted Text
  textSoft: '#94A3B8',    // Slate Soft Text
  success: '#10B981',     // Success Emerald
  warning: '#F59E0B',     // Amber Warning
  error: '#EF4444',       // Red Error
  cardShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
};

export const lightThemeColors: ThemeColors = {
  primary: '#1F7FC4',       // Medivo Clinical Blue
  primaryHover: '#1565C0',  // Deep Hospital Blue
  primaryLight: '#0284C7',  // Cyan Medical Blue
  accent: '#0D47A1',       // Navy Accent
  accentHover: '#0A387E',  // Dark Navy
  accentLight: '#38BDF8',  // Sky Blue
  background: '#FFFFFF',  // Clean Pure White Light Background
  surface: '#F8FAFC',     // Soft Slate Light Card Surface
  surfaceElevated: '#F1F5F9', // Elevated Card Surface
  border: '#E2E8F0',      // Crisp Border Slate
  textPrimary: '#0F172A', // High Contrast Dark Slate Text
  textMuted: '#334155',   // Slate Muted Text
  textSoft: '#64748B',    // Soft Muted Text
  success: '#059669',     // Success Emerald
  warning: '#D97706',     // Amber Warning
  error: '#DC2626',       // Red Error
  cardShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
};

export const typography = {
  fontFamily: 'Inter, Satoshi, Manrope, -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  fontFamilyMono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
};
