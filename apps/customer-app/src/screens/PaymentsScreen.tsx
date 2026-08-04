import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface PaymentsScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function PaymentsScreen({ onNavigate }: PaymentsScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);

  function handleCompletePayment() {
    setIsSuccess(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('checkout')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 38 }} />
      </View>

      {isSuccess ? (
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Feather name="check-circle" size={48} color="#059669" />
          </View>
          <Text style={styles.successTitle}>Payment Confirmed!</Text>
          <Text style={styles.successSub}>
            Order #MED-84920 has been placed. Your formulation will be dispatched overnight via temperature-controlled shipping.
          </Text>

          <TouchableOpacity style={styles.returnBtn} onPress={() => onNavigate('dashboard')}>
            <Text style={styles.returnBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Payment Method</Text>

            <TouchableOpacity
              style={[styles.methodRow, selectedMethod === 'card' && styles.methodActive]}
              onPress={() => setSelectedMethod('card')}
            >
              <Feather name="credit-card" size={20} color="#4338CA" />
              <View style={styles.methodMeta}>
                <Text style={styles.methodName}>Visa ending in 4242</Text>
                <Text style={styles.methodSub}>Expires 12/28 · Default Card</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'card' && styles.radioActive]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodRow, selectedMethod === 'apple' && styles.methodActive]}
              onPress={() => setSelectedMethod('apple')}
            >
              <Feather name="smartphone" size={20} color="#1E1B4B" />
              <View style={styles.methodMeta}>
                <Text style={styles.methodName}>Apple Pay / Google Pay</Text>
                <Text style={styles.methodSub}>One-touch biometric checkout</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'apple' && styles.radioActive]} />
            </TouchableOpacity>
          </View>

          {/* Amount Due Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Total Amount Due</Text>
            <Text style={styles.amountVal}>$125.00</Text>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleCompletePayment} activeOpacity={0.85}>
            <Feather name="lock" size={16} color="#FFFFFF" />
            <Text style={styles.confirmBtnText}>Pay $125.00 Securely</Text>
          </TouchableOpacity>
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
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 16 },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 10 },
  methodActive: { borderColor: '#4338CA', backgroundColor: '#EEF2FF' },
  methodMeta: { flex: 1, marginLeft: 12 },
  methodName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  methodSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#94A3B8' },
  radioActive: { borderColor: '#4338CA', backgroundColor: '#4338CA' },
  amountCard: { backgroundColor: '#4338CA', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  amountLabel: { fontSize: 12, fontWeight: '700', color: '#C7D2FE', letterSpacing: 1 },
  amountVal: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  confirmBtn: { backgroundColor: '#059669', paddingVertical: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  successCard: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: '#A7F3D0', marginTop: 20 },
  successIcon: { marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#065F46' },
  successSub: { fontSize: 13, color: '#047857', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  returnBtn: { backgroundColor: '#4338CA', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 24 },
  returnBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
