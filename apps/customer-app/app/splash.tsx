import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded, isHydrated } = useAuthStore();

  useEffect(() => {
    // Wait for Zustand session rehydration before navigating
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (!isOnboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/login');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, isHydrated]);

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16] items-center justify-center px-6">
      <View className="w-20 h-20 bg-sky-500/10 dark:bg-sky-500/20 rounded-3xl items-center justify-center mb-6 border border-sky-500/30">
        <Shield size={44} color="#1F7FC4" />
      </View>

      <Text className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mb-2">Medivo</Text>
      <Text className="text-brand-primary text-sm font-bold uppercase tracking-widest mb-8">Clinical AI Skin Intelligence</Text>

      <ActivityIndicator size="large" color="#1F7FC4" className="mt-4" />
      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-4">Restoring Encrypted Telemetry Session...</Text>
    </View>
  );
}
