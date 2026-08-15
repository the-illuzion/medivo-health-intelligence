import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ShoppingBag, Search, ShieldCheck } from 'lucide-react-native';
import { CommandPalette } from './CommandPalette';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { apiClient } from '@medivo/api-client';

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
  const { user, token, isHydrated } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const displayName = title || user?.name || 'Patient';

  // Generate dynamic user avatar initials
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('') || 'PT';

  // Desktop Keyboard Shortcut (⌘K / Ctrl+K) Listener
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch reactive unread notification count on mount & rehydration
  useEffect(() => {
    if (!isHydrated || !token) return;
    apiClient.setAuthToken(token);
    fetchNotifications();
  }, [isHydrated, token, fetchNotifications]);

  return (
    <>
      <View className="px-4 sm:px-6 pt-10 lg:pt-6 pb-3.5 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
          
          {/* Left Column: Patient Avatar & Greeting */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            className="flex-row items-center flex-1 min-w-0 pr-2 active:opacity-80"
          >
            <View className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center border border-brand-primary/60 mr-2.5 shadow-sm">
              <Text className="text-brand-primary font-extrabold text-xs sm:text-sm">{initials}</Text>
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                {subtitle}
              </Text>
              <Text
                className="text-slate-900 dark:text-white text-sm sm:text-base font-extrabold tracking-tight leading-tight"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayName}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Center Column: Desktop Command Palette Trigger */}
          <TouchableOpacity
            onPress={() => setPaletteOpen(true)}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4 flex-row items-center justify-between bg-white dark:bg-[#192231] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm active:border-brand-primary"
          >
            <View className="flex-row items-center flex-1 mr-2">
              <Search size={15} color="#1F7FC4" className="mr-2" />
              <Text className="text-slate-400 text-xs font-medium">Search commands, scans, doctors...</Text>
            </View>
            <View className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold">⌘K</Text>
            </View>
          </TouchableOpacity>

          {/* Right Column: Actions & HIPAA Encrypted Status Badge */}
          {showActions && (
            <View className="flex-row items-center gap-2 sm:gap-2.5">
              
              {/* HIPAA Encrypted Vault Status Badge */}
              <View className="hidden lg:flex flex-row items-center bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 mr-1">
                <ShieldCheck size={13} color="#059669" className="mr-1" />
                <Text className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                  HIPAA Encrypted
                </Text>
              </View>

              {/* Mobile Search Button */}
              <TouchableOpacity
                onPress={() => setPaletteOpen(true)}
                className="flex md:hidden w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#192231] rounded-xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Search size={17} color="#1F7FC4" />
              </TouchableOpacity>

              {/* Notifications Button with Dynamic Unread Badge Pill */}
              <TouchableOpacity
                onPress={() => router.push('/notifications')}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#192231] rounded-xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm relative z-10 active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Bell size={18} color="#1F7FC4" />
                {unreadCount > 0 && (
                  <View
                    style={{ position: 'absolute', top: -4, right: -4, zIndex: 30 }}
                    className="min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full items-center justify-center border-2 border-white dark:border-[#111827] shadow-sm"
                  >
                    <Text className="text-white font-extrabold text-[10px] text-center leading-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Cart Button */}
              <TouchableOpacity
                onPress={() => router.push('/cart')}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#192231] rounded-xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm relative active:bg-slate-100 dark:active:bg-slate-800"
              >
                <ShoppingBag size={17} color="#1F7FC4" />
                {cartCount > 0 && (
                  <View className="w-4 h-4 bg-brand-primary rounded-full items-center justify-center absolute -top-1 -right-1 border border-white dark:border-[#111827]">
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
