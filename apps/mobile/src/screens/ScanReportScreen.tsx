import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface ScanReportScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function ScanReportScreen({ onNavigate }: ScanReportScreenProps) {
  const metrics = [
    { label: 'Hydration Level', score: 76, unit: '%', delta: '+6', note: 'Optimal moisture retention', icon: 'droplet', color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Skin Texture', score: 84, unit: '/100', delta: '+2', note: 'Smooth epidermal surface', icon: 'sparkles', color: '#059669', bg: '#D1FAE5' },
    { label: 'Pigmentation', score: 79, unit: '/100', delta: '+3', note: 'Even tone distribution', icon: 'sun', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Dark Circles', score: 72, unit: '/100', delta: '+1', note: 'Mild periorbital shadow', icon: 'moon', color: '#7C3AED', bg: '#F3E8FF' },
  ];

  const recommendations = [
    { title: 'Incorporate Hyaluronic Serum', desc: 'Apply twice daily after cleansing to boost hydration +6%.', icon: 'shield' },
    { title: 'Daily SPF 50 Application', desc: 'Protects against UV-induced pigmentation and collagen breakdown.', icon: 'sun' },
    { title: 'Hydra-Gel Eye Contour', desc: 'Targets periorbital dark circles and micro-puffiness.', icon: 'eye' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('dashboard')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Scan Analysis</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => {}}>
          <Feather name="share-2" size={18} color="#4338CA" />
        </TouchableOpacity>
      </View>

      {/* Hero Score Badge */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>CLINICAL SKIN DIAGNOSTIC</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNum}>87</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>Optimal Grade</Text>
          </View>
          <View style={styles.trendBadge}>
            <Feather name="trending-up" size={12} color="#059669" />
            <Text style={styles.trendText}>+4 vs last week</Text>
          </View>
        </View>
      </View>

      {/* Diagnostic Metrics Grid */}
      <Text style={styles.sectionTitle}>Diagnostic Breakdown</Text>
      <View style={styles.metricsList}>
        {metrics.map((m, idx) => (
          <View key={idx} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.iconBox, { backgroundColor: m.bg }]}>
                <Feather name={m.icon as any} size={18} color={m.color} />
              </View>
              <View style={styles.metricTitleBox}>
                <Text style={styles.metricName}>{m.label}</Text>
                <Text style={styles.metricNote}>{m.note}</Text>
              </View>
              <View style={styles.metricValBox}>
                <Text style={styles.metricScore}>{m.score}{m.unit}</Text>
                <Text style={styles.metricDelta}>{m.delta}</Text>
              </View>
            </View>

            {/* Score Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${m.score}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* AI Recommendations */}
      <Text style={styles.sectionTitle}>AI Regimen Adjustments</Text>
      {recommendations.map((r, idx) => (
        <View key={idx} style={styles.recCard}>
          <View style={styles.recIconBox}>
            <Feather name={r.icon as any} size={18} color="#4338CA" />
          </View>
          <View style={styles.recContent}>
            <Text style={styles.recTitle}>{r.title}</Text>
            <Text style={styles.recDesc}>{r.desc}</Text>
          </View>
        </View>
      ))}

      {/* Primary Action Buttons */}
      <View style={styles.actionStack}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => onNavigate('products')}>
          <Feather name="shopping-bag" size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>View Recommended Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => onNavigate('consultations')}>
          <Feather name="user-check" size={18} color="#4338CA" />
          <Text style={styles.secondaryBtnText}>Book Dermatologist Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  shareBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  heroCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#EEF0F7' },
  heroTag: { fontSize: 11, fontWeight: '700', color: '#4338CA', letterSpacing: 1, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreNum: { fontSize: 52, fontWeight: '800', color: '#1E1B4B' },
  scoreMax: { fontSize: 18, color: '#64748B', marginLeft: 4 },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  gradeBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  gradeText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  trendText: { color: '#4338CA', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 14 },
  metricsList: { gap: 12, marginBottom: 24 },
  metricCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#EEF0F7' },
  metricHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  metricTitleBox: { flex: 1, marginLeft: 12 },
  metricName: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  metricNote: { fontSize: 11, color: '#64748B', marginTop: 2 },
  metricValBox: { alignItems: 'flex-end' },
  metricScore: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },
  metricDelta: { fontSize: 11, color: '#059669', fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  recCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, flexDirection: 'row', marginBottom: 12, borderWidth: 1, borderColor: '#EEF0F7' },
  recIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  recContent: { flex: 1, marginLeft: 12 },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  recDesc: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  actionStack: { gap: 12, marginTop: 12 },
  primaryBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  secondaryBtn: { backgroundColor: '#EEF2FF', paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#4338CA', fontWeight: '700', fontSize: 15, marginLeft: 8 },
});
