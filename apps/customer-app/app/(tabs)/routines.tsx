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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
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
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-4 rounded-2xl border border-sky-500/30 flex-row items-start">
          <Sparkles size={20} color="#1F7FC4" className="mt-0.5 mr-3" />
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-bold text-sm mb-1">Perfect Corp AI Recommendation</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs leading-5">
              Evening retinol application is currently paired with 5% Niacinamide to prevent trans-epidermal water loss.
            </Text>
          </View>
        </View>

        {/* Morning Care Protocol */}
        <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl items-center justify-center mr-3 border border-amber-500/30">
                <Sun size={20} color="#D97706" />
              </View>
              <View>
                <Text className="text-slate-900 dark:text-white font-bold text-base">Morning Protocol</Text>
                <View className="flex-row items-center mt-0.5">
                  <Clock size={12} color="#64748B" />
                  <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">5 Mins • 2 Steps</Text>
                </View>
              </View>
            </View>
            <Badge label="Completed" variant="success" />
          </View>

          <View className="gap-2.5">
            <TouchableOpacity
              onPress={() => router.push('/routine/step_1')}
              className="flex-row items-center bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]"
            >
              <CheckCircle2 size={20} color="#059669" />
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 dark:text-white font-semibold text-sm">Gentle Amino Cleanser</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">Step 1 • Cleanse</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/routine/step_2')}
              className="flex-row items-center bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]"
            >
              <CheckCircle2 size={20} color="#059669" />
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 dark:text-white font-semibold text-sm">Vitamin C Antioxidant Serum</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">Step 2 • Protect</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Evening Repair Protocol */}
        <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl items-center justify-center mr-3 border border-indigo-500/30">
                <Moon size={20} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-slate-900 dark:text-white font-bold text-base">Evening Repair</Text>
                <View className="flex-row items-center mt-0.5">
                  <Clock size={12} color="#64748B" />
                  <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">8 Mins • 2 Steps</Text>
                </View>
              </View>
            </View>
            <Badge label="In Progress" variant="warning" />
          </View>

          <View className="gap-2.5">
            <TouchableOpacity
              onPress={() => router.push('/routine/step_3')}
              className="flex-row items-center bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]"
            >
              <CheckCircle2 size={20} color="#059669" />
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 dark:text-white font-semibold text-sm">Niacinamide Barrier Toner</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">Step 1 • Prep</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleStep('step_4')}
              className="flex-row items-center bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]"
            >
              {completedSteps.step_4 ? (
                <CheckCircle2 size={20} color="#059669" />
              ) : (
                <Circle size={20} color="#64748B" />
              )}
              <View className="ml-3 flex-1">
                <Text className="text-slate-900 dark:text-white font-semibold text-sm">0.5% Encapsulated Retinol Cream</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">Step 2 • Active Repair</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/routine/step_4')}>
                <ChevronRight size={18} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
