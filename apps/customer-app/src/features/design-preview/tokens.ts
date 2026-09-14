// Isolated reference-derived tokens. Never changes the existing app theme.
export const colors = {
  navy: '#0c1935',
  blue: '#086af5',
  green: '#09885a',
  red: '#e75773',
  orange: '#f09727',
  purple: '#8550d6',
  muted: '#647187',
  background: '#f6f9fd',
  border: '#e6edf5',
  white: '#ffffff',
  blueSoft: '#edf5ff',
  greenSoft: '#eaf9f2',
  redSoft: '#fff0f2',
  orangeSoft: '#fff3e7',
  purpleSoft: '#f1ebfc',
};
export const tones = {
  blue: { foreground: colors.blue, background: colors.blueSoft },
  green: { foreground: colors.green, background: colors.greenSoft },
  red: { foreground: colors.red, background: colors.redSoft },
  orange: { foreground: colors.orange, background: colors.orangeSoft },
  purple: { foreground: colors.purple, background: colors.purpleSoft },
};
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
export const radius = { small: 10, card: 18, pill: 99 };
export const designRoutes = {
  home: '/design',
  metrics: '/design/insights',
  scan: '/design/scan',
  care: '/design/care',
  profile: '/design/profile',
  devices: '/design/devices',
  connect: '/design/connect-device',
  status: '/design/health-status',
  metric: '/design/metric-details',
} as const;
