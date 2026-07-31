import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { formatScore, formatDelta } from '@medivo/utils';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Identity Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Sarah 👋</Text>
          <Text style={styles.subtitle}>Your Skin Score updated today</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => onNavigate('profile')}>
          <Text style={styles.avatarText}>SJ</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Score Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>YOUR HEALTH SCORE</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>87</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.trendBadge}>
          <Feather name="trending-up" size={14} color="#059669" />
          <Text style={styles.trendText}>+4 this week</Text>
        </View>
      </View>

      {/* AI Clinical Summary Card */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Feather name="sparkles" size={16} color="#4338CA" />
          <Text style={styles.aiTitle}>Today's AI Summary</Text>
        </View>
        <Text style={styles.aiText}>
          Your skin hydration is up <Text style={styles.highlight}>+6%</Text> this week following your updated morning regimen. Dark circles are looking softer.
        </Text>
      </View>

      {/* Quick Action Pills */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('faceMatch')}>
          <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
            <Feather name="camera" size={20} color="#4338CA" />
          </View>
          <Text style={styles.actionLabel}>AI Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('coach')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
            <Feather name="message-square" size={20} color="#0284C7" />
          </View>
          <Text style={styles.actionLabel}>AI Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('routines')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Feather name="check-square" size={20} color="#D97706" />
          </View>
          <Text style={styles.actionLabel}>Routines</Text>
        </TouchableOpacity>
      </View>

      {/* Health Metrics Grid */}
      <Text style={styles.sectionTitle}>Health Telemetry</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Feather name="droplet" size={18} color="#0EA5E9" />
          <Text style={styles.metricLabel}>Hydration</Text>
          <Text style={styles.metricVal}>76%</Text>
        </View>
        <View style={styles.metricCard}>
          <Feather name="sun" size={18} color="#D97706" />
          <Text style={styles.metricLabel}>Pigmentation</Text>
          <Text style={styles.metricVal}>84</Text>
        </View>
        <View style={styles.metricCard}>
          <Feather name="moon" size={18} color="#7C3AED" />
          <Text style={styles.metricLabel}>Dark Circles</Text>
          <Text style={styles.metricVal}>73</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  subtitle: { fontSize: 13, color: '#78716C', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  heroCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#F1F0F7' },
  heroTag: { fontSize: 11, fontWeight: '700', color: '#312E81', letterSpacing: 1, marginBottom: 8 },
  scoreContainer: { flexDirection: 'row', alignItems: 'baseline' },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#1E1B4B' },
  scoreMax: { fontSize: 16, color: '#78716C', marginLeft: 4 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  trendText: { color: '#059669', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  aiCard: { backgroundColor: '#EEF2FF', padding: 18, borderRadius: 20, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  aiTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B', marginLeft: 6 },
  aiText: { fontSize: 13, color: '#44403C', lineHeight: 20 },
  highlight: { color: '#059669', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#57534E' },
  metricsGrid: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#F1F0F7' },
  metricLabel: { fontSize: 11, color: '#78716C', marginTop: 8 },
  metricVal: { fontSize: 20, fontWeight: '700', color: '#1E1B4B', marginTop: 2 },
});
