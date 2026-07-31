import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface CartScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function CartScreen({ onNavigate }: CartScreenProps) {
  const [items, setItems] = useState([
    { id: 1, name: 'Hydra Renew Serum', price: 62, qty: 1, category: 'Serum', tint: '#E0F2FE', accent: '#0284C7' },
    { id: 2, name: 'Vitamin C Brightening Drops', price: 58, qty: 1, category: 'Serum', tint: '#FEF3C7', accent: '#D97706' },
  ]);

  function updateQty(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal + shipping;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('products')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart ({items.reduce((a, b) => a + b.qty, 0)})</Text>
        <View style={{ width: 38 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Feather name="shopping-bag" size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => onNavigate('products')}>
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={[styles.iconBox, { backgroundColor: item.tint }]}>
                  <Feather name="droplet" size={24} color={item.accent} />
                </View>

                <View style={styles.itemMeta}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>

                <View style={styles.qtyBox}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                    <Feather name="minus" size={14} color="#1E1B4B" />
                  </TouchableOpacity>

                  <Text style={styles.qtyVal}>{item.qty}</Text>

                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                    <Feather name="plus" size={14} color="#1E1B4B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Express Health Shipping</Text>
              <Text style={styles.summaryVal}>${shipping.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => onNavigate('checkout')} activeOpacity={0.85}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout (${total.toFixed(2)})</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  emptyBox: { alignItems: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#64748B', marginVertical: 16 },
  browseBtn: { backgroundColor: '#4338CA', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  browseBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  itemsList: { gap: 12, marginBottom: 24 },
  itemCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  itemMeta: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  itemPrice: { fontSize: 13, color: '#4338CA', fontWeight: '700', marginTop: 2 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  qtyVal: { paddingHorizontal: 10, fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  summaryCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7' },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: '#64748B' },
  summaryVal: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#EEF0F7', paddingTop: 12, marginTop: 6 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },
  totalVal: { fontSize: 20, fontWeight: '800', color: '#4338CA' },
  checkoutBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  checkoutBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginRight: 8 },
});
