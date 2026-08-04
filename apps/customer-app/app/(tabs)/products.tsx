import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Plus, Sparkles } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <Header title="Curated Marketplace" subtitle="AI Skincare Recommendations" cartCount={2} />

      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* AI Personalization Banner */}
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-4 rounded-2xl border border-sky-500/30 flex-row items-center">
          <View className="w-10 h-10 bg-sky-500/20 rounded-xl items-center justify-center mr-3">
            <Sparkles size={20} color="#1F7FC4" />
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-bold text-sm">Perfect Corp AI Matched</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
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
                    : 'bg-slate-100 dark:bg-[#111827] border-slate-200 dark:border-[#374151]'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedCategory === cat ? 'text-white' : 'text-slate-700 dark:text-slate-300'
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
              className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between active:bg-slate-100 dark:active:bg-slate-800 shadow-sm"
            >
              <View className="w-20 h-20 bg-white dark:bg-[#1F2937] rounded-xl items-center justify-center mr-4 border border-slate-200 dark:border-[#374151]">
                <Text className="text-brand-primary font-extrabold text-xs text-center px-1">
                  {item.category}
                </Text>
              </View>

              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <Badge label={item.matchScore} variant="success" />
                  <View className="flex-row items-center ml-2">
                    <Star size={12} color="#D97706" fill="#D97706" />
                    <Text className="text-slate-900 dark:text-white text-xs font-bold ml-1">{item.rating}</Text>
                  </View>
                </View>

                <Text className="text-slate-900 dark:text-white font-bold text-base mb-0.5">{item.name}</Text>
                <Text className="text-slate-600 dark:text-slate-400 text-[11px] mb-1">{item.aiReason}</Text>
                <Text className="text-brand-primary font-extrabold text-sm">{item.price}</Text>
              </View>

              <View className="w-10 h-10 bg-brand-primary/10 rounded-full items-center justify-center border border-brand-primary/30">
                <Plus size={20} color="#1F7FC4" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
