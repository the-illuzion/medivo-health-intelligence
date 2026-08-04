import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, ShieldCheck } from 'lucide-react-native';

export default function PaymentsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-extrabold">Payment Methods</Text>
            <Text className="text-ink-soft text-xs">Manage billing & cards</Text>
          </View>
        </View>
      </View>

      <View className="p-6 gap-4">
        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between">
          <View className="flex-row items-center">
            <CreditCard size={24} color="#10B981" />
            <View className="ml-3">
              <Text className="text-white font-bold text-base">Visa ending in •••• 4242</Text>
              <Text className="text-ink-soft text-xs">Expires 12/28 • Default</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="bg-surface-elevated p-4 rounded-2xl border border-dashed border-[#2A4A43] flex-row items-center justify-center">
          <Plus size={18} color="#10B981" />
          <Text className="text-brand-primary font-bold text-sm ml-2">Add New Payment Method</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
