import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { useAuthStore } from '../store/useAuthStore';

interface CheckoutScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
  const { user } = useAuthStore();
  const [deliveryMethod, setDeliveryMethod] = useState('express');
  const recipientName = user?.name || 'Valued Patient';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('cart')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Delivery Address Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Feather name="map-pin" size={18} color="#4338CA" />
          <Text style={styles.cardTitle}>Shipping Address</Text>
        </View>
        <Text style={styles.nameText}>{recipientName}</Text>
        <Text style={styles.addressText}>742 Evergreen Terrace, Suite 4B</Text>
        <Text style={styles.addressText}>Springfield, OR 97477</Text>
      </View>

      {/* Delivery Speed Selector */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Feather name="truck" size={18} color="#059669" />
          <Text style={styles.cardTitle}>Delivery Speed</Text>
        </View>

        <TouchableOpacity
          style={[styles.optionRow, deliveryMethod === 'standard' && styles.optionActive]}
          onPress={() => setDeliveryMethod('standard')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Standard Shipping (3-5 Days)</Text>
            <Text style={styles.optionSub}>Free on orders over $50</Text>
          </View>
          <Text style={styles.optionPrice}>Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, deliveryMethod === 'express' && styles.optionActive]}
          onPress={() => setDeliveryMethod('express')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Express Health Delivery (Overnight)</Text>
            <Text style={styles.optionSub}>Temperature-controlled formulation transit</Text>
          </View>
          <Text style={styles.optionPrice}>$5.00</Text>
        </TouchableOpacity>
      </View>

      {/* Order Item Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Feather name="package" size={18} color="#D97706" />
          <Text style={styles.cardTitle}>Order Items (2)</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>1x Hydra Renew Serum</Text>
          <Text style={styles.itemVal}>$62.00</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.itemText}>1x Vitamin C Brightening Drops</Text>
          <Text style={styles.itemVal}>$58.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={() => onNavigate('payments')} activeOpacity={0.85}>
        <Text style={styles.payBtnText}>Proceed to Payment ($125.00)</Text>
        <Feather name="credit-card" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  card: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E1B4B', marginLeft: 8 },
  nameText: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  addressText: { fontSize: 13, color: '#64748B', marginTop: 2 },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 8 },
  optionActive: { borderColor: '#4338CA', backgroundColor: '#EEF2FF' },
  optionTitle: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  optionSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  optionPrice: { fontSize: 14, fontWeight: '700', color: '#4338CA' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemText: { fontSize: 13, color: '#475569' },
  itemVal: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  payBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  payBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginRight: 8 },
});
