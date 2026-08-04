import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Sparkles, Camera, ShoppingBag, User, ShieldCheck, Activity, MessageSquare } from 'lucide-react-native';

export const WebSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: Home, route: '/(tabs)' },
    { label: 'Routines', icon: Sparkles, route: '/(tabs)/routines' },
    { label: 'AI Scan', icon: Camera, route: '/(tabs)/scan' },
    { label: 'Marketplace', icon: ShoppingBag, route: '/(tabs)/products' },
    { label: 'Profile', icon: User, route: '/(tabs)/profile' },
    { label: 'AI Coach', icon: MessageSquare, route: '/coach' },
  ];

  return (
    <View className="hidden lg:flex w-64 bg-surface-elevated border-r border-[#2A4A43] h-full p-6 justify-between">
      {/* Brand Header */}
      <View>
        <View className="flex-row items-center mb-8">
          <View className="w-10 h-10 bg-brand-primary rounded-xl items-center justify-center mr-3 shadow-lg">
            <Activity size={22} color="#0D1F1C" />
          </View>
          <View>
            <Text className="text-white font-extrabold text-xl tracking-tight">MEDIVO</Text>
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
                    : 'bg-transparent border-transparent active:bg-[#1C3833]'
                }`}
              >
                <IconComponent size={20} color={isActive ? '#10B981' : '#64748B'} />
                <Text
                  className={`text-sm font-semibold ml-3 ${
                    isActive ? 'text-brand-primary font-bold' : 'text-white'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Footer Security Badge */}
      <View className="bg-[#1C3833] p-4 rounded-xl border border-[#2A4A43] flex-row items-center">
        <ShieldCheck size={18} color="#10B981" className="mr-2" />
        <View>
          <Text className="text-white text-xs font-bold">HIPAA Secure</Text>
          <Text className="text-ink-soft text-[10px]">AES-256 Encrypted</Text>
        </View>
      </View>
    </View>
  );
};
