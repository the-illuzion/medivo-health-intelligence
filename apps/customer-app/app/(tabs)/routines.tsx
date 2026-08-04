import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Circle, Sun, Moon, Clock, ChevronRight, Sparkles, Award } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43]">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-2xl font-extrabold">Personalized Routines</Text>
          <Badge label="AI Personalization Active" variant="success" />
        </View>
        <Text className="text-ink-soft text-sm">
          Protocols dynamically optimized for your hydration (93%) and barrier recovery.
        </Text>
      </View>

      <View className="px-6 pt-6 gap-6">
        {/* AI Routine Insights Banner */}
        <View className="bg-[#1C3833] p-4 rounded-2xl border border-[#2A4A43] flex-row items-start">
          <Sparkles size={20} color="#10B981" className="mt-0.5 mr-3" />
          <View className="flex-1">
            <Text className="text-white font-bold text-sm mb-1">Perfect Corp AI Recommendation</Text>
            <Text className="text-ink-soft text-xs leading-5">
              Evening retinol application is currently paired with 5% Niacinamide to prevent trans-epidermal water loss.
            </Text>
          </View>
        </View>

        {/* Morning Care Protocol */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-amber-500/20 rounded-xl items-center justify-center mr-3 border border-amber-500/30">
                <Sun size={20} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">Morning Protocol</Text>
                <View className="flex-row items-center mt-0.5">
                  <Clock size={12} color="#64748B" />
                  <Text className="text-ink-soft text-xs ml-1">5 Mins • 2 Steps</Text>
                </View>
              </View>
            </View>
            <Badge label="Completed" variant="success" />
          </View>

          <View className="gap-2.5">
            <TouchableOpacity
              onPress={() => router.push('/routine/step_1')}
              className="flex-row items-center bg-[#1C3833] p-3.5 rounded-xl border border-[#2A4A43]"
            >
              <CheckCircle2 size={20} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-sm">Gentle Amino Cleanser</Text>
                <Text className="text-ink-soft text-xs">Step 1 • Cleanse</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/routine/step_2')}
              className="flex-row items-center bg-[#1C3833] p-3.5 rounded-xl border border-[#2A4A43]"
            >
              <CheckCircle2 size={20} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-sm">Vitamin C Antioxidant Serum</Text>
                <Text className="text-ink-soft text-xs">Step 2 • Protect</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Evening Repair Protocol */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-indigo-500/20 rounded-xl items-center justify-center mr-3 border border-indigo-500/30">
                <Moon size={20} color="#818CF8" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">Evening Repair</Text>
                <View className="flex-row items-center mt-0.5">
                  <Clock size={12} color="#64748B" />
                  <Text className="text-ink-soft text-xs ml-1">8 Mins • 2 Steps</Text>
                </View>
              </View>
            </View>
            <Badge label="In Progress" variant="warning" />
          </View>

          <View className="gap-2.5">
            <TouchableOpacity
              onPress={() => router.push('/routine/step_3')}
              className="flex-row items-center bg-[#1C3833] p-3.5 rounded-xl border border-[#2A4A43]"
            >
              <CheckCircle2 size={20} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-sm">Niacinamide Barrier Toner</Text>
                <Text className="text-ink-soft text-xs">Step 1 • Prep</Text>
              </View>
              <ChevronRight size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleStep('step_4')}
              className="flex-row items-center bg-[#1C3833] p-3.5 rounded-xl border border-[#2A4A43]"
            >
              {completedSteps.step_4 ? (
                <CheckCircle2 size={20} color="#10B981" />
              ) : (
                <Circle size={20} color="#64748B" />
              )}
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold text-sm">0.5% Encapsulated Retinol Cream</Text>
                <Text className="text-ink-soft text-xs">Step 2 • Active Repair</Text>
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
