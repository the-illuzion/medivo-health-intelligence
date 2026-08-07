import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Camera, MessageSquare, ArrowRight, ShieldCheck, Droplet, Zap, Award, Activity, Heart, Sun } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Top Header */}
      <Header title="Alex Morgan" subtitle="Welcome Back" />

      {/* Main Responsive Dashboard Layout Container */}
      <View className="px-6 pt-6 max-w-7xl mx-auto w-full">
        <View className="flex-col lg:flex-row gap-8 items-start">

          {/* Left Column (2/3 Width on Desktop) */}
          <View className="flex-1 w-full gap-6">

            {/* Score Ring & Telemetry Hero Card */}
            <View className="bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] flex-col md:flex-row items-center justify-between shadow-sm">
              <View className="items-center md:items-start mb-4 md:mb-0 flex-1 pr-0 md:pr-4">
                <Badge label="Optimal Skin Barrier" icon={<ShieldCheck size={12} color="#1F7FC4" />} />
                <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mt-3 text-center md:text-left">
                  Overall Skin Index
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 text-xs mt-1 text-center md:text-left">
                  Neural biomarker analysis from recent scan
                </Text>

                <View className="flex-row items-center mt-4 justify-center md:justify-start gap-3">
                  <Button
                    title="Scan Now"
                    onPress={() => router.push('/(tabs)/scan')}
                    icon={<Camera size={16} color="#FFFFFF" />}
                    size="sm"
                  />
                  <TouchableOpacity
                    onPress={() => router.push('/history')}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    <Text className="text-slate-800 dark:text-slate-200 text-xs font-bold">View History ↗</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScoreRing score={87} label="Skin Health Score" sublabel="Optimal" size={140} />
            </View>

            {/* Quick Action Cards Grid (Responsive 2 to 4 cols) */}
            <View>
              <Text className="text-slate-900 dark:text-white font-extrabold text-lg mb-3">Quick Actions</Text>
              <View className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <TouchableOpacity
                  onPress={() => router.push('/coach')}
                  className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 shadow-sm"
                >
                  <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mb-3">
                    <MessageSquare size={20} color="#1F7FC4" />
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm mb-0.5">AI Health Coach</Text>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs">24/7 AI skin guidance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/consultations')}
                  className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 shadow-sm"
                >
                  <View className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl items-center justify-center mb-3">
                    <Sparkles size={20} color="#059669" />
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm mb-0.5">Dermatologist</Text>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs">Book Telehealth Visit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/routines')}
                  className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 shadow-sm"
                >
                  <View className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl items-center justify-center mb-3">
                    <Sun size={20} color="#D97706" />
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm mb-0.5">Daily Regimen</Text>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs">AM & PM Protocol</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/products')}
                  className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 shadow-sm"
                >
                  <View className="w-10 h-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl items-center justify-center mb-3">
                    <Activity size={20} color="#4F46E5" />
                  </View>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm mb-0.5">AI Products</Text>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs">Curated Skincare</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Metric Cards Row */}
            <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Hydration"
                value={92}
                unit="%"
                change="+4%"
                isPositive={true}
                sparklineData={[80, 84, 83, 88, 90, 92]}
                icon={<Droplet size={16} color="#1F7FC4" />}
              />
              <MetricCard
                title="Barrier Integrity"
                value={85}
                unit="%"
                change="+2%"
                isPositive={true}
                sparklineData={[78, 80, 82, 81, 84, 85]}
                icon={<Zap size={16} color="#0284C7" />}
              />
              <MetricCard
                title="Collagen Index"
                value={91}
                unit="%"
                change="+5%"
                isPositive={true}
                sparklineData={[82, 85, 87, 88, 90, 91]}
                icon={<Heart size={16} color="#059669" />}
              />
            </View>

            {/* 7-Day Trend Chart */}
            <AreaChart
              data={skinScoreData}
              title="7-Day Skin Health Index"
              height={220}
              color="#1F7FC4"
            />
          </View>

          {/* Right Column / Desktop Sidebar Panel (1/3 Width on Desktop) */}
          <View className="w-full lg:w-80 gap-6">

            {/* Active Regimen Protocol Card */}
            <View className="bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Award size={18} color="#D97706" />
                  <Text className="text-slate-900 dark:text-white font-bold text-base ml-2">Evening Protocol</Text>
                </View>
                <Badge label="3/4 Steps" variant="warning" />
              </View>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mb-5 leading-5">
                Hydrating Serum + 0.5% Encapsulated Retinol + Niacinamide Repair Cream
              </Text>
              <Button
                title="View Full Routine"
                onPress={() => router.push('/(tabs)/routines')}
                variant="secondary"
                size="sm"
                icon={<ArrowRight size={16} color="#1F7FC4" />}
                className="w-full"
              />
            </View>

            {/* Real-time Biomarker Summary Card */}
            <View className="bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
              <Text className="text-slate-900 dark:text-white font-bold text-base mb-4">Biomarker Summary</Text>
              
              <View className="gap-4">
                <View className="flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Skin Age</Text>
                  <Text className="text-slate-900 dark:text-white font-extrabold text-sm">26 yrs (-2 yrs)</Text>
                </View>

                <View className="flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Redness Score</Text>
                  <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">12% (Low)</Text>
                </View>

                <View className="flex-row items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Pore Clarity</Text>
                  <Text className="text-slate-900 dark:text-white font-extrabold text-sm">89% (Optimal)</Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Photoprotection</Text>
                  <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-sm">SPF 50 Active</Text>
                </View>
              </View>
            </View>

            {/* AI Telemedicine Banner */}
            <View className="bg-sky-500/10 dark:bg-sky-500/20 rounded-3xl p-6 border border-sky-500/30 shadow-sm">
              <Sparkles size={24} color="#1F7FC4" className="mb-2" />
              <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-1">Dermatologist Review</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mb-4 leading-5">
                Have an expert board-certified dermatologist review your neural telemetry scan.
              </Text>
              <Button
                title="Book Consultation"
                onPress={() => router.push('/consultations')}
                size="sm"
                className="w-full"
              />
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
