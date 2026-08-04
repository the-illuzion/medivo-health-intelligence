import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Camera, MessageSquare, ArrowRight, ShieldCheck, Droplet, Zap, Award } from 'lucide-react-native';
import { Header, ScoreRing, MetricCard, Button, Badge } from '../../src/components/ui';
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
      {/* Top Header */}
      <Header title="Alex Morgan" subtitle="Welcome Back" />

      {/* Main Container */}
      <View className="px-6 pt-6 gap-6">
        {/* Score Ring & Telemetry Hero Card */}
        <View className="bg-surface-elevated rounded-3xl p-6 border border-[#2A4A43] flex-col md:flex-row items-center justify-between shadow-xl">
          <View className="items-center md:items-start mb-4 md:mb-0">
            <Badge label="Optimal Skin Barrier" icon={<ShieldCheck size={12} color="#10B981" />} />
            <Text className="text-white text-3xl font-extrabold tracking-tight mt-3">
              Overall Skin Index
            </Text>
            <Text className="text-ink-soft text-xs mt-1">
              Neural biomarker analysis from recent scan
            </Text>

            <View className="flex-row items-center mt-4">
              <Button
                title="Scan Now"
                onPress={() => router.push('/(tabs)/scan')}
                icon={<Camera size={16} color="#0D1F1C" />}
                size="sm"
              />
            </View>
          </View>

          <ScoreRing score={87} label="Skin Health Score" sublabel="Optimal" size={130} />
        </View>

        {/* Quick Action Tiles */}
        <View>
          <Text className="text-white font-extrabold text-lg mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push('/coach')}
              className="flex-1 bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] active:bg-[#1C3833]"
            >
              <View className="w-10 h-10 bg-accent/20 rounded-xl items-center justify-center mb-3">
                <MessageSquare size={20} color="#818CF8" />
              </View>
              <Text className="text-white font-bold text-sm mb-0.5">AI Health Coach</Text>
              <Text className="text-ink-soft text-xs">24/7 AI skin guidance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/consultations')}
              className="flex-1 bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] active:bg-[#1C3833]"
            >
              <View className="w-10 h-10 bg-success/20 rounded-xl items-center justify-center mb-3">
                <Sparkles size={20} color="#34D399" />
              </View>
              <Text className="text-white font-bold text-sm mb-0.5">Dermatologist</Text>
              <Text className="text-ink-soft text-xs">Book Telehealth Visit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metric Cards Row */}
        <View className="flex-row gap-3">
          <MetricCard
            title="Hydration"
            value={92}
            unit="%"
            change="+4%"
            isPositive={true}
            sparklineData={[80, 84, 83, 88, 90, 92]}
            icon={<Droplet size={16} color="#34D399" />}
          />
          <MetricCard
            title="Barrier Integrity"
            value={85}
            unit="%"
            change="+2%"
            isPositive={true}
            sparklineData={[78, 80, 82, 81, 84, 85]}
            icon={<Zap size={16} color="#818CF8" />}
          />
        </View>

        {/* 7-Day Trend Chart */}
        <AreaChart
          data={skinScoreData}
          title="7-Day Skin Health Index"
          height={200}
          color="#10B981"
        />

        {/* Active Regimen Protocol Banner */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Award size={18} color="#F59E0B" />
              <Text className="text-white font-bold text-base ml-2">Evening Protocol</Text>
            </View>
            <Badge label="3/4 Steps Done" variant="warning" />
          </View>
          <Text className="text-ink-soft text-xs mb-4">
            Hydrating Serum + Retinol + Niacinamide Repair Cream
          </Text>
          <Button
            title="View Full Routine"
            onPress={() => router.push('/(tabs)/routines')}
            variant="secondary"
            size="sm"
            icon={<ArrowRight size={16} color="#10B981" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
