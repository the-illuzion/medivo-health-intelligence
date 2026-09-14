// Isolated reference-derived tokens. Never changes the existing app theme.
export const colors = {
  navy: '#0c1935',
  blue: '#086af5',
  green: '#09885a',
  red: '#e75773',
  orange: '#f09727',
  purple: '#8550d6',
  muted: '#69758a',
  background: '#f7faff',
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
export const radius = { small: 10, card: 14, pill: 99 };
export const designRoutes = {
  home: '/(tabs)',
  metrics: '/(tabs)/insights',
  scan: '/(tabs)/scan',
  care: '/(tabs)/care',
  profile: '/(tabs)/profile',
  devices: '/devices',
  connect: '/connect-device',
  status: '/health-status',
  metric: '/metric-details',
} as const;

export function isRouteActive(name: string, pathname: string): boolean {
  if (!pathname) return name === 'Home';
  const clean = pathname.replace(/\/$/, '');
  const normalized = clean.replace(/^\/design/, '');

  switch (name) {
    case 'Home':
      return (
        normalized === '' ||
        normalized === '/' ||
        normalized === '/index' ||
        normalized === '/(tabs)' ||
        normalized === '/(tabs)/index'
      );
    case 'Insights':
      return (
        normalized === '/insights' ||
        normalized === '/(tabs)/insights' ||
        normalized === '/metric-details' ||
        normalized.startsWith('/insights/') ||
        normalized.startsWith('/(tabs)/insights/') ||
        normalized.startsWith('/metric-details/')
      );
    case 'Scan':
      return (
        normalized === '/scan' ||
        normalized === '/(tabs)/scan' ||
        normalized.startsWith('/scan/') ||
        normalized.startsWith('/(tabs)/scan/') ||
        normalized.startsWith('/scan-report')
      );
    case 'Care':
      return (
        normalized === '/care' ||
        normalized === '/(tabs)/care' ||
        normalized.startsWith('/care/') ||
        normalized.startsWith('/(tabs)/care/') ||
        normalized.startsWith('/routine')
      );
    case 'Profile':
      return (
        normalized === '/profile' ||
        normalized === '/(tabs)/profile' ||
        normalized === '/devices' ||
        normalized === '/connect-device' ||
        normalized === '/health-status' ||
        normalized === '/edit-profile' ||
        normalized.startsWith('/profile/') ||
        normalized.startsWith('/(tabs)/profile/') ||
        normalized.startsWith('/devices/') ||
        normalized.startsWith('/connect-device/') ||
        normalized.startsWith('/health-status/') ||
        normalized.startsWith('/edit-profile/')
      );
    default:
      return false;
  }
}

