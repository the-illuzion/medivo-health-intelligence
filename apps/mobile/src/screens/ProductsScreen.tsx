import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Product } from '@medivo/types';
import { apiClient } from '@medivo/api-client';

export function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Balancing Clay Cleanser', category: 'Cleansers', price: 34, rating: 4.9, tag: 'AI Recommended', icon: 'droplet', tint: '#EEF2FF', accent: '#4338CA' },
    { id: 2, name: 'Vitamin C Brightening Drops', category: 'Serums', price: 58, rating: 4.8, tag: 'Top Rated', icon: 'sun', tint: '#FEF3C7', accent: '#D97706' },
    { id: 3, name: 'Hydra Renew Serum', category: 'Serums', price: 62, rating: 4.9, tag: 'Best for Hydration', icon: 'shield', tint: '#E0F2FE', accent: '#0284C7' },
    { id: 4, name: 'Mineral SPF 50 Shield', category: 'Sunscreen', price: 42, rating: 4.7, tag: 'Essential', icon: 'sun', tint: '#ECFDF5', accent: '#059669' },
    { id: 5, name: 'Ceramide Barrier Cream', category: 'Moisturizers', price: 46, rating: 4.9, tag: 'Restorative', icon: 'moon', tint: '#F3E8FF', accent: '#7C3AED' },
  ]);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const liveProducts = await apiClient.products.list();
        if (liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts.map((p) => ({
            ...p,
            icon: p.icon || 'droplet',
            tint: p.tint || '#EEF2FF',
            accent: p.accent || '#4338CA',
          })));
        }
      } catch (err) {
        // Fallback to initial state if server is offline
      }
    }
    fetchLiveProducts();
  }, []);

  const categories = ['All', 'Cleansers', 'Serums', 'Sunscreen', 'Moisturizers'];

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function toggleAdd(id: number) {
    setAddedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Skincare Store</Text>
        <Text style={styles.headerSub}>Curated formulations tailored for your skin telemetry</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search products, ingredients..."
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Filter Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <View style={styles.grid}>
        {filtered.map((prod) => {
          const isAdded = !!addedIds[prod.id];
          return (
            <View key={prod.id} style={styles.card}>
              <View style={[styles.cardHeader, { backgroundColor: prod.tint || '#EEF2FF' }]}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{prod.tag || 'Clinical'}</Text>
                </View>
                <Feather name={(prod.icon || 'droplet') as any} size={28} color={prod.accent || '#4338CA'} />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.catName}>{prod.category}</Text>
                <Text style={styles.prodName}>{prod.name}</Text>

                <View style={styles.ratingRow}>
                  <Feather name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{prod.rating} (120+ reviews)</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceVal}>${prod.price}</Text>
                  <TouchableOpacity
                    style={[styles.addBtn, isAdded && styles.addBtnActive]}
                    onPress={() => toggleAdd(prod.id)}
                  >
                    <Feather name={isAdded ? "check" : "plus"} size={16} color={isAdded ? '#059669' : '#FFFFFF'} />
                    <Text style={[styles.addBtnText, isAdded && styles.addBtnTextActive]}>
                      {isAdded ? 'Added' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0F172A' },
  catScroll: { marginBottom: 20 },
  catContent: { gap: 8 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF0F7' },
  catPillActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  catText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  catTextActive: { color: '#FFFFFF' },
  grid: { gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7', overflow: 'hidden' },
  cardHeader: { height: 110, padding: 14, justifyContent: 'space-between', alignItems: 'flex-start' },
  tagBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  tagText: { color: '#1E1B4B', fontSize: 10, fontWeight: '700' },
  cardBody: { padding: 16 },
  catName: { fontSize: 11, fontWeight: '600', color: '#64748B', textTransform: 'uppercase' },
  prodName: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  ratingText: { fontSize: 12, color: '#64748B', marginLeft: 4, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  priceVal: { fontSize: 20, fontWeight: '800', color: '#1E1B4B' },
  addBtn: { backgroundColor: '#4338CA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, flexDirection: 'row', alignItems: 'center' },
  addBtnActive: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 4 },
  addBtnTextActive: { color: '#059669' },
});
