import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { colorScheme as nwColorScheme, useColorScheme } from 'react-native-css-interop';
import { ThemeMode, darkThemeColors, lightThemeColors, ThemeColors } from '@medivo/theme';

const STORAGE_KEY = 'medivo_customer_theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  colors: lightThemeColors,
  isDark: false,
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const activeMode = mode === 'system' ? (currentScheme.colorScheme ?? 'light') : mode;
  const isDark = activeMode === 'dark';
  const colors = isDark ? darkThemeColors : lightThemeColors;

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
    try {
      if (newMode === 'system') {
        nwColorScheme.set('system');
      } else {
        nwColorScheme.set(newMode);
      }
    } catch (e) {
      console.warn('CSS Interop colorScheme fallback:', e);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        if (body) {
          body.style.backgroundColor = '#090D16';
          body.style.color = '#FFFFFF';
        }
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        if (body) {
          body.style.backgroundColor = '#FFFFFF';
          body.style.color = '#0F172A';
        }
      }
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
