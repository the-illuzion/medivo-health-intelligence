import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Privacy & HIPAA Security</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Data handling standards</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-4xl mx-auto w-full">
        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center mb-2">
            <ShieldCheck size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-bold text-base ml-2">Zero PHI Disclosure</Text>
          </View>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
            All skin scans and telemetry images are encrypted using AES-256 before leaving your device. Protected Health Information (PHI) is isolated within schema-per-domain architecture.
          </Text>
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <Text className="text-slate-900 dark:text-white font-bold text-base mb-2">Consent & Neural Processing</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">
            On-device neural inference guarantees your image never undergoes third-party training without explicit, timestamped opt-in consent.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
