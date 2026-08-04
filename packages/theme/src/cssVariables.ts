import { darkThemeColors, lightThemeColors } from './tokens';

export const cssVariablesString = `
:root {
  --color-primary: ${lightThemeColors.primary};
  --color-primary-hover: ${lightThemeColors.primaryHover};
  --color-primary-light: ${lightThemeColors.primaryLight};
  --color-accent: ${lightThemeColors.accent};
  --color-accent-hover: ${lightThemeColors.accentHover};
  --color-background: ${lightThemeColors.background};
  --color-surface: ${lightThemeColors.surface};
  --color-surface-elevated: ${lightThemeColors.surfaceElevated};
  --color-border: ${lightThemeColors.border};
  --color-text-primary: ${lightThemeColors.textPrimary};
  --color-text-muted: ${lightThemeColors.textMuted};
  --color-text-soft: ${lightThemeColors.textSoft};
  --color-success: ${lightThemeColors.success};
  --color-warning: ${lightThemeColors.warning};
  --color-error: ${lightThemeColors.error};
  --card-shadow: ${lightThemeColors.cardShadow};
}

.dark {
  --color-primary: ${darkThemeColors.primary};
  --color-primary-hover: ${darkThemeColors.primaryHover};
  --color-primary-light: ${darkThemeColors.primaryLight};
  --color-accent: ${darkThemeColors.accent};
  --color-accent-hover: ${darkThemeColors.accentHover};
  --color-background: ${darkThemeColors.background};
  --color-surface: ${darkThemeColors.surface};
  --color-surface-elevated: ${darkThemeColors.surfaceElevated};
  --color-border: ${darkThemeColors.border};
  --color-text-primary: ${darkThemeColors.textPrimary};
  --color-text-muted: ${darkThemeColors.textMuted};
  --color-text-soft: ${darkThemeColors.textSoft};
  --color-success: ${darkThemeColors.success};
  --color-warning: ${darkThemeColors.warning};
  --color-error: ${darkThemeColors.error};
  --card-shadow: ${darkThemeColors.cardShadow};
}
`;
