import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Shield, Bell, CreditCard, History, LogOut, ChevronRight, Sun, Moon, Monitor, ShieldCheck, Sparkles, Activity, Mail } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Badge } from '../../src/components/ui';

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

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-6 gap-6 max-w-4xl mx-auto w-full">
        
        {/* Page Title & Subtitle Banner (Avoiding duplicate user name display) */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
              Account & Profile Settings
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Manage your dermal baseline, appearance theme, and confidential health settings
            </Text>
          </View>
          <Badge label="HIPAA Compliant" variant="success" className="hidden sm:flex" />
        </View>

        {/* Dermal Baseline & Clinical Account Card */}
        <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <View className="flex-row items-center">
              <Sparkles size={20} color="#1F7FC4" className="mr-2" />
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">Clinical Dermal Baseline</Text>
            </View>
            <Badge label="Verified Patient" variant="success" />
          </View>

          <View className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <View className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151]">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Registered Email</Text>
              <View className="flex-row items-center">
                <Mail size={16} color="#1F7FC4" className="mr-2" />
                <Text className="text-slate-900 dark:text-white font-bold text-sm" numberOfLines={1}>{user?.email || 'Authenticated Session'}</Text>
              </View>
            </View>

            <View className="bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151]">
              <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Skin Type Classification</Text>
              <View className="flex-row items-center">
                <Activity size={16} color="#059669" className="mr-2" />
                <Text className="text-slate-900 dark:text-white font-bold text-sm">{user?.skinType || 'Combination'} Skin Barrier</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Appearance Theme Switcher Control */}
        <View>
          <Text className="text-slate-900 dark:text-white font-extrabold text-sm mb-3">Appearance Theme</Text>
          <TouchableOpacity
            onPress={handleCycleTheme}
            className="bg-slate-50 dark:bg-[#111827] p-4.5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-3 border border-sky-500/30">
                <ThemeIcon size={20} color="#1F7FC4" />
              </View>
              <View>
                <Text className="text-slate-900 dark:text-white font-bold text-base capitalize">{mode} Mode</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                  {mode === 'system' ? 'Syncs automatically with system preferences' : `Active ${mode} appearance`}
                </Text>
              </View>
            </View>

            <View className="bg-sky-500/10 dark:bg-sky-500/20 px-3.5 py-1.5 rounded-xl border border-sky-500/30">
              <Text className="text-brand-primary font-bold text-xs">Switch Theme ↻</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Management Actions */}
        <View className="gap-3">
          <Text className="text-slate-900 dark:text-white font-extrabold text-sm mb-1">Account & Preferences</Text>

          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <User size={20} color="#1F7FC4" />
              <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Edit Personal Details</Text>
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
              <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Payment Methods & HSA</Text>
            </View>
            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <Bell size={20} color="#1F7FC4" />
              <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Notifications Center</Text>
            </View>
            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/privacy-policy')}
            className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <Shield size={20} color="#1F7FC4" />
              <Text className="text-slate-900 dark:text-white font-semibold text-base ml-3">Privacy Policy & Patient Rights</Text>
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

      </View>
    </ScrollView>
  );
}
