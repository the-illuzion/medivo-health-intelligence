import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Default to tab dashboard route
      router.replace('/(tabs)');
    }, 600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-surface items-center justify-center p-6">
      <View className="w-20 h-20 bg-brand-primary/20 rounded-full items-center justify-center mb-6">
        <Text className="text-brand-primary text-3xl font-bold">M</Text>
      </View>
      <Text className="text-white text-2xl font-extrabold mb-2 tracking-tight">
        MEDIVO
      </Text>
      <Text className="text-ink-soft text-sm mb-8 text-center">
        AI Health Intelligence Platform
      </Text>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
