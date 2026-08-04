import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 pt-16 items-center">
        <View className="w-20 h-20 bg-brand-primary/20 rounded-full items-center justify-center mb-4 border-2 border-brand-primary">
          <CheckCircle2 size={40} color="#10B981" />
        </View>
        <Text className="text-white text-2xl font-extrabold mb-1">Order Confirmed!</Text>
        <Text className="text-ink-soft text-sm text-center">Order ID: {id || 'ord_9041'}</Text>
      </View>

      <View className="px-6 gap-4">
        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center mb-3">
            <Package size={20} color="#10B981" />
            <Text className="text-white font-bold text-base ml-2">Fulfillment Status</Text>
          </View>
          <Text className="text-success-light font-semibold text-sm">Preparing for Express Shipment</Text>
          <Text className="text-ink-soft text-xs mt-1">Estimated Delivery: Aug 06, 2026</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg mt-4"
        >
          <Text className="text-surface font-extrabold text-base mr-2">Return to Home</Text>
          <ArrowRight size={20} color="#0D1F1C" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
