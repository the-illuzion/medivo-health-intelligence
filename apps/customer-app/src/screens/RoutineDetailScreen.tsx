import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface RoutineDetailScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function RoutineDetailScreen({ onNavigate }: RoutineDetailScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState('');

  const routineSteps = [
    { step: 1, name: 'Balancing Gentle Cleanser', time: '08:00 AM', category: 'Cleanse', note: 'Apply 1 pump to damp skin. Massage in circular motions for 60 seconds.', tint: '#EEF2FF', icon: 'droplet', color: '#4338CA' },
    { step: 2, name: 'Vitamin C 15% Serum', time: '08:05 AM', category: 'Treat', note: 'Dispense 4 drops onto fingertips. Press gently into face and neck.', tint: '#FEF3C7', icon: 'sun', color: '#D97706' },
    { step: 3, name: 'Hydra Barrier Repair Moisturizer', time: '08:10 AM', category: 'Hydrate', note: 'Smooth pea-sized amount evenly over skin to seal in active serum.', tint: '#E0F2FE', icon: 'shield', color: '#0284C7' },
    { step: 4, name: 'Mineral SPF 50+ Sunscreen', time: '08:15 AM', category: 'Protect', note: 'Apply two finger-lengths as final step 15 minutes before sun exposure.', tint: '#ECFDF5', icon: 'sun', color: '#059669' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('routines')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Morning Regimen Guide</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Feather name="plus" size={18} color="#4338CA" />
        </TouchableOpacity>
      </View>

      {/* Routine Banner */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>DAILY APPLICATION SEQUENCE</Text>
        <Text style={styles.heroTitle}>Morning Barrier Protection</Text>
        <Text style={styles.heroSub}>Follow this 4-step sequence to maximize ingredient absorption.</Text>
      </View>

      {/* Add Custom Product Form Modal */}
      {showAddModal && (
        <View style={styles.addModal}>
          <Text style={styles.modalTitle}>Add Custom Product to Routine</Text>

          <Text style={styles.label}>Product Name</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={customName} onChangeText={setCustomName} placeholder="e.g. Niacinamide Booster" />
          </View>

          <Text style={styles.label}>Brand Name</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} value={customBrand} onChangeText={setCustomBrand} placeholder="e.g. Medivo Clinical" />
          </View>

          <View style={styles.modalBtnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.saveBtnText}>Add Step</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step Sequence Cards */}
      <View style={styles.stepsList}>
        {routineSteps.map((item) => (
          <View key={item.step} style={styles.stepCard}>
            <View style={styles.stepTop}>
              <View style={[styles.stepIconBox, { backgroundColor: item.tint }]}>
                <Feather name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.stepMeta}>
                <Text style={styles.stepBadge}>Step {item.step} · {item.category}</Text>
                <Text style={styles.stepName}>{item.name}</Text>
              </View>
            </View>
            <Text style={styles.stepNote}>{item.note}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  heroCard: { backgroundColor: '#4338CA', padding: 20, borderRadius: 24, marginBottom: 24 },
  heroTag: { fontSize: 10, fontWeight: '700', color: '#C7D2FE', letterSpacing: 1 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  heroSub: { fontSize: 12, color: '#E0E7FF', marginTop: 4, lineHeight: 18 },
  addModal: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  inputBox: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  input: { fontSize: 13, color: '#0F172A' },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  cancelBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  cancelBtnText: { color: '#64748B', fontWeight: '700', fontSize: 12 },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#4338CA' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  stepsList: { gap: 14 },
  stepCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7' },
  stepTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stepIconBox: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepMeta: { flex: 1, marginLeft: 12 },
  stepBadge: { fontSize: 11, fontWeight: '700', color: '#4338CA', textTransform: 'uppercase' },
  stepName: { fontSize: 15, fontWeight: '700', color: '#1E1B4B', marginTop: 2 },
  stepNote: { fontSize: 13, color: '#64748B', lineHeight: 20 },
});
