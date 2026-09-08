import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { useAuthStore } from '../store/useAuthStore';
import { useScanStore } from '../store/useScanStore';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { user } = useAuthStore();
  const { activeScan, fetchScanHistory } = useScanStore();

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const userName = user?.name || 'Sarah';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'SJ';

  const score = activeScan?.overallScore ?? 87;
  const grade = activeScan?.grade ?? (score >= 85 ? 'Optimal Grade' : score >= 70 ? 'Good Condition' : 'Attention Advised');
  const metrics = activeScan?.metrics ?? {
    hydration: 86,
    texture: 84,
    pigmentation: 88,
    darkCircles: 74,
    skinAge: 26,
    rednessScore: 12,
    poreClarity: 88,
    photoprotection: 'SPF 50 Active',
  };

  const aiSummaryText = activeScan
    ? `Your dermal hydration is at ${metrics.hydration}% with a texture index of ${metrics.texture}/100. AI suggests maintaining your morning hydration routine.`
    : `Your skin hydration is up +6% this week following your updated morning regimen. Dark circles are looking softer.`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Identity Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, {userName.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>Your AI Skin Score updated today</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => onNavigate('profile')}>
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Score Card */}
      <TouchableOpacity style={styles.heroCard} onPress={() => onNavigate('scanReport')} activeOpacity={0.85}>
        <View style={styles.heroTop}>
          <Text style={styles.heroTag}>YOUR AI HEALTH SCORE</Text>
          <View style={styles.inspectBadge}>
            <Text style={styles.inspectBadgeText}>Inspect Report ›</Text>
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.trendBadge}>
            <Feather name="trending-up" size={13} color="#059669" />
            <Text style={styles.trendText}>+4 this week</Text>
          </View>
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>{grade}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* AI Clinical Summary Card */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Feather name="zap" size={16} color="#4338CA" />
          <Text style={styles.aiTitle}>Today's AI Summary</Text>
        </View>
        <Text style={styles.aiText}>{aiSummaryText}</Text>
      </View>

      {/* Quick Action Pills Grid */}
      <Text style={styles.sectionTitle}>Quick Platform Hubs</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('faceMatch')}>
          <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
            <Feather name="camera" size={20} color="#4338CA" />
          </View>
          <Text style={styles.actionLabel}>AI Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('scanReport')}>
          <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
            <Feather name="bar-chart-2" size={20} color="#059669" />
          </View>
          <Text style={styles.actionLabel}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('coach')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
            <Feather name="message-square" size={20} color="#0284C7" />
          </View>
          <Text style={styles.actionLabel}>AI Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('history')}>
          <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
            <Feather name="clock" size={20} color="#7C3AED" />
          </View>
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('routines')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Feather name="check-square" size={20} color="#D97706" />
          </View>
          <Text style={styles.actionLabel}>Routines</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('products')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FCE7F3' }]}>
            <Feather name="shopping-bag" size={20} color="#DB2777" />
          </View>
          <Text style={styles.actionLabel}>Store</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('consultations')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
            <Feather name="user-check" size={20} color="#3730A3" />
          </View>
          <Text style={styles.actionLabel}>Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('profile')}>
          <View style={[styles.actionIcon, { backgroundColor: '#F1F5F9' }]}>
            <Feather name="user" size={20} color="#475569" />
          </View>
          <Text style={styles.actionLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Health Metrics Grid */}
      <Text style={styles.sectionTitle}>Health Telemetry</Text>
      <TouchableOpacity style={styles.metricsGrid} onPress={() => onNavigate('scanReport')}>
        <View style={styles.metricCard}>
          <Feather name="droplet" size={18} color="#0EA5E9" />
          <Text style={styles.metricLabel}>Hydration</Text>
          <Text style={styles.metricVal}>{metrics.hydration}%</Text>
        </View>
        <View style={styles.metricCard}>
          <Feather name="sun" size={18} color="#D97706" />
          <Text style={styles.metricLabel}>Pigmentation</Text>
          <Text style={styles.metricVal}>{metrics.pigmentation}</Text>
        </View>
        <View style={styles.metricCard}>
          <Feather name="moon" size={18} color="#7C3AED" />
          <Text style={styles.metricLabel}>Dark Circles</Text>
          <Text style={styles.metricVal}>{metrics.darkCircles}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  subtitle: { fontSize: 13, color: '#78716C', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  heroCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#F1F0F7' },
  heroTop: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTag: { fontSize: 11, fontWeight: '700', color: '#312E81', letterSpacing: 1 },
  inspectBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  inspectBadgeText: { color: '#4338CA', fontSize: 11, fontWeight: '700' },
  scoreContainer: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#1E1B4B' },
  scoreMax: { fontSize: 16, color: '#78716C', marginLeft: 4 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  trendText: { color: '#059669', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  gradeBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  gradeBadgeText: { color: '#4338CA', fontSize: 11, fontWeight: '700' },
  aiCard: { backgroundColor: '#EEF2FF', padding: 18, borderRadius: 20, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  aiTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B', marginLeft: 6 },
  aiText: { fontSize: 13, color: '#44403C', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#57534E' },
  metricsGrid: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#F1F0F7' },
  metricLabel: { fontSize: 11, color: '#78716C', marginTop: 8 },
  metricVal: { fontSize: 20, fontWeight: '700', color: '#1E1B4B', marginTop: 2 },
});
