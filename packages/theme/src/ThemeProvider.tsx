'use client';

import React, { useState, useEffect } from 'react';
import { ThemeMode, darkThemeColors, lightThemeColors } from './tokens';
import { ThemeContext } from './useTheme';

const STORAGE_KEY = 'medivo_theme_mode';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeScript: React.FC = () => {
  const scriptContent = `
    (function() {
      try {
        var mode = localStorage.getItem('${STORAGE_KEY}');
        var supportDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = mode === 'dark' || ((!mode || mode === 'system') && supportDarkMode);
        var root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          root.classList.remove('light');
          root.style.backgroundColor = '#090D16';
          root.style.color = '#FFFFFF';
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
          root.style.backgroundColor = '#FFFFFF';
          root.style.color = '#0F172A';
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return defaultMode;
  });

  const getSystemDark = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    return getSystemDark() ? 'dark' : 'light';
  });

  useEffect(() => {
    const updateTheme = () => {
      let isDark = false;
      if (mode === 'system') {
        isDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
      } else {
        isDark = mode === 'dark';
      }

      const activeResolved = isDark ? 'dark' : 'light';
      setResolvedMode(activeResolved);

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
    };

    updateTheme();

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        if (mode === 'system') {
          updateTheme();
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }
  };

  const colors = resolvedMode === 'dark' ? darkThemeColors : lightThemeColors;

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
