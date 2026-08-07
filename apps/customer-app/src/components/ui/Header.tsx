import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ShoppingBag, Search, Sparkles } from 'lucide-react-native';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Alex Morgan',
  subtitle = 'Welcome Back',
  showActions = true,
  cartCount = 2,
}) => {
  const router = useRouter();

  return (
    <View className="px-6 pt-10 lg:pt-6 pb-5 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
      <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
        
        {/* User Info & Avatar */}
        <View className="flex-row items-center">
          <View className="w-11 h-11 bg-brand-primary/20 rounded-full items-center justify-center border-2 border-brand-primary mr-3 shadow-sm">
            <Text className="text-brand-primary font-extrabold text-sm">AM</Text>
          </View>
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{subtitle}</Text>
            <Text className="text-slate-900 dark:text-white text-lg font-extrabold tracking-tight">{title}</Text>
          </View>
        </View>

        {/* Desktop Quick Search Input */}
        <View className="hidden md:flex flex-1 max-w-sm mx-8 flex-row items-center bg-white dark:bg-[#1F2937] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <Search size={16} color="#1F7FC4" className="mr-2" />
          <TextInput
            placeholder="Search AI skin records, products..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-900 dark:text-white text-xs"
          />
        </View>

        {/* Actions & Badge */}
        {showActions && (
          <View className="flex-row items-center gap-3">
            <View className="hidden sm:flex flex-row items-center bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30 mr-1">
              <Sparkles size={12} color="#059669" className="mr-1.5" />
              <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">Telemetry Live</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="w-10 h-10 bg-white dark:bg-[#1F2937] rounded-xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm active:bg-slate-100 dark:active:bg-slate-800"
            >
              <Bell size={18} color="#1F7FC4" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/cart')}
              className="w-10 h-10 bg-white dark:bg-[#1F2937] rounded-xl items-center justify-center border border-slate-200 dark:border-[#374151] shadow-sm relative active:bg-slate-100 dark:active:bg-slate-800"
            >
              <ShoppingBag size={18} color="#1F7FC4" />
              {cartCount > 0 && (
                <View className="w-4 h-4 bg-brand-primary rounded-full items-center justify-center absolute -top-1 -right-1">
                  <Text className="text-white font-extrabold text-[9px]">{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
