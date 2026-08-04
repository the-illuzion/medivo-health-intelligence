import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Star, Plus, Sparkles, Filter } from 'lucide-react-native';
import { Badge, Header } from '../../src/components/ui';

export default function ProductsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Serums', 'Moisturizers', 'Sunscreens', 'Cleansers'];

  const products = [
    {
      id: 'p1',
      name: 'Centella Barrier Repair Serum',
      category: 'Serums',
      price: '$42.00',
      rating: 4.9,
      matchScore: '98% Match',
      aiReason: 'Matched for Dehydration & Redness',
    },
    {
      id: 'p2',
      name: 'Peptide Hydra-Moisturizer',
      category: 'Moisturizers',
      price: '$38.00',
      rating: 4.8,
      matchScore: '95% Match',
      aiReason: 'Matched for Stratum Corneum Hydration',
    },
    {
      id: 'p3',
      name: 'Mineral UV Shield SPF 50+',
      category: 'Sunscreens',
      price: '$34.00',
      rating: 4.9,
      matchScore: '96% Match',
      aiReason: 'Matched for Daily Photoprotection',
    },
    {
      id: 'p4',
      name: 'Gentle Amino Acid Cleanser',
      category: 'Cleansers',
      price: '$28.00',
      rating: 4.85,
      matchScore: '93% Match',
      aiReason: 'Matched for pH-Balanced Cleansing',
    },
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <Header title="Curated Marketplace" subtitle="AI Skincare Recommendations" cartCount={2} />

      <View className="px-6 pt-6 gap-6">
        {/* AI Personalization Banner */}
        <View className="bg-[#1C3833] p-4 rounded-2xl border border-[#2A4A43] flex-row items-center">
          <View className="w-10 h-10 bg-brand-primary/20 rounded-xl items-center justify-center mr-3">
            <Sparkles size={20} color="#10B981" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm">Perfect Corp AI Matched</Text>
            <Text className="text-ink-soft text-xs mt-0.5">
              Products ranked by compatibility with your current skin biomarkers.
            </Text>
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <View className="flex-row gap-2">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl border ${
                  selectedCategory === cat
                    ? 'bg-brand-primary border-brand-primary'
                    : 'bg-surface-elevated border-[#2A4A43]'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedCategory === cat ? 'text-surface' : 'text-white'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Product List */}
        <View className="gap-4">
          {filteredProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push('/cart')}
              className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-center justify-between active:bg-[#1C3833]"
            >
              <View className="w-20 h-20 bg-[#1C3833] rounded-xl items-center justify-center mr-4 border border-[#2A4A43]">
                <Text className="text-brand-primary font-extrabold text-xs text-center px-1">
                  {item.category}
                </Text>
              </View>

              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <Badge label={item.matchScore} variant="success" />
                  <View className="flex-row items-center ml-2">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-white text-xs font-bold ml-1">{item.rating}</Text>
                  </View>
                </View>

                <Text className="text-white font-bold text-base mb-0.5">{item.name}</Text>
                <Text className="text-ink-soft text-[11px] mb-1">{item.aiReason}</Text>
                <Text className="text-brand-primary font-extrabold text-sm">{item.price}</Text>
              </View>

              <View className="w-10 h-10 bg-brand-primary/20 rounded-full items-center justify-center border border-brand-primary/40">
                <Plus size={20} color="#10B981" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
