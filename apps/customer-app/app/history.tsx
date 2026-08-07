import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronRight, TrendingUp } from 'lucide-react-native';
import { LineChart } from '../src/components/charts';
import { Badge } from '../src/components/ui';

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
      {/* Header */}
      <View className="px-6 pt-10 lg:pt-6 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#1F7FC4" />
            </TouchableOpacity>
            <View>
              <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Scan History & Trends</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Longitudinal skin biomarker analysis</Text>
            </View>
          </View>
          <Badge label="+9% Monthly Growth" variant="success" />
        </View>
      </View>

      {/* Desktop 2-Column Split View */}
      <View className="p-6 max-w-7xl mx-auto w-full">
        <View className="flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column (2/3 width on Desktop): Line Chart & Trends */}
          <View className="flex-1 w-full gap-6">
            <LineChart
              data={historyTrendData}
              title="Monthly Skin Health Progression"
              height={280}
              color="#1F7FC4"
            />

            <View className="bg-sky-500/10 dark:bg-sky-500/20 p-5 rounded-3xl border border-sky-500/30 flex-row items-center shadow-sm">
              <TrendingUp size={24} color="#1F7FC4" className="mr-4 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-extrabold text-base">Consistent Positive Trajectory</Text>
                <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-5">
                  Your hydration index and stratum corneum barrier score have consistently improved over 5 consecutive weeks.
                </Text>
              </View>
            </View>
          </View>

          {/* Right Column (1/3 width on Desktop): Past Scans List */}
          <View className="w-full lg:w-96 gap-4">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg">Past Scan Records</Text>

            <View className="gap-3">
              {pastScans.map((scan) => (
                <TouchableOpacity
                  key={scan.id}
                  onPress={() => router.push(`/scan-report/${scan.id}`)}
                  className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between hover:border-brand-primary/40 transition-all shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-3.5 border border-sky-500/30">
                      <Calendar size={22} color="#1F7FC4" />
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-bold text-base">{scan.date}</Text>
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">ID: {scan.id}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <View className="items-end mr-3">
                      <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">{scan.score}/100</Text>
                      <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{scan.status}</Text>
                    </View>
                    <ChevronRight size={20} color="#64748B" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
