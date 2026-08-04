import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react-native';

export default function ScanReportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Scan Analysis Report</Text>
          <Text className="text-ink-soft text-xs">ID: {id || 'rep_1092'}</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        {/* Score Header */}
        <View className="bg-surface-elevated p-6 rounded-2xl border border-[#2A4A43] items-center">
          <Text className="text-ink-soft text-xs font-semibold uppercase tracking-wider mb-1">Overall Skin Health</Text>
          <Text className="text-success-light text-5xl font-extrabold my-1">87<Text className="text-ink-soft text-lg font-normal">/100</Text></Text>
          <Text className="text-white font-medium text-sm mt-1">Barrier Function: Optimal</Text>
        </View>

        {/* Biomarker Breakdowns */}
        <Text className="text-white font-bold text-lg mt-2">Biomarker Findings</Text>

        <View className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-semibold text-sm">Hydration Index</Text>
            <Text className="text-success-light font-bold text-sm">92%</Text>
          </View>
          <View className="w-full h-2 bg-[#1C3833] rounded-full overflow-hidden">
            <View className="w-[92%] h-full bg-success rounded-full" />
          </View>
        </View>

        <View className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-semibold text-sm">Texture Smoothness</Text>
            <Text className="text-brand-primary font-bold text-sm">85%</Text>
          </View>
          <View className="w-full h-2 bg-[#1C3833] rounded-full overflow-hidden">
            <View className="w-[85%] h-full bg-brand-primary rounded-full" />
          </View>
        </View>

        <View className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-semibold text-sm">Pigmentation Uniformity</Text>
            <Text className="text-warning font-bold text-sm">78%</Text>
          </View>
          <View className="w-full h-2 bg-[#1C3833] rounded-full overflow-hidden">
            <View className="w-[78%] h-full bg-warning rounded-full" />
          </View>
        </View>

        {/* Medical Disclaimer */}
        <View className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex-row items-start mt-2">
          <ShieldAlert size={18} color="#F59E0B" className="mt-0.5 mr-3" />
          <Text className="text-amber-200 text-xs flex-1 leading-5">
            Disclaimer: This AI analysis is intended for wellness and skincare optimization only. It does not constitute a formal medical diagnosis.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
