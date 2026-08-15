import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Plus, Sparkles, ShoppingCart } from 'lucide-react-native';
import { Badge } from '../../src/components/ui';

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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="mb-1">
          <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Curated Marketplace</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">AI-analyzed formulations matched to your dermal profile</Text>
        </View>

        {/* AI Personalization Banner */}
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-5 rounded-3xl border border-sky-500/30 flex-row items-center justify-between shadow-sm">
          <View className="flex-row items-center flex-1 mr-4">
            <View className="w-12 h-12 bg-sky-500/20 rounded-2xl items-center justify-center mr-4 border border-sky-500/30 flex-shrink-0">
              <Sparkles size={22} color="#1F7FC4" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">Perfect Corp AI Matched</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                Products ranked by compatibility with your current neural skin biomarkers.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className="hidden sm:flex px-4 py-2.5 rounded-xl bg-brand-primary flex-row items-center shadow-sm"
          >
            <ShoppingCart size={16} color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-xs font-bold">View Cart (2)</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills */}
        <View className="flex-row items-center justify-between">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <View className="flex-row gap-2">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl border transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-primary border-brand-primary shadow-sm'
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
        </View>

        {/* Multi-Column Desktop Product Cards Grid */}
        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <View
              key={item.id}
              className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-col justify-between shadow-sm hover:border-brand-primary/50 transition-all"
            >
              <View>
                <View className="w-full h-44 bg-white dark:bg-[#1F2937] rounded-2xl items-center justify-center mb-4 border border-slate-200 dark:border-[#374151] relative overflow-hidden">
                  <Badge label={item.matchScore} variant="success" className="absolute top-3 left-3 z-10" />
                  <Text className="text-brand-primary font-extrabold text-sm text-center px-4">
                    {item.name}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.category}</Text>
                  <View className="flex-row items-center">
                    <Star size={14} color="#D97706" fill="#D97706" />
                    <Text className="text-slate-900 dark:text-white text-xs font-bold ml-1">{item.rating}</Text>
                  </View>
                </View>

                <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-1">{item.name}</Text>
                <Text className="text-slate-600 dark:text-slate-400 text-xs mb-4 leading-5">{item.aiReason}</Text>
              </View>

              <View className="flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 mt-2">
                <Text className="text-brand-primary font-extrabold text-lg">{item.price}</Text>
                <TouchableOpacity
                  onPress={() => router.push('/cart')}
                  className="px-4 py-2 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/30 flex-row items-center"
                >
                  <Plus size={16} color="#1F7FC4" className="mr-1" />
                  <Text className="text-brand-primary text-xs font-bold">Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
