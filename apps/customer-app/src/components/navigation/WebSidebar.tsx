import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Sparkles, Camera, ShoppingBag, User, ShieldCheck, Activity, MessageSquare, Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

export const WebSidebar: React.FC = () => {
  if (Platform.OS !== 'web') return null;

  const router = useRouter();
  const pathname = usePathname();
  const { mode, setMode, isDark } = useTheme();

  const navItems = [
    { label: 'Dashboard', icon: Home, route: '/(tabs)' },
    { label: 'Routines', icon: Sparkles, route: '/(tabs)/routines' },
    { label: 'AI Scan', icon: Camera, route: '/(tabs)/scan' },
    { label: 'Marketplace', icon: ShoppingBag, route: '/(tabs)/products' },
    { label: 'Profile', icon: User, route: '/(tabs)/profile' },
    { label: 'AI Coach', icon: MessageSquare, route: '/coach' },
  ];

  const handleCycleTheme = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  const getThemeIcon = () => {
    if (mode === 'light') return Sun;
    if (mode === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <View className="hidden lg:flex w-64 bg-slate-50 dark:bg-[#111827] border-r border-slate-200 dark:border-[#374151] h-full p-6 justify-between">
      {/* Brand Header */}
      <View>
        <View className="flex-row items-center mb-8">
          <View className="w-10 h-10 bg-brand-primary rounded-xl items-center justify-center mr-3 shadow-md">
            <Activity size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">MEDIVO</Text>
            <Text className="text-brand-primary font-bold text-[10px] uppercase tracking-widest">Health AI</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <View className="gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.route || (item.route === '/(tabs)' && pathname === '/');

            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center px-4 py-3 rounded-xl border ${
                  isActive
                    ? 'bg-brand-primary/10 border-brand-primary/40'
                    : 'bg-transparent border-transparent active:bg-slate-200 dark:active:bg-slate-800'
                }`}
              >
                <IconComponent size={20} color={isActive ? '#1F7FC4' : isDark ? '#94A3B8' : '#64748B'} />
                <Text
                  className={`text-sm font-semibold ml-3 ${
                    isActive ? 'text-brand-primary font-bold' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Single Theme Toggle & Security Footer */}
      <View className="gap-3">
        <TouchableOpacity
          onPress={handleCycleTheme}
          className="bg-white dark:bg-[#1F2937] p-3 rounded-xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <ThemeIcon size={16} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white text-xs font-bold ml-2.5 capitalize">
              Theme: {mode}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="bg-white dark:bg-[#1F2937] p-3 rounded-xl border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
          <ShieldCheck size={16} color="#1F7FC4" className="mr-2" />
          <View>
            <Text className="text-slate-900 dark:text-white text-xs font-bold">HIPAA Secure</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[10px]">AES-256 Encrypted</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
