import React, { type ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors as c, designRoutes } from '../tokens';
import { usePreview } from '../PreviewContext';
import { Copy, Icon, IconButton, s } from './UI';
import { Avatar } from './Illustrations';
import { DesktopFrame } from './DesktopShell';

export function useDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 900;
}
export function DesignFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sheet, openDetail } = usePreview();
  const insets = useSafeAreaInsets();
  const status = pathname.includes('health-status');
  const connect = pathname.includes('connect-device');
  const desktop = useDesktop();
  if (desktop) return <DesktopFrame>{children}</DesktopFrame>;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.frame}>
        <View
          style={s.flex}
          accessibilityElementsHidden={!!sheet}
          aria-hidden={!!sheet}
          importantForAccessibility={sheet ? 'no-hide-descendants' : 'auto'}
        >
          {!status && (
            <View style={styles.header}>
              <View style={s.flex}>
                <Text style={styles.logo}>medivo</Text>
                <Copy size={10} color={c.muted}>
                  Health Intelligence for a Better You
                </Copy>
              </View>
              <View>
                <IconButton
                  label="Notifications"
                  name="bell"
                  onPress={() => openDetail('Notifications')}
                />
                <View pointerEvents="none" style={styles.notification}>
                  <Copy size={9} color="white">
                    3
                  </Copy>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open profile"
                onPress={() => router.navigate(designRoutes.profile)}
              >
                <Avatar />
              </Pressable>
            </View>
          )}
          <View style={s.flex}>{children}</View>
          {!status && !connect && <DesignNavigation />}
          {(status || connect) && (
            <View style={{ height: insets.bottom, backgroundColor: 'white' }} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
export function DesignNavigation() {
  const path = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.nav, { paddingBottom: Math.max(8, insets.bottom) }]}
    >
      {(
        [
          { name: 'Home', path: designRoutes.home, icon: 'home' },
          { name: 'Insights', path: designRoutes.metrics, icon: 'chart' },
          { name: 'Scan', path: designRoutes.scan, icon: 'plus' },
          { name: 'Care', path: designRoutes.care, icon: 'heart' },
          { name: 'Profile', path: designRoutes.profile, icon: 'user' },
        ] as const
      ).map((item) => {
        const active = path === item.path;
        const scan = item.name === 'Scan';
        return (
          <Pressable
            key={item.name}
            accessibilityRole="tab"
            accessibilityLabel={item.name}
            accessibilityState={{ selected: active }}
            aria-selected={active}
            onPress={() => router.navigate(item.path)}
            style={styles.navItem}
          >
            <View style={scan ? styles.scanAction : styles.navIcon}>
              <Icon
                name={item.icon}
                size={25}
                color={scan ? 'white' : active ? c.blue : '#8793a2'}
              />
            </View>
            <Copy size={10} color={active ? c.blue : c.muted}>
              {item.name}
            </Copy>
          </Pressable>
        );
      })}
    </View>
  );
}
export function Screen({ children }: { children: ReactNode }) {
  const desktop = useDesktop();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}
      contentContainerStyle={[styles.content, desktop && styles.desktopContent]}
    >
      {children}
    </ScrollView>
  );
}
export function useCompact() {
  const { width, fontScale } = useWindowDimensions();
  return width < 370 || fontScale > 1.25;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background },
  frame: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    flex: 1,
    backgroundColor: c.background,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: { fontSize: 34, lineHeight: 36, fontWeight: '800', letterSpacing: -1.9, color: '#0d3447' },
  notification: {
    position: 'absolute',
    right: 1,
    top: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f13544',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: 'white',
  },
  navItem: { flex: 1, alignItems: 'center', gap: 6, minHeight: 54 },
  navIcon: { height: 30, justifyContent: 'center' },
  scanAction: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: c.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -17,
  },
  screen: { flex: 1, backgroundColor: c.background },
  content: { padding: 18, paddingTop: 12, paddingBottom: 26 },
  desktopContent: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 48,
  },
});
