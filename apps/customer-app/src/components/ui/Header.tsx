import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ShoppingBag, Search, ShieldCheck } from 'lucide-react-native';
import { CommandPalette } from './CommandPalette';
import { useAuthStore } from '../../store/useAuthStore';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'Welcome Back',
  showActions = true,
  cartCount = 2,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const displayName = title || user?.name || 'Patient';
  const skinScore = user?.score || 87;

  // Generate dynamic user avatar initials
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('') || 'PT';

  return (
    <>
      <View className="px-4 sm:px-6 pt-10 lg:pt-6 pb-4 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
          
          {/* Left Column: Patient Avatar & Greeting */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            className="flex-row items-center active:opacity-80"
          >
            <View className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center border-2 border-brand-primary mr-3 shadow-sm">
              <Text className="text-brand-primary font-black text-xs sm:text-sm">{initials}</Text>
            </View>
            <View>
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-semibold">{subtitle}</Text>
              <Text className="text-slate-900 dark:text-white text-base sm:text-lg font-extrabold tracking-tight" numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Center Column: Desktop Command Palette Trigger */}
          <TouchableOpacity
            onPress={() => setPaletteOpen(true)}
            className="hidden md:flex flex-1 max-w-sm mx-6 flex-row items-center justify-between bg-white dark:bg-[#192231] px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm active:border-brand-primary"
          >
            <View className="flex-row items-center flex-1 mr-2">
              <Search size={16} color="#1F7FC4" className="mr-2" />
              <Text className="text-slate-400 text-xs font-normal">Search features, scans, doctors...</Text>
            </View>
            <View className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold">⌘K</Text>
            </View>
          </TouchableOpacity>

          {/* Right Column: Actions & Active Health Status Pill */}
          {showActions && (
            <View className="flex-row items-center gap-2 sm:gap-3">
              
              {/* Meaningful Health Index Status Pill */}
              <View className="hidden lg:flex flex-row items-center bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <ShieldCheck size={14} color="#059669" className="mr-1.5" />
                <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-extrabold">
                  Skin Index: {skinScore}/100 • Optimal
                </Text>
              </View>

              {/* Mobile Search Button */}
              <TouchableOpacity
                onPress={() => setPaletteOpen(true)}
                className="flex md:hidden w-10 h-10 bg-white dark:bg-[#192231] rounded-2xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Search size={18} color="#1F7FC4" />
              </TouchableOpacity>

              {/* Notifications Button */}
              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                className="w-10 h-10 bg-white dark:bg-[#192231] rounded-2xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Bell size={18} color="#1F7FC4" />
              </TouchableOpacity>

              {/* Cart Button */}
              <TouchableOpacity
                onPress={() => router.push('/cart')}
                className="w-10 h-10 bg-white dark:bg-[#192231] rounded-2xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm relative active:bg-slate-100 dark:active:bg-slate-800"
              >
                <ShoppingBag size={18} color="#1F7FC4" />
                {cartCount > 0 && (
                  <View className="w-4.5 h-4.5 bg-brand-primary rounded-full items-center justify-center absolute -top-1 -right-1 border border-white dark:border-[#111827]">
                    <Text className="text-white font-extrabold text-[9px]">{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Command Palette Modal */}
      <CommandPalette visible={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
};
