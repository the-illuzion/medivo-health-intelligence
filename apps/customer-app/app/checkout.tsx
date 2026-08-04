import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react-native';

export default function CheckoutScreen() {
  const router = useRouter();

  const handlePlaceOrder = () => {
    router.replace('/order/ord_9041');
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]">
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Secure Checkout</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Stripe Tokenized Payment</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 gap-4 max-w-4xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <Text className="text-slate-900 dark:text-white font-bold text-base mb-2">Shipping Address</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm">Alex Morgan</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm">742 Evergreen Terrace, Suite 100</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm">San Francisco, CA 94107</Text>
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-slate-900 dark:text-white font-bold text-base">Payment Method</Text>
            <ShieldCheck size={16} color="#1F7FC4" />
          </View>
          <View className="flex-row items-center bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]">
            <CreditCard size={20} color="#1F7FC4" />
            <Text className="text-slate-900 dark:text-white text-sm font-semibold ml-3">Visa ending in •••• 4242</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-[#374151]">
        <View className="max-w-4xl mx-auto w-full">
          <TouchableOpacity
            onPress={handlePlaceOrder}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm"
          >
            <CheckCircle2 size={20} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-base ml-2">Confirm & Pay $42.00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
