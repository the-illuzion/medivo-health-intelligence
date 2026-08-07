import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Step Details</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Routine Item #{id || '1'}</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-4xl mx-auto w-full">
        <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center mb-3">
            <Sparkles size={20} color="#1F7FC4" />
            <Text className="text-brand-primary font-bold text-sm ml-2">Active Step</Text>
          </View>
          <Text className="text-slate-900 dark:text-white text-2xl font-extrabold mb-2">0.5% Encapsulated Retinol Cream</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
            Apply 1 pea-sized drop onto clean, dry face at night. Encourages cellular turnover and reduces fine lines while preserving barrier hydration.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-4"
        >
          <CheckCircle2 size={20} color="#FFFFFF" />
          <Text className="text-white font-extrabold text-base ml-2">Mark Step Completed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
