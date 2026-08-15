import React from 'react';
import { View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Sparkles, Camera, ShoppingBag, User, ShieldCheck, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

export const WebSidebar: React.FC = () => {
  if (Platform.OS !== 'web') return null;

  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();

  const navItems = [
    { label: 'Dashboard', icon: Home, route: '/(tabs)', match: (p: string) => p === '/' || p === '/(tabs)' },
    { label: 'Routines', icon: Sparkles, route: '/(tabs)/routines', match: (p: string) => p.includes('routine') },
    { label: 'AI Scan', icon: Camera, route: '/(tabs)/scan', match: (p: string) => p.includes('scan') },
    { label: 'Marketplace', icon: ShoppingBag, route: '/(tabs)/products', match: (p: string) => p.includes('product') || p.includes('cart') || p.includes('checkout') },
    { label: 'Profile', icon: User, route: '/(tabs)/profile', match: (p: string) => p.includes('profile') },
    { label: 'AI Coach', icon: MessageSquare, route: '/coach', match: (p: string) => p.includes('coach') },
  ];

  return (
    <View className="w-64 bg-slate-50 dark:bg-[#111827] border-r border-slate-200 dark:border-[#374151] h-full p-6 justify-between flex-shrink-0">
      {/* Company Favicon Brand Logo Header */}
      <View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          className="flex-row items-center mb-8 active:opacity-80"
        >
          <View className="w-10 h-10 bg-white dark:bg-[#192231] rounded-2xl items-center justify-center mr-3 border border-slate-200 dark:border-slate-700 shadow-sm p-1.5">
            <Image
              source={require('../../../assets/favicon.png')}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-slate-900 dark:text-white font-black text-xl tracking-tight">Medivo</Text>
            <Text className="text-brand-primary font-extrabold text-[10px] uppercase tracking-widest">Health AI</Text>
          </View>
        </TouchableOpacity>

        {/* Navigation Items with Clean Background Highlight */}
        <View className="gap-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.match(pathname);

            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-sky-500/15 dark:bg-sky-500/25'
                    : 'bg-transparent active:bg-slate-200 dark:active:bg-slate-800'
                }`}
              >
                <IconComponent size={20} color={isActive ? '#1F7FC4' : isDark ? '#94A3B8' : '#64748B'} />
                <Text
                  className={`text-sm ml-3.5 ${
                    isActive ? 'text-brand-primary font-extrabold' : 'text-slate-700 dark:text-slate-300 font-semibold'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Security Vault Footer */}
      <View className="bg-white dark:bg-[#1F2937] p-3.5 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <ShieldCheck size={18} color="#059669" className="mr-3 flex-shrink-0" />
        <View>
          <Text className="text-slate-900 dark:text-white text-xs font-extrabold">HIPAA Vault Active</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-[10px]">AES-256 Encrypted</Text>
        </View>
      </View>
    </View>
  );
};
