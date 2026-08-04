import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneOff, Mic, MicOff, Video, ShieldCheck } from 'lucide-react-native';

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface items-center justify-between p-6 pt-14 pb-12">
      <View className="items-center">
        <View className="flex-row items-center mb-2">
          <ShieldCheck size={16} color="#10B981" />
          <Text className="text-success-light text-xs font-semibold ml-1">End-to-End Encrypted Telehealth</Text>
        </View>
        <Text className="text-white text-2xl font-extrabold">Dr. Elena Rostova, MD</Text>
        <Text className="text-ink-soft text-sm mt-0.5">Consultation Session #{id || 'doc_1'}</Text>
      </View>

      {/* Video View Placeholder Container */}
      <View className="w-full h-96 bg-[#162E29] rounded-3xl border border-[#2A4A43] items-center justify-center relative overflow-hidden">
        <Video size={64} color="#10B981" />
        <Text className="text-white font-bold text-base mt-4">Connecting Secure Stream...</Text>
        <Text className="text-ink-soft text-xs mt-1">HIPAA Compliant Video Pipeline</Text>
      </View>

      {/* Action Controls */}
      <View className="flex-row items-center justify-center gap-6">
        <TouchableOpacity className="w-14 h-14 bg-surface-elevated rounded-full items-center justify-center border border-[#2A4A43]">
          <Mic size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-16 h-16 bg-red-500 rounded-full items-center justify-center shadow-lg"
        >
          <PhoneOff size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
