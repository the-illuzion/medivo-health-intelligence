import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, Bell, CreditCard, History, LogOut, ChevronRight, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, setMode } = useTheme();
  const { user, logout } = useAuthStore();

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

  const displayName = user?.name || 'Patient';
  const nameParts = displayName.split(' ');
  const initials = nameParts.map((p) => p[0]).join('').substring(0, 2).toUpperCase() || 'PT';

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Profile Info Banner */}
      <View className="px-6 pt-6 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] items-center shadow-sm">
        <View className="w-20 h-20 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center mb-3 border-2 border-brand-primary">
          <Text className="text-brand-primary text-2xl font-black">{initials}</Text>
        </View>
        <Text className="text-slate-900 dark:text-white text-xl sm:text-2xl font-extrabold">{displayName}</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">{user?.email || ''}</Text>
        <View className="mt-3 bg-emerald-500/10 dark:bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex-row items-center gap-1.5">
          <ShieldCheck size={14} color="#059669" />
          <Text className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
            Verified Patient • {user?.skinType || 'Combination'} Profile
          </Text>
        </View>
      </View>

      {/* Theme Toggle Control */}
      <View className="px-6 pt-6 max-w-4xl mx-auto w-full">
        <Text className="text-slate-900 dark:text-white font-extrabold text-sm mb-3">Appearance Theme</Text>
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
          onPress={handleSignOut}
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
