import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ShoppingBag, ShieldCheck } from 'lucide-react-native';

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
    <View className="px-6 pt-14 pb-6 bg-surface-elevated rounded-b-3xl border-b border-[#2A4A43]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-brand-primary/20 rounded-full items-center justify-center border-2 border-brand-primary mr-3">
            <Text className="text-brand-primary font-extrabold text-base">AM</Text>
          </View>
          <View>
            <Text className="text-ink-soft text-xs font-semibold">{subtitle}</Text>
            <Text className="text-white text-xl font-extrabold tracking-tight">{title}</Text>
          </View>
        </View>

        {showActions && (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="w-10 h-10 bg-[#1C3833] rounded-full items-center justify-center border border-[#2A4A43]"
            >
              <Bell size={18} color="#10B981" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/cart')}
              className="w-10 h-10 bg-[#1C3833] rounded-full items-center justify-center border border-[#2A4A43] relative"
            >
              <ShoppingBag size={18} color="#10B981" />
              {cartCount > 0 && (
                <View className="w-4 h-4 bg-brand-primary rounded-full items-center justify-center absolute -top-1 -right-1">
                  <Text className="text-surface font-extrabold text-[9px]">{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
