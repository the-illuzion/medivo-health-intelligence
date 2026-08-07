import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, MapPin, Lock } from 'lucide-react-native';
import { Badge } from '../src/components/ui';

export default function CheckoutScreen() {
  const router = useRouter();

  const handlePlaceOrder = () => {
    router.replace('/order/ord_9041');
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]">
      {/* Top Header */}
      <View className="px-6 pt-10 lg:pt-6 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#1F7FC4" />
            </TouchableOpacity>
            <View>
              <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Secure Checkout</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">256-Bit Encrypted Payment Pipeline</Text>
            </View>
          </View>
          <Badge label="Stripe Verified" variant="success" />
        </View>
      </View>

      {/* Main Desktop Split Layout */}
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="max-w-7xl mx-auto w-full flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column (2/3 width on Desktop): Shipping & Payment */}
          <View className="flex-1 w-full gap-6">
            <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
              <View className="flex-row items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <View className="flex-row items-center">
                  <MapPin size={20} color="#1F7FC4" className="mr-2" />
                  <Text className="text-slate-900 dark:text-white font-extrabold text-base">Shipping Destination</Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-brand-primary font-bold text-xs">Edit Address</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-slate-900 dark:text-white font-bold text-base mb-1">Alex Morgan</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">742 Evergreen Terrace, Suite 100</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm leading-6">San Francisco, CA 94107 • United States</Text>
            </View>

            <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
              <View className="flex-row items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <View className="flex-row items-center">
                  <Lock size={20} color="#1F7FC4" className="mr-2" />
                  <Text className="text-slate-900 dark:text-white font-extrabold text-base">Payment Details</Text>
                </View>
                <ShieldCheck size={18} color="#059669" />
              </View>

              <View className="flex-row items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                <CreditCard size={24} color="#1F7FC4" />
                <View className="ml-4 flex-1">
                  <Text className="text-slate-900 dark:text-white text-base font-bold">Visa ending in •••• 4242</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Expires 12/28 • Default Payment</Text>
                </View>
                <Badge label="Active" variant="success" />
              </View>
            </View>
          </View>

          {/* Right Column (1/3 width on Desktop): Final Order Review */}
          <View className="w-full lg:w-96 bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] gap-4 shadow-sm">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg">Final Review</Text>

            <View className="gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-600 dark:text-slate-400 text-sm">Centella Serum (1)</Text>
                <Text className="text-slate-900 dark:text-white font-bold text-sm">$42.00</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-600 dark:text-slate-400 text-sm">Mineral UV SPF (1)</Text>
                <Text className="text-slate-900 dark:text-white font-bold text-sm">$34.00</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-600 dark:text-slate-400 text-sm">Estimated Tax</Text>
                <Text className="text-slate-900 dark:text-white font-bold text-sm">$4.50</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between my-1">
              <Text className="text-slate-900 dark:text-white text-base font-extrabold">Final Total</Text>
              <Text className="text-brand-primary text-2xl font-extrabold">$80.50</Text>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-2"
            >
              <CheckCircle2 size={20} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-extrabold text-base">Confirm & Pay $80.50</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
