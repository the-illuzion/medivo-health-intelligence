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
    <View className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Secure Checkout</Text>
          <Text className="text-ink-soft text-xs">Stripe Tokenized Payment</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 gap-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
          <Text className="text-white font-bold text-base mb-2">Shipping Address</Text>
          <Text className="text-ink-soft text-sm">Alex Morgan</Text>
          <Text className="text-ink-soft text-sm">742 Evergreen Terrace, Suite 100</Text>
          <Text className="text-ink-soft text-sm">San Francisco, CA 94107</Text>
        </View>

        <View className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-bold text-base">Payment Method</Text>
            <ShieldCheck size={16} color="#10B981" />
          </View>
          <View className="flex-row items-center bg-[#1C3833] p-3 rounded-xl border border-[#2A4A43]">
            <CreditCard size={20} color="#10B981" />
            <Text className="text-white text-sm font-semibold ml-3">Visa ending in •••• 4242</Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 bg-surface-elevated border-t border-[#2A4A43]">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg"
        >
          <CheckCircle2 size={20} color="#0D1F1C" />
          <Text className="text-surface font-extrabold text-base ml-2">Confirm & Pay $42.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
