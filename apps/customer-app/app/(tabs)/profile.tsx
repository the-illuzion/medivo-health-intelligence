import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, Bell, CreditCard, History, LogOut, ChevronRight, Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeMode } from '@medivo/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, setMode } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header */}
      <View className="px-6 pt-14 pb-8 bg-surface-elevated border-b border-[#2A4A43] items-center">
        <View className="w-24 h-24 bg-brand-primary/20 rounded-full items-center justify-center mb-3 border-2 border-brand-primary">
          <Text className="text-brand-primary text-3xl font-extrabold">AM</Text>
        </View>
        <Text className="text-white text-2xl font-extrabold">Alex Morgan</Text>
        <Text className="text-ink-soft text-sm mt-0.5">alex.morgan@medivo.health</Text>
        <View className="mt-3 bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/30">
          <Text className="text-brand-primary font-semibold text-xs">Premium Health Member</Text>
        </View>
      </View>

      {/* Theme Preference Segmented Control */}
      <View className="px-6 pt-6">
        <Text className="text-white font-bold text-sm mb-3">Appearance Theme</Text>
        <View className="flex-row bg-surface-elevated p-1.5 rounded-2xl border border-[#2A4A43] gap-2">
          {themeOptions.map((opt) => {
            const IconComponent = opt.icon;
            const isSelected = mode === opt.mode;

            return (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => setMode(opt.mode)}
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${
                  isSelected
                    ? 'bg-brand-primary border-brand-primary'
                    : 'bg-transparent border-transparent active:bg-[#1C3833]'
                }`}
              >
                <IconComponent size={16} color={isSelected ? '#0D1F1C' : '#94A3B8'} />
                <Text
                  className={`text-xs font-bold ml-2 ${
                    isSelected ? 'text-surface' : 'text-ink-soft'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Settings Menu List */}
      <View className="px-6 pt-4 gap-3">
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <User size={20} color="#10B981" />
            <Text className="text-white font-medium text-base ml-3">Edit Profile</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/history')}
          className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <History size={20} color="#10B981" />
            <Text className="text-white font-medium text-base ml-3">Scan & Analysis History</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/payments')}
          className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <CreditCard size={20} color="#10B981" />
            <Text className="text-white font-medium text-base ml-3">Payment Methods</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Bell size={20} color="#10B981" />
            <Text className="text-white font-medium text-base ml-3">Notifications</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/privacy-policy')}
          className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Shield size={20} color="#10B981" />
            <Text className="text-white font-medium text-base ml-3">Privacy & HIPAA Security</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex-row items-center justify-between mt-4"
        >
          <View className="flex-row items-center">
            <LogOut size={20} color="#EF4444" />
            <Text className="text-red-400 font-bold text-base ml-3">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
