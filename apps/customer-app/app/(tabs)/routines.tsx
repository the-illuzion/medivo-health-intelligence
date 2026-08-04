import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Circle, Sun, Moon, Clock, ChevronRight } from 'lucide-react-native';

export default function RoutinesScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43]">
        <Text className="text-white text-2xl font-extrabold mb-1">Personalized Routines</Text>
        <Text className="text-ink-soft text-sm">AI-curated daily skincare protocols</Text>
      </View>

      <View className="px-6 pt-6">
        {/* Morning Protocol */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43] mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-amber-500/20 rounded-lg items-center justify-center mr-3">
                <Sun size={18} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">Morning Protocol</Text>
                <Text className="text-ink-soft text-xs">AM Care • 4 Steps</Text>
              </View>
            </View>
            <Text className="text-success-light text-xs font-semibold bg-success/10 px-2.5 py-1 rounded-full">Completed</Text>
          </View>

          <View className="gap-2.5">
            <TouchableOpacity onPress={() => router.push('/routine/1')} className="flex-row items-center bg-[#1C3833] p-3 rounded-xl">
              <CheckCircle2 size={18} color="#10B981" />
              <Text className="text-white text-sm ml-3 flex-1">Gentle Hydrating Cleanser</Text>
              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/routine/2')} className="flex-row items-center bg-[#1C3833] p-3 rounded-xl">
              <CheckCircle2 size={18} color="#10B981" />
              <Text className="text-white text-sm ml-3 flex-1">Vitamin C Antioxidant Serum</Text>
              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Evening Protocol */}
        <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-indigo-500/20 rounded-lg items-center justify-center mr-3">
                <Moon size={18} color="#818CF8" />
              </View>
              <View>
                <Text className="text-white font-bold text-base">Evening Repair</Text>
                <Text className="text-ink-soft text-xs">PM Care • 3 Steps</Text>
              </View>
            </View>
            <Text className="text-warning text-xs font-semibold bg-warning/10 px-2.5 py-1 rounded-full">In Progress</Text>
          </View>

          <View className="gap-2.5">
            <TouchableOpacity onPress={() => router.push('/routine/3')} className="flex-row items-center bg-[#1C3833] p-3 rounded-xl">
              <CheckCircle2 size={18} color="#10B981" />
              <Text className="text-white text-sm ml-3 flex-1">Niacinamide Barrier Toner</Text>
              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/routine/4')} className="flex-row items-center bg-[#1C3833] p-3 rounded-xl">
              <Circle size={18} color="#64748B" />
              <Text className="text-white text-sm ml-3 flex-1">0.5% Encapsulated Retinol Cream</Text>
              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
