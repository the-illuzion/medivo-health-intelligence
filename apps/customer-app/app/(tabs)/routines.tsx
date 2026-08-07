import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Circle, Sun, Moon, Clock, ChevronRight, Sparkles } from 'lucide-react-native';
import { Badge } from '../../src/components/ui';

export default function RoutinesScreen() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step_1: true,
    step_2: true,
    step_3: true,
    step_4: false,
  });

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="px-6 pt-10 lg:pt-6 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Personalized Routines</Text>
            <Badge label="AI Personalization Active" variant="success" />
          </View>
          <Text className="text-slate-600 dark:text-slate-400 text-sm">
            Protocols dynamically optimized for your hydration (93%) and barrier recovery.
          </Text>
        </View>
      </View>

      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* AI Routine Insights Banner */}
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-5 rounded-3xl border border-sky-500/30 flex-row items-start shadow-sm">
          <Sparkles size={22} color="#1F7FC4" className="mt-0.5 mr-4 flex-shrink-0" />
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-1">Perfect Corp AI Recommendation</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs leading-5">
              Evening retinol application is currently paired with 5% Niacinamide to prevent trans-epidermal water loss and maximize barrier resilience.
            </Text>
          </View>
        </View>

        {/* Side-by-Side Desktop Protocol Cards Grid */}
        <View className="flex-col lg:flex-row gap-8 items-start">
          
          {/* Morning Care Protocol Card (50% Width on Desktop) */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl items-center justify-center mr-3 border border-amber-500/30">
                  <Sun size={24} color="#D97706" />
                </View>
                <View>
                  <Text className="text-slate-900 dark:text-white font-bold text-lg">Morning Protocol</Text>
                  <View className="flex-row items-center mt-0.5">
                    <Clock size={12} color="#64748B" />
                    <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">5 Mins • 2 Steps</Text>
                  </View>
                </View>
              </View>
              <Badge label="Completed" variant="success" />
            </View>

            <View className="gap-3">
              <TouchableOpacity
                onPress={() => router.push('/routine/step_1')}
                className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] hover:border-brand-primary/40 transition-all shadow-sm"
              >
                <CheckCircle2 size={22} color="#059669" />
                <View className="ml-3.5 flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base">Gentle Amino Cleanser</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Step 1 • Cleanse & Hydrate</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/routine/step_2')}
                className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] hover:border-brand-primary/40 transition-all shadow-sm"
              >
                <CheckCircle2 size={22} color="#059669" />
                <View className="ml-3.5 flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base">Vitamin C Antioxidant Serum</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Step 2 • Photoprotection</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Evening Repair Protocol Card (50% Width on Desktop) */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl items-center justify-center mr-3 border border-indigo-500/30">
                  <Moon size={24} color="#4F46E5" />
                </View>
                <View>
                  <Text className="text-slate-900 dark:text-white font-bold text-lg">Evening Repair</Text>
                  <View className="flex-row items-center mt-0.5">
                    <Clock size={12} color="#64748B" />
                    <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">8 Mins • 2 Steps</Text>
                  </View>
                </View>
              </View>
              <Badge label="In Progress" variant="warning" />
            </View>

            <View className="gap-3">
              <TouchableOpacity
                onPress={() => router.push('/routine/step_3')}
                className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] hover:border-brand-primary/40 transition-all shadow-sm"
              >
                <CheckCircle2 size={22} color="#059669" />
                <View className="ml-3.5 flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base">Niacinamide Barrier Toner</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Step 1 • Stratum Prep</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleStep('step_4')}
                className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] hover:border-brand-primary/40 transition-all shadow-sm"
              >
                {completedSteps.step_4 ? (
                  <CheckCircle2 size={22} color="#059669" />
                ) : (
                  <Circle size={22} color="#64748B" />
                )}
                <View className="ml-3.5 flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base">0.5% Encapsulated Retinol Cream</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Step 2 • Active Repair</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/routine/step_4')}>
                  <ChevronRight size={20} color="#64748B" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
