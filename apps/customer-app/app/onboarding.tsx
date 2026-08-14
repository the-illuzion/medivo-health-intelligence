import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, isLoading } = useAuthStore();
  const [selectedSkinType, setSelectedSkinType] = useState('Combination');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Hydration Boost', 'Barrier Renewal']);

  const goalsList = [
    'Hydration Boost',
    'Barrier Renewal',
    'Acne Therapy',
    'Pigmentation Lightening',
    'Anti-Aging Smoothness',
    'Pore Refining',
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = async () => {
    await completeOnboarding(selectedSkinType, selectedGoals);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Sparkles size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Personalize Your AI Engine</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">
            Tell us about your dermal health goals so Medivo AI can tailor your sub-dermal recommendations
          </Text>
        </View>

        <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-3">1. Primary Skin Classification</Text>
        <View className="grid grid-cols-2 gap-3 mb-8">
          {['Combination', 'Sensitive', 'Oily', 'Dry', 'Normal'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedSkinType(type)}
              className={`p-4 rounded-2xl border ${
                selectedSkinType === type
                  ? 'bg-brand-primary/10 border-brand-primary'
                  : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#374151]'
              }`}
            >
              <Text className={`font-bold text-sm ${selectedSkinType === type ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-3">2. Select Your Dermal Goals</Text>
        <View className="gap-3 mb-8">
          {goalsList.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <TouchableOpacity
                key={goal}
                onPress={() => toggleGoal(goal)}
                className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                  isSelected
                    ? 'bg-brand-primary/10 border-brand-primary'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#374151]'
                }`}
              >
                <Text className={`font-bold text-sm ${isSelected ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>{goal}</Text>
                {isSelected ? <CheckCircle2 size={20} color="#1F7FC4" /> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          disabled={isLoading}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-white font-extrabold text-base mr-2">Complete Profile & Enter Dashboard</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
