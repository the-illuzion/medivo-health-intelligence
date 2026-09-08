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
  const { activeScan, scanHistory, fetchScanHistory } = useScanStore();

  useEffect(() => {
    fetchScanHistory();
  }, []);

  // 1. Dynamic Greeting & User Identity
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const rawName = user?.name?.trim() || '';
  const firstName = rawName ? rawName.split(' ')[0] : 'Patient';
  const initials = rawName
    ? rawName
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'MP';

  // 2. Dynamic Scan Data & Status
  const currentScan = activeScan || (scanHistory.length > 0 ? scanHistory[0] : null);
  const hasScans = !!currentScan;

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'today';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const subtitle = hasScans && currentScan?.scannedAt
    ? `Latest AI Telemetry · ${formatTimeAgo(currentScan.scannedAt)}`
    : 'Start your first clinical AI scan to calculate score';

  // 3. Score, Grade & Trend Computation
  const score = hasScans ? currentScan.overallScore : null;
  const grade = hasScans
    ? currentScan.grade || (currentScan.overallScore >= 85 ? 'Optimal Grade' : currentScan.overallScore >= 70 ? 'Good Condition' : 'Attention Advised')
    : 'Baseline Needed';

  // Dynamic Trend calculation based on previous scans
  let trendInfo = {
    icon: 'camera' as const,
    color: '#4338CA',
    bg: '#EEF2FF',
    text: 'Tap to Scan',
  };

  if (hasScans) {
    if (scanHistory.length >= 2) {
      const prevScore = scanHistory[1].overallScore;
      const diff = currentScan.overallScore - prevScore;
      if (diff > 0) {
        trendInfo = {
          icon: 'trending-up',
          color: '#059669',
          bg: '#D1FAE5',
          text: `+${diff} pts vs last scan`,
        };
      } else if (diff < 0) {
        trendInfo = {
          icon: 'trending-down',
          color: '#D97706',
          bg: '#FEF3C7',
          text: `${diff} pts vs last scan`,
        };
      } else {
        trendInfo = {
          icon: 'minus',
          color: '#64748B',
          bg: '#F1F5F9',
          text: 'Stable baseline',
        };
      }
    } else {
      trendInfo = {
        icon: 'check-circle',
        color: '#059669',
        bg: '#D1FAE5',
        text: 'Baseline Established',
      };
    }
  }

  // 4. Dynamic AI Summary Text
  let aiSummaryText = '';
  if (hasScans && currentScan) {
    const m = currentScan.metrics || ({} as any);
    const primaryRec = currentScan.recommendations?.[0];
    const hydrationPart = m.hydration ? `Hydration is at ${m.hydration}%` : 'Biomarkers registered';
    const texturePart = m.texture ? `with surface texture index of ${m.texture}/100.` : 'ready for clinical tracking.';
    const recPart = primaryRec ? ` AI Recommendation: ${primaryRec}` : ' Maintain your current daily skin regimen.';
    aiSummaryText = `${hydrationPart} ${texturePart}${recPart}`;
  } else {
    aiSummaryText = 'Welcome to Medivo Health Intelligence. Complete a 10-second facial biometric scan to compute your 15 clinical skin attributes, establish your baseline score, and unlock tailored daily routines.';
  }

  // 5. Dynamic Metrics
  const metrics = currentScan?.metrics;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Identity Bar */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting()}, {firstName} 👋</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => onNavigate('profile')} activeOpacity={0.85}>
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Score Card */}
      <TouchableOpacity
        style={styles.heroCard}
        onPress={() => onNavigate(hasScans ? 'scanReport' : 'faceMatch')}
        activeOpacity={0.85}
      >
        <View style={styles.heroTop}>
          <Text style={styles.heroTag}>YOUR AI HEALTH SCORE</Text>
          <View style={styles.inspectBadge}>
            <Text style={styles.inspectBadgeText}>
              {hasScans ? 'Inspect Report ›' : 'Start First Scan ›'}
            </Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreNumber, !hasScans && styles.scorePlaceholder]}>
            {hasScans ? score : '--'}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.trendBadge, { backgroundColor: trendInfo.bg }]}>
            <Feather name={trendInfo.icon} size={13} color={trendInfo.color} />
            <Text style={[styles.trendText, { color: trendInfo.color }]}>{trendInfo.text}</Text>
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
          <Text style={styles.aiTitle}>
            {hasScans ? "Today's AI Diagnostic Summary" : 'Getting Started with AI Health'}
          </Text>
        </View>
        <Text style={styles.aiText}>{aiSummaryText}</Text>
        {!hasScans && (
          <TouchableOpacity
            style={styles.ctaBannerBtn}
            onPress={() => onNavigate('faceMatch')}
            activeOpacity={0.85}
          >
            <Feather name="camera" size={14} color="#FFFFFF" />
            <Text style={styles.ctaBannerBtnText}>Take 10s Facial Scan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Action Hubs Grid */}
      <Text style={styles.sectionTitle}>Quick Platform Hubs</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('faceMatch')}>
          <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
            <Feather name="camera" size={20} color="#4338CA" />
          </View>
          <Text style={styles.actionLabel}>AI Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate(hasScans ? 'scanReport' : 'faceMatch')}>
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

      {/* Health Telemetry Grid */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Health Telemetry</Text>
        <TouchableOpacity onPress={() => onNavigate(hasScans ? 'scanReport' : 'faceMatch')}>
          <Text style={styles.viewAllText}>{hasScans ? 'View All 15 ›' : 'Start Scan ›'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.metricsGrid}
        onPress={() => onNavigate(hasScans ? 'scanReport' : 'faceMatch')}
        activeOpacity={0.85}
      >
        <View style={styles.metricCard}>
          <Feather name="droplet" size={18} color="#0EA5E9" />
          <Text style={styles.metricLabel}>Hydration</Text>
          <Text style={styles.metricVal}>
            {hasScans && metrics?.hydration != null ? `${metrics.hydration}%` : '--%'}
          </Text>
          <Text style={styles.metricSub}>
            {hasScans && metrics?.hydration != null ? 'Stratum Corneum' : 'Awaiting Scan'}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Feather name="sun" size={18} color="#D97706" />
          <Text style={styles.metricLabel}>Melanin / Spots</Text>
          <Text style={styles.metricVal}>
            {hasScans && (metrics?.pigmentation != null || metrics?.spots != null)
              ? `${metrics.pigmentation ?? metrics.spots}/100`
              : '--'}
          </Text>
          <Text style={styles.metricSub}>
            {hasScans && (metrics?.pigmentation != null || metrics?.spots != null) ? 'Uniformity Index' : 'Awaiting Scan'}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Feather name="moon" size={18} color="#7C3AED" />
          <Text style={styles.metricLabel}>Dark Circles</Text>
          <Text style={styles.metricVal}>
            {hasScans && metrics?.darkCircles != null ? `${metrics.darkCircles}/100` : '--'}
          </Text>
          <Text style={styles.metricSub}>
            {hasScans && metrics?.darkCircles != null ? 'Periorbital Tone' : 'Awaiting Scan'}
          </Text>
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
  scorePlaceholder: { color: '#94A3B8' },
  scoreMax: { fontSize: 16, color: '#78716C', marginLeft: 4 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  trendText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  gradeBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  gradeBadgeText: { color: '#4338CA', fontSize: 11, fontWeight: '700' },
  aiCard: { backgroundColor: '#EEF2FF', padding: 18, borderRadius: 20, marginBottom: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  aiTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B', marginLeft: 6 },
  aiText: { fontSize: 13, color: '#44403C', lineHeight: 20 },
  ctaBannerBtn: {
    marginTop: 12,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  ctaBannerBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#4338CA' },
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  actionBtn: { alignItems: 'center' },
  actionIcon: { width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#57534E' },
  metricsGrid: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: '#F1F0F7' },
  metricLabel: { fontSize: 11, color: '#78716C', marginTop: 8 },
  metricVal: { fontSize: 18, fontWeight: '700', color: '#1E1B4B', marginTop: 2 },
  metricSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
});
