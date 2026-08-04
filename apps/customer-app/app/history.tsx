import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react-native';
import { LineChart } from '../src/components/charts';

export default function HistoryScreen() {
  const router = useRouter();

  const historyTrendData = [
    { x: 'Week 1', y: 78 },
    { x: 'Week 2', y: 81 },
    { x: 'Week 3', y: 80 },
    { x: 'Week 4', y: 85 },
    { x: 'Week 5', y: 87 },
  ];

  const pastScans = [
    { id: 'rep_1092', date: 'Aug 04, 2026', score: 87, status: 'Optimal' },
    { id: 'rep_1081', date: 'Jul 28, 2026', score: 85, status: 'Optimal' },
    { id: 'rep_1070', date: 'Jul 21, 2026', score: 80, status: 'Improving' },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Scan History & Trends</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Longitudinal skin biomarker analysis</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-7xl mx-auto w-full">
        {/* Line Chart */}
        <LineChart
          data={historyTrendData}
          title="Monthly Skin Health Progression"
          height={210}
          color="#1F7FC4"
        />

        <Text className="text-slate-900 dark:text-white font-bold text-lg mt-2">Past Scans</Text>

        <View className="gap-3">
          {pastScans.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              onPress={() => router.push(`/scan-report/${scan.id}`)}
              className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mr-3 border border-sky-500/30">
                  <Calendar size={20} color="#1F7FC4" />
                </View>
                <View>
                  <Text className="text-slate-900 dark:text-white font-bold text-base">{scan.date}</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">ID: {scan.id}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="items-end mr-3">
                  <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">{scan.score}/100</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">{scan.status}</Text>
                </View>
                <ChevronRight size={18} color="#64748B" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
