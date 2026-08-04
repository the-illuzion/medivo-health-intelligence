import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight } from 'lucide-react-native';

export default function CartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Shopping Cart</Text>
          <Text className="text-ink-soft text-xs">2 Items Selected</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 gap-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-[#1C3833] rounded-xl items-center justify-center mr-3 border border-[#2A4A43]">
              <ShoppingBag size={20} color="#10B981" />
            </View>
            <View>
              <Text className="text-white font-bold text-base">Centella Repair Serum</Text>
              <Text className="text-brand-primary font-extrabold text-sm">$42.00</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View className="p-6 bg-surface-elevated border-t border-[#2A4A43]">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ink-soft text-sm">Total Amount</Text>
          <Text className="text-white text-2xl font-extrabold">$42.00</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/checkout')}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg"
        >
          <Text className="text-surface font-extrabold text-base mr-2">Proceed to Checkout</Text>
          <ArrowRight size={20} color="#0D1F1C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
