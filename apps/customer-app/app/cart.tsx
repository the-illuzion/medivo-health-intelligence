import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight } from 'lucide-react-native';

export default function CartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]">
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Shopping Cart</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">2 Items Selected</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 gap-4 max-w-4xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center">
            <View className="w-14 h-14 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mr-3 border border-sky-500/30">
              <ShoppingBag size={20} color="#1F7FC4" />
            </View>
            <View>
              <Text className="text-slate-900 dark:text-white font-bold text-base">Centella Repair Serum</Text>
              <Text className="text-brand-primary font-extrabold text-sm">$42.00</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View className="p-6 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-[#374151]">
        <View className="max-w-4xl mx-auto w-full">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Total Amount</Text>
            <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">$42.00</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/checkout')}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm"
          >
            <Text className="text-white font-extrabold text-base mr-2">Proceed to Checkout</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
