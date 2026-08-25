import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Platform, Appearance } from 'react-native';
import { colorScheme as nwColorScheme } from 'react-native-css-interop';
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
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  const getSystemIsDark = useCallback((): boolean => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    const rnScheme = Appearance.getColorScheme();
    return rnScheme === 'dark';
  }, []);

  const [systemIsDark, setSystemIsDark] = useState<boolean>(getSystemIsDark);

  useEffect(() => {
    // 1. Web media query listener
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setSystemIsDark(e.matches);
      };
      setSystemIsDark(mediaQuery.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    // 2. React Native Appearance listener
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemIsDark(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, [getSystemIsDark]);

  const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
  const colors = useMemo(() => (isDark ? darkThemeColors : lightThemeColors), [isDark]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
    try {
      nwColorScheme.set(newMode === 'system' ? 'system' : newMode);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      nwColorScheme.set(mode === 'system' ? 'system' : mode);
    } catch (e) {}

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      const body = document.body;

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
        if (body) {
          body.style.backgroundColor = '#090D16';
          body.style.color = '#FFFFFF';
        }
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        if (body) {
          body.style.backgroundColor = '#FFFFFF';
          body.style.color = '#0F172A';
        }
      }
    }
  }, [isDark, mode]);

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
