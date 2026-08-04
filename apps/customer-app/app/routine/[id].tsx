import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Sparkles, CheckCircle2 } from 'lucide-react-native';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Step Details</Text>
          <Text className="text-ink-soft text-xs">Routine Item #{id || '1'}</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        <View className="bg-surface-elevated p-6 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center mb-3">
            <Sparkles size={20} color="#10B981" />
            <Text className="text-brand-primary font-bold text-sm ml-2">Active Step</Text>
          </View>
          <Text className="text-white text-2xl font-extrabold mb-2">0.5% Encapsulated Retinol Cream</Text>
          <Text className="text-ink-soft text-sm leading-6">
            Apply 1 pea-sized drop onto clean, dry face at night. Encourages cellular turnover and reduces fine lines while preserving barrier hydration.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg mt-4"
        >
          <CheckCircle2 size={20} color="#0D1F1C" />
          <Text className="text-surface font-extrabold text-base ml-2">Mark Step Completed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
