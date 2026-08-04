import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function RoutinesScreen() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({ m1: true, m2: true });

  function toggle(id: string) {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const steps = [
    { id: 'm1', title: 'Gentle Cleansing', time: '2 min', product: 'Balancing Clay Cleanser' },
    { id: 'm2', title: 'Vitamin C Boost', time: '1 min', product: 'Vitamin C Brightening Drops' },
    { id: 'm3', title: 'Hydration Lock', time: '1 min', product: 'Hydra Renew Serum' },
    { id: 'm4', title: 'SPF 50 Protection', time: '1 min', product: 'Mineral SPF 50 Shield' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Routines</Text>

      {/* Streak Banner */}
      <View style={styles.streakBanner}>
        <View>
          <Text style={styles.streakLabel}>Consistency Streak</Text>
          <Text style={styles.streakVal}>🔥 12 Day Streak</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>87%</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Morning Checklist</Text>
      {steps.map((s) => {
        const isDone = !!completed[s.id];
        return (
          <TouchableOpacity
            key={s.id}
            style={[styles.stepCard, isDone && styles.stepCardDone]}
            onPress={() => toggle(s.id)}
            activeOpacity={0.8}
          >
            <View>
              <Text style={[styles.stepTitle, isDone && styles.stepTitleDone]}>{s.title}</Text>
              <Text style={styles.stepSub}>{s.product} · {s.time}</Text>
            </View>
            <Feather name={isDone ? "check-circle" : "circle"} size={24} color={isDone ? '#059669' : '#CBD5E1'} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E1B4B', marginBottom: 16 },
  streakBanner: { backgroundColor: '#F59E0B', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  streakLabel: { color: '#FEF3C7', fontSize: 11, fontWeight: '700' },
  streakVal: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginTop: 4 },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  streakBadgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  stepCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#F1F0F7' },
  stepCardDone: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  stepTitleDone: { textDecorationLine: 'line-through', color: '#64748B' },
  stepSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
});
