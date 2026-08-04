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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Scan History & Trends</Text>
          <Text className="text-ink-soft text-xs">Longitudinal skin biomarker analysis</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        {/* Line Chart */}
        <LineChart
          data={historyTrendData}
          title="Monthly Skin Health Progression"
          height={210}
          color="#6366F1"
        />

        <Text className="text-white font-bold text-lg mt-2">Past Scans</Text>

        <View className="gap-3">
          {pastScans.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              onPress={() => router.push(`/scan-report/${scan.id}`)}
              className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-brand-primary/20 rounded-xl items-center justify-center mr-3">
                  <Calendar size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{scan.date}</Text>
                  <Text className="text-ink-soft text-xs">ID: {scan.id}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="items-end mr-3">
                  <Text className="text-success-light font-extrabold text-base">{scan.score}/100</Text>
                  <Text className="text-ink-soft text-xs">{scan.status}</Text>
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
