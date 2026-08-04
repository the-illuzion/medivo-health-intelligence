import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Camera, MessageSquare, ArrowRight, ShieldCheck, Activity } from 'lucide-react-native';
import { AreaChart } from '../../src/components/charts';

export default function DashboardScreen() {
  const router = useRouter();

  const skinScoreData = [
    { x: 'Mon', y: 82 },
    { x: 'Tue', y: 83 },
    { x: 'Wed', y: 81 },
    { x: 'Thu', y: 85 },
    { x: 'Fri', y: 84 },
    { x: 'Sat', y: 86 },
    { x: 'Sun', y: 87 },
  ];

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-surface-elevated rounded-b-3xl border-b border-[#2A4A43]">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-ink-soft text-sm font-medium">Welcome Back</Text>
            <Text className="text-white text-2xl font-extrabold tracking-tight">Alex Morgan</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            className="w-10 h-10 bg-[#1C3833] rounded-full items-center justify-center border border-[#2A4A43]"
          >
            <Activity size={20} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Hero Skin Score Card */}
        <View className="bg-[#1C3833] rounded-2xl p-5 border border-[#2A4A43] flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <View className="flex-row items-center mb-1">
              <ShieldCheck size={16} color="#10B981" />
              <Text className="text-success-light text-xs font-semibold ml-1">Optimal Skin Barrier</Text>
            </View>
            <Text className="text-white text-3xl font-extrabold">87<Text className="text-ink-soft text-lg font-normal">/100</Text></Text>
            <Text className="text-ink-soft text-xs mt-1">+3 pts from last week's scan</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/scan')}
            className="bg-brand-primary px-4 py-3 rounded-xl flex-row items-center shadow-lg"
          >
            <Camera size={18} color="#0D1F1C" />
            <Text className="text-surface font-bold text-sm ml-2">Scan Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-6 pt-6">
        {/* Quick Actions */}
        <Text className="text-white font-bold text-lg mb-3">Quick Actions</Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/coach')}
            className="flex-1 bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43]"
          >
            <View className="w-10 h-10 bg-accent/20 rounded-xl items-center justify-center mb-3">
              <MessageSquare size={20} color="#818CF8" />
            </View>
            <Text className="text-white font-bold text-sm mb-1">AI Health Coach</Text>
            <Text className="text-ink-soft text-xs">Chat 24/7 assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/consultations')}
            className="flex-1 bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43]"
          >
            <View className="w-10 h-10 bg-success/20 rounded-xl items-center justify-center mb-3">
              <Sparkles size={20} color="#34D399" />
            </View>
            <Text className="text-white font-bold text-sm mb-1">Consultation</Text>
            <Text className="text-ink-soft text-xs">Book Dermatologist</Text>
          </TouchableOpacity>
        </View>

        {/* Health Score Trend Chart */}
        <AreaChart
          data={skinScoreData}
          title="7-Day Skin Health Index"
          height={200}
          color="#10B981"
        />

        {/* Active Routine Teaser */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43] mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-base">Evening Barrier Regimen</Text>
            <Text className="text-success-light font-semibold text-xs bg-success/10 px-2.5 py-1 rounded-full">
              3/4 Done
            </Text>
          </View>
          <Text className="text-ink-soft text-xs mb-4">Hydrating Serum + Retinol + Niacinamide Repair Cream</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/routines')}
            className="flex-row items-center justify-between bg-[#1C3833] p-3 rounded-xl border border-[#2A4A43]"
          >
            <Text className="text-white font-medium text-xs">View Full Routine</Text>
            <ArrowRight size={16} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
