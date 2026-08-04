import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Star, Plus } from 'lucide-react-native';

export default function ProductsScreen() {
  const router = useRouter();

  const products = [
    {
      id: 'p1',
      name: 'Centella Barrier Repair Serum',
      category: 'Serum',
      price: '$42.00',
      rating: 4.9,
      matchScore: '98% Match',
    },
    {
      id: 'p2',
      name: 'Peptide Hydra-Moisturizer',
      category: 'Moisturizer',
      price: '$38.00',
      rating: 4.8,
      matchScore: '95% Match',
    },
    {
      id: 'p3',
      name: 'Mineral UV Shield SPF 50+',
      category: 'Sunscreen',
      price: '$34.00',
      rating: 4.9,
      matchScore: '96% Match',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-extrabold mb-1">Curated Marketplace</Text>
          <Text className="text-ink-soft text-sm">Matched specifically for your skin profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          className="w-10 h-10 bg-[#1C3833] rounded-full items-center justify-center border border-[#2A4A43]"
        >
          <ShoppingBag size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      <View className="px-6 pt-6 gap-4">
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push('/cart')}
            className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center"
          >
            <View className="w-20 h-20 bg-[#1C3833] rounded-xl items-center justify-center mr-4 border border-[#2A4A43]">
              <Text className="text-brand-primary font-bold text-xs">{item.category}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-success-light text-xs font-bold bg-success/10 px-2 py-0.5 rounded-md mr-2">
                  {item.matchScore}
                </Text>
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-white text-xs font-medium ml-1">{item.rating}</Text>
              </View>
              <Text className="text-white font-bold text-base mb-1">{item.name}</Text>
              <Text className="text-brand-primary font-extrabold text-sm">{item.price}</Text>
            </View>
            <View className="w-9 h-9 bg-brand-primary/20 rounded-full items-center justify-center">
              <Plus size={18} color="#10B981" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
