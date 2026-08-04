import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, Bell, CreditCard, History, LogOut, ChevronRight, Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, setMode } = useTheme();

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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header */}
      <View className="px-6 pt-14 pb-8 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] items-center shadow-sm">
        <View className="w-24 h-24 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center mb-3 border-2 border-brand-primary">
          <Text className="text-brand-primary text-3xl font-extrabold">AM</Text>
        </View>
        <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Alex Morgan</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">alex.morgan@medivo.health</Text>
        <View className="mt-3 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/30">
          <Text className="text-brand-primary font-bold text-xs">Premium Health Member</Text>
        </View>
      </View>

      {/* Single Theme Toggle Control */}
      <View className="px-6 pt-6 max-w-4xl mx-auto w-full">
        <Text className="text-slate-900 dark:text-white font-bold text-sm mb-3">Appearance Theme</Text>
        <TouchableOpacity
          onPress={handleCycleTheme}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mr-3 border border-sky-500/30">
              <ThemeIcon size={20} color="#1F7FC4" />
            </View>
            <View>
              <Text className="text-slate-900 dark:text-white font-bold text-base capitalize">{mode} Mode</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                {mode === 'system' ? 'Syncs with system settings' : `Active ${mode} theme`}
              </Text>
            </View>
          </View>

          <View className="bg-sky-500/10 dark:bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-500/30">
            <Text className="text-brand-primary font-bold text-xs">Cycle Theme ↻</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Settings Menu List */}
      <View className="px-6 pt-4 gap-3 max-w-4xl mx-auto w-full">
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <User size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Edit Profile</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/history')}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <History size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Scan & Analysis History</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/payments')}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <CreditCard size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Payment Methods</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <Bell size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Notifications</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/privacy-policy')}
          className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
        >
          <View className="flex-row items-center">
            <Shield size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Privacy & HIPAA Security</Text>
          </View>
          <ChevronRight size={18} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex-row items-center justify-between mt-4"
        >
          <View className="flex-row items-center">
            <LogOut size={20} color="#DC2626" />
            <Text className="text-red-600 dark:text-red-400 font-bold text-base ml-3">Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
