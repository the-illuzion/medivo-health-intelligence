import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { Badge } from '../src/components/ui';

export default function CartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]">
      {/* Main Desktop Split Container */}
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="max-w-7xl mx-auto w-full gap-6">
          {/* Page Title & Subtitle Banner */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 min-w-0 mr-4">
              <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]">
                <ArrowLeft size={20} color="#1F7FC4" />
              </TouchableOpacity>
              <View className="flex-1 min-w-0">
                <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
                  Shopping Cart
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
                  2 Items Matched to your Skin Telemetry
                </Text>
              </View>
            </View>
            <Badge label="Free Express Shipping" variant="success" className="hidden sm:flex" />
          </View>

          <View className="flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column (2/3 width on Desktop): Cart Items */}
            <View className="flex-1 w-full gap-4">
              <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-4 border border-sky-500/30">
                    <ShoppingBag size={24} color="#1F7FC4" />
                  </View>
                  <View className="flex-1">
                    <Badge label="98% Match" variant="success" className="mb-1" />
                    <Text className="text-slate-900 dark:text-white font-extrabold text-base">Centella Barrier Repair Serum</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Quantity: 1 • 50ml</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-brand-primary font-extrabold text-lg mb-2">$42.00</Text>
                  <TouchableOpacity className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
                <View className="flex-row items-center flex-1 mr-4">
                  <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-4 border border-sky-500/30">
                    <ShoppingBag size={24} color="#1F7FC4" />
                  </View>
                  <View className="flex-1">
                    <Badge label="96% Match" variant="success" className="mb-1" />
                    <Text className="text-slate-900 dark:text-white font-extrabold text-base">Mineral UV Shield SPF 50+</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Quantity: 1 • 80ml</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-brand-primary font-extrabold text-lg mb-2">$34.00</Text>
                  <TouchableOpacity className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Right Column (1/3 width on Desktop): Order Summary Card */}
            <View className="w-full lg:w-96 bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] gap-4 shadow-sm">
              <Text className="text-slate-900 dark:text-white font-extrabold text-lg">Order Summary</Text>

              <View className="gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm">Subtotal</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm">$76.00</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm">Express Shipping</Text>
                  <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">FREE</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 text-sm">Estimated Tax</Text>
                  <Text className="text-slate-900 dark:text-white font-bold text-sm">$4.50</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between my-1">
                <Text className="text-slate-900 dark:text-white text-base font-extrabold">Total Amount</Text>
                <Text className="text-brand-primary text-2xl font-extrabold">$80.50</Text>
              </View>

              <View className="bg-sky-500/10 dark:bg-sky-500/20 p-3 rounded-2xl border border-sky-500/30 flex-row items-center">
                <ShieldCheck size={16} color="#1F7FC4" className="mr-2" />
                <Text className="text-slate-700 dark:text-slate-300 text-xs font-semibold">100% Dermatologist Approved</Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/checkout')}
                className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-2"
              >
                <Text className="text-white font-extrabold text-base mr-2">Proceed to Checkout</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
