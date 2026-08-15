import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Circle, Sun, Moon, Clock, ChevronRight, Sparkles, AlertCircle } from 'lucide-react-native';
import { Badge } from '../../src/components/ui';
import { apiClient } from '@medivo/api-client';

export default function RoutinesScreen() {
  const router = useRouter();
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);

  const fetchRoutines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.routines.list();
      setRoutines(data || []);
    } catch (err: any) {
      console.warn('[Routines API Fetch Error]:', err.message);
      setError(err.message || 'Failed to load routine protocols.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleToggleStep = async (routineId: string, stepId: string, currentCompleted?: boolean) => {
    const newCompleted = !currentCompleted;
    setTogglingStepId(stepId);

    // Optimistic UI update
    setRoutines((prevRoutines) =>
      prevRoutines.map((r) => {
        if (r.id !== routineId) return r;
        const updatedSteps = r.steps.map((s: any) =>
          s.id === stepId ? { ...s, completed: newCompleted } : s
        );
        const completedCount = updatedSteps.filter((s: any) => s.completed).length;
        return { ...r, steps: updatedSteps, completedCount };
      })
    );

    try {
      // Save step state to Customer BFF backend
      await apiClient.routines.toggleStep(routineId, stepId, newCompleted);
    } catch (err: any) {
      console.warn('[Routine Persistence Error]:', err.message);
      // Rollback on failure
      fetchRoutines();
    } finally {
      setTogglingStepId(null);
    }
  };

  const morningRoutine = routines.find((r) => r.timing === 'Morning') || routines[0];
  const eveningRoutine = routines.find((r) => r.timing === 'Evening') || routines[1];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Personalized Routines</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">Protocols dynamically optimized for your dermal barrier recovery</Text>
          </View>
          <Badge label="AI Personalization Active" variant="success" className="hidden sm:flex" />
        </View>

        {/* Error Banner State */}
        {error ? (
          <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <AlertCircle size={20} color="#F43F5E" className="mr-2.5 flex-shrink-0" />
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold">{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchRoutines} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-extrabold">Retry ↻</Text>
            </TouchableOpacity>
          </View>
        ) : null}

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

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#1F7FC4" />
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-3">Fetching Personalized Protocols...</Text>
          </View>
        ) : (
          /* Side-by-Side Desktop Protocol Cards Grid */
          <View className="flex-col lg:flex-row gap-8 items-start">
            
            {/* Morning Care Protocol Card */}
            {morningRoutine && (
              <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl items-center justify-center mr-3 border border-amber-500/30">
                      <Sun size={24} color="#D97706" />
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-bold text-lg">{morningRoutine.name}</Text>
                      <View className="flex-row items-center mt-0.5">
                        <Clock size={12} color="#64748B" />
                        <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                          {morningRoutine.duration} • {morningRoutine.completedCount || 0}/{morningRoutine.steps?.length || 0} Steps
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Badge
                    label={morningRoutine.completedCount === morningRoutine.steps?.length ? 'Completed' : 'In Progress'}
                    variant={morningRoutine.completedCount === morningRoutine.steps?.length ? 'success' : 'warning'}
                  />
                </View>

                <View className="gap-3">
                  {morningRoutine.steps?.map((step: any) => (
                    <TouchableOpacity
                      key={step.id}
                      onPress={() => handleToggleStep(morningRoutine.id, step.id, step.completed)}
                      className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 transition-all shadow-sm"
                    >
                      {togglingStepId === step.id ? (
                        <ActivityIndicator size="small" color="#1F7FC4" />
                      ) : step.completed ? (
                        <CheckCircle2 size={22} color="#059669" />
                      ) : (
                        <Circle size={22} color="#64748B" />
                      )}
                      <View className="ml-3.5 flex-1">
                        <Text className="text-slate-900 dark:text-white font-bold text-base">{step.title}</Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{step.desc}</Text>
                      </View>
                      <ChevronRight size={20} color="#64748B" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Evening Repair Protocol Card */}
            {eveningRoutine && (
              <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-[#374151] shadow-sm">
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl items-center justify-center mr-3 border border-indigo-500/30">
                      <Moon size={24} color="#4F46E5" />
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-bold text-lg">{eveningRoutine.name}</Text>
                      <View className="flex-row items-center mt-0.5">
                        <Clock size={12} color="#64748B" />
                        <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                          {eveningRoutine.duration} • {eveningRoutine.completedCount || 0}/{eveningRoutine.steps?.length || 0} Steps
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Badge
                    label={eveningRoutine.completedCount === eveningRoutine.steps?.length ? 'Completed' : 'In Progress'}
                    variant={eveningRoutine.completedCount === eveningRoutine.steps?.length ? 'success' : 'warning'}
                  />
                </View>

                <View className="gap-3">
                  {eveningRoutine.steps?.map((step: any) => (
                    <TouchableOpacity
                      key={step.id}
                      onPress={() => handleToggleStep(eveningRoutine.id, step.id, step.completed)}
                      className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] active:bg-slate-100 dark:active:bg-slate-800 transition-all shadow-sm"
                    >
                      {togglingStepId === step.id ? (
                        <ActivityIndicator size="small" color="#1F7FC4" />
                      ) : step.completed ? (
                        <CheckCircle2 size={22} color="#059669" />
                      ) : (
                        <Circle size={22} color="#64748B" />
                      )}
                      <View className="ml-3.5 flex-1">
                        <Text className="text-slate-900 dark:text-white font-bold text-base">{step.title}</Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{step.desc}</Text>
                      </View>
                      <ChevronRight size={20} color="#64748B" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

          </View>
        )}
      </View>
    </ScrollView>
  );
}
