import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface OrderDetailsScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function OrderDetailsScreen({ onNavigate }: OrderDetailsScreenProps) {
  const steps = [
    { label: 'Order Confirmed', time: 'Jul 30, 04:15 PM', done: true },
    { label: 'Formulation Prepared', time: 'Jul 30, 06:30 PM', done: true },
    { label: 'Quality Inspection', time: 'Jul 30, 08:00 PM', done: true },
    { label: 'In Transit (FedEx Express)', time: 'Jul 31, 09:00 AM', done: true, active: true },
    { label: 'Out for Delivery', time: 'Est. Tomorrow 12:00 PM', done: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('payments')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #MED-84920</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => {}}>
          <Feather name="share-2" size={18} color="#4338CA" />
        </TouchableOpacity>
      </View>

      {/* Hero Transit Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.activeTag}>
            <Feather name="truck" size={14} color="#059669" />
            <Text style={styles.activeTagText}>IN TRANSIT</Text>
          </View>
          <Text style={styles.etaText}>Est: Tomorrow 12:00 PM</Text>
        </View>

        <Text style={styles.carrierTitle}>FedEx Express Priority</Text>
        <Text style={styles.trackingNum}>Tracking #: 9400 1000 0000 8492 00</Text>

        <View style={styles.mapSim}>
          <Feather name="map-pin" size={20} color="#4338CA" />
          <Text style={styles.mapText}>Transit Hub: Portland Regional Logistics Facility</Text>
        </View>
      </View>

      {/* Progress Timeline */}
      <Text style={styles.sectionTitle}>Delivery Timeline</Text>
      <View style={styles.timelineCard}>
        {steps.map((step, idx) => (
          <View key={idx} style={styles.timelineRow}>
            <View style={styles.leftCol}>
              <View style={[styles.dot, step.done && styles.dotDone, step.active && styles.dotActive]}>
                {step.done && <Feather name="check" size={10} color="#FFFFFF" />}
              </View>
              {idx < steps.length - 1 && (
                <View style={[styles.line, step.done && styles.lineDone]} />
              )}
            </View>

            <View style={styles.rightCol}>
              <Text style={[styles.stepLabel, step.active && styles.stepLabelActive]}>{step.label}</Text>
              <Text style={styles.stepTime}>{step.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Item Summary */}
      <Text style={styles.sectionTitle}>Items in Shipment</Text>
      <View style={styles.itemsCard}>
        <View style={styles.itemRow}>
          <View style={styles.itemIconBox}>
            <Feather name="droplet" size={20} color="#0284C7" />
          </View>
          <View style={styles.itemMeta}>
            <Text style={styles.itemName}>Hydra Renew Serum</Text>
            <Text style={styles.itemQty}>Qty: 1 · 50ml</Text>
          </View>
          <Text style={styles.itemPrice}>$62.00</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemIconBox}>
            <Feather name="sun" size={20} color="#D97706" />
          </View>
          <View style={styles.itemMeta}>
            <Text style={styles.itemName}>Vitamin C Brightening Drops</Text>
            <Text style={styles.itemQty}>Qty: 1 · 30ml</Text>
          </View>
          <Text style={styles.itemPrice}>$58.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.supportBtn} onPress={() => onNavigate('coach')}>
        <Feather name="message-square" size={16} color="#4338CA" />
        <Text style={styles.supportBtnText}>Need Help? Contact AI Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  shareBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  heroCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 24 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  activeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeTagText: { color: '#059669', fontSize: 11, fontWeight: '700', marginLeft: 6 },
  etaText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  carrierTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
  trackingNum: { fontSize: 12, color: '#64748B', marginTop: 4 },
  mapSim: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, marginTop: 16 },
  mapText: { fontSize: 12, color: '#4338CA', fontWeight: '600', marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  timelineCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 24 },
  timelineRow: { flexDirection: 'row', marginBottom: 16 },
  leftCol: { alignItems: 'center', width: 24, marginRight: 12 },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  dotDone: { backgroundColor: '#4338CA' },
  dotActive: { backgroundColor: '#059669' },
  line: { width: 2, height: 30, backgroundColor: '#E2E8F0', marginTop: 2 },
  lineDone: { backgroundColor: '#4338CA' },
  rightCol: { flex: 1 },
  stepLabel: { fontSize: 14, fontWeight: '700', color: '#475569' },
  stepLabelActive: { color: '#059669', fontSize: 15 },
  stepTime: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  itemsCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 20 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  itemIconBox: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  itemMeta: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  itemQty: { fontSize: 11, color: '#64748B', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  supportBtn: { backgroundColor: '#EEF2FF', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  supportBtnText: { color: '#4338CA', fontWeight: '700', fontSize: 14, marginLeft: 8 },
});
