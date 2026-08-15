import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Lock, FileText } from 'lucide-react-native';
import { Badge } from '../src/components/ui';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 min-w-0 mr-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]">
              <ArrowLeft size={20} color="#1F7FC4" />
            </TouchableOpacity>
            <View className="flex-1 min-w-0">
              <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
                Privacy & HIPAA Security
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
                Encrypted health data governance & patient rights
              </Text>
            </View>
          </View>
          <Badge label="HIPAA Compliant" variant="success" className="hidden sm:flex" />
        </View>

        {/* Policy Content Cards */}
        <View className="gap-4">
          <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl items-center justify-center mr-3 border border-emerald-500/30">
                <ShieldCheck size={20} color="#059669" />
              </View>
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">Zero Unconsented PHI Disclosure</Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
              All skin telemetry scans and facial images are encrypted using AES-256 before leaving your device. Protected Health Information (PHI) is isolated within schema-per-domain architecture and never sold or shared.
            </Text>
          </View>

          <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mr-3 border border-sky-500/30">
                <Lock size={20} color="#1F7FC4" />
              </View>
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">On-Device Neural Inference</Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
              On-device neural inference guarantees your optical frame telemetry never undergoes third-party AI training without explicit, timestamped consent.
            </Text>
          </View>

          <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl items-center justify-center mr-3 border border-indigo-500/30">
                <FileText size={20} color="#4F46E5" />
              </View>
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">Patient Audit & Data Deletion Rights</Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
              Under HIPAA § 164.524, you maintain the right to inspect your audit trail or request permanent deletion of all stored dermal records at any time.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
