import { createContext, useContext } from 'react';
import { ThemeMode, ThemeColors, darkThemeColors, lightThemeColors } from './tokens';

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  resolvedMode: 'dark',
  setMode: () => {},
  colors: darkThemeColors,
});

export const useTheme = () => useContext(ThemeContext);
