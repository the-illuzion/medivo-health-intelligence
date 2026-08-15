import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, ShieldCheck } from 'lucide-react-native';
import { Badge } from '../src/components/ui';

export default function PaymentsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 min-w-0 mr-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]">
              <ArrowLeft size={20} color="#1F7FC4" />
            </TouchableOpacity>
            <View className="flex-1 min-w-0">
              <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
                Payment Methods
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
                Manage encrypted billing cards & HSA/FSA accounts
              </Text>
            </View>
          </View>
          <Badge label="256-Bit Encrypted" variant="success" className="hidden sm:flex" />
        </View>

        {/* Security Info Card */}
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-4 rounded-2xl border border-sky-500/30 flex-row items-center shadow-sm">
          <ShieldCheck size={20} color="#1F7FC4" className="mr-3 flex-shrink-0" />
          <Text className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-5 flex-1">
            All card information is tokenized via Stripe PCI-DSS Level 1 compliant vault. Medivo does not store raw credit card numbers.
          </Text>
        </View>

        {/* Active Payment Methods */}
        <View className="gap-3">
          <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-3.5 border border-sky-500/30">
                <CreditCard size={22} color="#1F7FC4" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-extrabold text-base">Visa ending in •••• 4242</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Expires 12/28 • Default Payment Method</Text>
              </View>
            </View>
            <Badge label="Default" variant="success" />
          </View>

          <TouchableOpacity className="bg-slate-50 dark:bg-[#111827] p-4.5 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex-row items-center justify-center active:bg-slate-100 dark:active:bg-slate-800 shadow-sm mt-2">
            <Plus size={18} color="#1F7FC4" />
            <Text className="text-brand-primary font-bold text-sm ml-2">Add New Payment Method</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
