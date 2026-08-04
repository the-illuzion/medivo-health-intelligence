import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Privacy & HIPAA Security</Text>
          <Text className="text-ink-soft text-xs">Data handling standards</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center mb-2">
            <ShieldCheck size={20} color="#10B981" />
            <Text className="text-white font-bold text-base ml-2">Zero PHI Disclosure</Text>
          </View>
          <Text className="text-ink-soft text-sm leading-6">
            All skin scans and telemetry images are encrypted using AES-256 before leaving your device. Protected Health Information (PHI) is isolated within schema-per-domain architecture.
          </Text>
        </View>

        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
          <Text className="text-white font-bold text-base mb-2">Consent & Neural Processing</Text>
          <Text className="text-ink-soft text-sm leading-6">
            On-device neural inference guarantees your image never undergoes third-party training without explicit, timestamped opt-in consent.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
