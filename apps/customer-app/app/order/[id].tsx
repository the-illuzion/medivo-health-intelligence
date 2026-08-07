import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 pt-16 items-center max-w-4xl mx-auto w-full">
        <View className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full items-center justify-center mb-4 border-2 border-emerald-500">
          <CheckCircle2 size={40} color="#059669" />
        </View>
        <Text className="text-slate-900 dark:text-white text-2xl font-extrabold mb-1">Order Confirmed!</Text>
        <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">Order ID: {id || 'ord_9041'}</Text>
      </View>

      <View className="px-6 gap-4 max-w-4xl mx-auto w-full">
        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center mb-3">
            <Package size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white font-bold text-base ml-2">Fulfillment Status</Text>
          </View>
          <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">Preparing for Express Shipment</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">Estimated Delivery: Aug 06, 2026</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-4"
        >
          <Text className="text-white font-extrabold text-base mr-2">Return to Home</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
