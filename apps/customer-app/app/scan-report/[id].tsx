import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react-native';

export default function ScanReportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Scan Analysis Report</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">ID: {id || 'rep_1092'}</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-4xl mx-auto w-full">
        {/* Score Header */}
        <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-[#374151] items-center shadow-sm">
          <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Overall Skin Health</Text>
          <Text className="text-emerald-600 dark:text-emerald-400 text-5xl font-extrabold my-1">87<Text className="text-slate-500 dark:text-slate-400 text-lg font-normal">/100</Text></Text>
          <Text className="text-slate-900 dark:text-white font-semibold text-sm mt-1">Barrier Function: Optimal</Text>
        </View>

        {/* Biomarker Breakdowns */}
        <Text className="text-slate-900 dark:text-white font-bold text-lg mt-2">Biomarker Findings</Text>

        <View className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 dark:text-white font-semibold text-sm">Hydration Index</Text>
            <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">92%</Text>
          </View>
          <View className="w-full h-2 bg-slate-200 dark:bg-[#1F2937] rounded-full overflow-hidden">
            <View className="w-[92%] h-full bg-emerald-500 rounded-full" />
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 dark:text-white font-semibold text-sm">Texture Smoothness</Text>
            <Text className="text-brand-primary font-bold text-sm">85%</Text>
          </View>
          <View className="w-full h-2 bg-slate-200 dark:bg-[#1F2937] rounded-full overflow-hidden">
            <View className="w-[85%] h-full bg-brand-primary rounded-full" />
          </View>
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 dark:text-white font-semibold text-sm">Pigmentation Uniformity</Text>
            <Text className="text-amber-600 dark:text-amber-400 font-bold text-sm">78%</Text>
          </View>
          <View className="w-full h-2 bg-slate-200 dark:bg-[#1F2937] rounded-full overflow-hidden">
            <View className="w-[78%] h-full bg-amber-500 rounded-full" />
          </View>
        </View>

        {/* Medical Disclaimer */}
        <View className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex-row items-start mt-2">
          <ShieldAlert size={18} color="#D97706" className="mt-0.5 mr-3" />
          <Text className="text-amber-800 dark:text-amber-200 text-xs flex-1 leading-5">
            Disclaimer: This AI analysis is intended for wellness and skincare optimization only. It does not constitute a formal medical diagnosis.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
