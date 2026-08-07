import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Sparkles, Camera, ShoppingBag, User } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  if (isDesktop) return null;

  // Calculate maximum floating width for mobile/tablet
  const floatingWidth = Math.min(width - 32, 480);

  return (
    <View
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 16,
        left: 0,
        right: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          width: floatingWidth,
          height: 68,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.45 : 0.12,
          shadowRadius: 20,
        }}
        className="bg-white dark:bg-[#111827] rounded-[34px] border border-slate-200 dark:border-[#1F2937] flex-row items-center justify-around px-2"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isScan = route.name === 'scan';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              className="items-center justify-center flex-1 py-1"
            >
              {isScan ? (
                <View className={`w-11 h-11 rounded-full items-center justify-center shadow-md ${isFocused ? 'bg-brand-primary scale-105' : 'bg-brand-primary/90'}`}>
                  <Camera size={22} color="#FFFFFF" />
                </View>
              ) : (
                <View className={`items-center justify-center p-1 rounded-xl ${isFocused ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`}>
                  {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: isFocused ? '#1F7FC4' : isDark ? '#94A3B8' : '#64748B', size: 20 })}
                </View>
              )}

              <Text
                className={`text-[10px] font-bold mt-1 ${
                  isFocused ? 'text-brand-primary font-extrabold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]" style={{ flex: 1, height: '100%' }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
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
            tabBarIcon: ({ color, size }) => <Camera size={size} color={color} />,
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
  );
}
