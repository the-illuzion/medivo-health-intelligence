import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors as c, designRoutes } from '../tokens';
import { usePreview } from '../PreviewContext';
import { Avatar } from './Illustrations';
import { Copy, Icon, IconButton, s } from './UI';

const items = [
  { name: 'Home', path: designRoutes.home, icon: 'home' },
  { name: 'Insights', path: designRoutes.metrics, icon: 'chart' },
  { name: 'Scan', path: designRoutes.scan, icon: 'plus' },
  { name: 'Care', path: designRoutes.care, icon: 'heart' },
  { name: 'Profile', path: designRoutes.profile, icon: 'user' },
] as const;

export function DesktopFrame({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { sheet, openDetail } = usePreview();
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <View
        style={st.sidebar}
        accessibilityElementsHidden={!!sheet}
        importantForAccessibility={sheet ? 'no-hide-descendants' : 'auto'}
      >
        <View style={st.brand}>
          <Text style={st.logo}>medivo</Text>
          <Copy size={10} color={c.muted}>
            Health Intelligence for a Better You
          </Copy>
        </View>
        <View accessibilityRole="tablist" style={st.nav}>
          {items.map((item) => {
            const active = path === item.path;
            return (
              <Pressable
                key={item.name}
                accessibilityRole="tab"
                accessibilityLabel={item.name}
                accessibilityState={{ selected: active }}
                aria-selected={active}
                onPress={() => router.navigate(item.path)}
                style={[st.navItem, active && st.navItemActive]}
              >
                <View style={item.name === 'Scan' ? st.scanIcon : undefined}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.name === 'Scan' ? 'white' : active ? c.blue : c.muted}
                  />
                </View>
                <Copy size={13} bold={active} color={active ? c.blue : '#42536a'}>
                  {item.name}
                </Copy>
              </Pressable>
            );
          })}
        </View>
        <View style={st.sidebarFooter}>
          <Copy size={11} bold>
            Your health, in one place
          </Copy>
          <Copy size={10} color={c.muted}>
            Medivo Health Intelligence
          </Copy>
        </View>
      </View>
      <View style={s.flex}>
        <View
          style={st.topbar}
          accessibilityElementsHidden={!!sheet}
          importantForAccessibility={sheet ? 'no-hide-descendants' : 'auto'}
        >
          <View style={s.flex}><Copy size={13} bold>Health Intelligence</Copy><Copy size={10} color={c.muted}>A little more clarity, every day</Copy></View>
          <View style={st.notice}>
            <IconButton
              name="bell"
              label="Notifications"
              onPress={() => openDetail('Notifications')}
            />
            <View style={st.badge}>
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
        <View style={[s.flex, { backgroundColor: c.background }]}>{children}</View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#eef3f8' },
  sidebar: {
    width: 224,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: c.border,
    padding: 22,
    paddingTop: 24,
  },
  brand: { gap: 2 },
  logo: { color: '#0d3447', fontSize: 34, lineHeight: 37, fontWeight: '800', letterSpacing: -1.9 },
  nav: { marginTop: 42, gap: 7 },
  navItem: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  navItemActive: { backgroundColor: '#e9f2ff' },
  scanIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.blue,
  },
  sidebarFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: c.border,
    paddingTop: 18,
    gap: 3,
  },
  topbar: {
    height: 70,
    paddingHorizontal: 38,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notice: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 1,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#f13544',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
