import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { ThemeMode, darkThemeColors, lightThemeColors, ThemeColors } from '@medivo/theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  colors: darkThemeColors,
  isDark: true,
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const activeMode = mode === 'system' ? (systemColorScheme ?? 'dark') : mode;
  const isDark = activeMode === 'dark';
  const colors = isDark ? darkThemeColors : lightThemeColors;

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
