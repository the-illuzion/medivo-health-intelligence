import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneOff, Mic, Video, ShieldCheck } from 'lucide-react-native';

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16] items-center justify-between p-6 pt-14 pb-12">
      <View className="items-center max-w-4xl mx-auto w-full">
        <View className="flex-row items-center mb-2">
          <ShieldCheck size={16} color="#1F7FC4" />
          <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold ml-1">End-to-End Encrypted Telehealth</Text>
        </View>
        <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Dr. Elena Rostova, MD</Text>
        <Text className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Consultation Session #{id || 'doc_1'}</Text>
      </View>

      {/* Video View Placeholder Container */}
      <View className="w-full max-w-3xl h-96 bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-[#374151] items-center justify-center relative overflow-hidden shadow-sm">
        <Video size={64} color="#1F7FC4" />
        <Text className="text-slate-900 dark:text-white font-bold text-base mt-4">Connecting Secure Stream...</Text>
        <Text className="text-slate-600 dark:text-slate-400 text-xs mt-1">HIPAA Compliant Video Pipeline</Text>
      </View>

      {/* Action Controls */}
      <View className="flex-row items-center justify-center gap-6">
        <TouchableOpacity className="w-14 h-14 bg-slate-100 dark:bg-[#1F2937] rounded-full items-center justify-center border border-slate-300 dark:border-[#374151] shadow-sm">
          <Mic size={24} color="#1F7FC4" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-16 h-16 bg-red-600 rounded-full items-center justify-center shadow-md"
        >
          <PhoneOff size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
