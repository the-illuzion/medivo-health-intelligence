import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, useWindowDimensions } from 'react-native';
import { Home, Sparkles, Camera, ShoppingBag, User } from 'lucide-react-native';
import { WebSidebar } from '../../src/components/navigation/WebSidebar';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View className="flex-1 flex-row bg-white dark:bg-[#090D16]" style={{ flex: 1, height: '100%' }}>
      {/* Web Sidebar navigation (visible ONLY on Desktop >= 1024px) */}
      <WebSidebar />

      {/* Main App Screens Container */}
      <View className="flex-1 h-full" style={{ flex: 1, height: '100%' }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#1F7FC4',
            tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
            tabBarStyle: {
              display: isDesktop ? 'none' : 'flex',
              backgroundColor: isDark ? '#111827' : '#F8FAFC',
              borderTopColor: isDark ? '#374151' : '#E2E8F0',
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 88 : 64,
              paddingBottom: Platform.OS === 'ios' ? 28 : 10,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="routines"
            options={{
              title: 'Routines',
              tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan',
              tabBarIcon: ({ color, size }) => <Camera size={size + 4} color={color} />,
            }}
          />
          <Tabs.Screen
            name="products"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
