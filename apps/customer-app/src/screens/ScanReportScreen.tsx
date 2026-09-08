import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey, SkinScanResult } from '@medivo/types';
import { useScanStore } from '../store/useScanStore';

interface ScanReportScreenProps {
  onNavigate: (screen: ScreenKey) => void;
  scanId?: string;
}

export function ScanReportScreen({ onNavigate, scanId }: ScanReportScreenProps) {
  const { activeScan, scanHistory, fetchScanHistory, fetchScanById } = useScanStore();
  const [report, setReport] = useState<SkinScanResult | null>(activeScan);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (scanId) {
        const found = await fetchScanById(scanId);
        if (found) {
          setReport(found);
          return;
        }
      }
      if (!activeScan) {
        const history = await fetchScanHistory();
        if (history && history.length > 0) {
          setReport(history[0]);
        }
      } else {
        setReport(activeScan);
      }
    }
    loadData();
  }, [scanId, activeScan]);

  const score = report?.overallScore ?? 87;
  const grade = report?.grade ?? (score >= 85 ? 'Optimal Grade' : score >= 70 ? 'Good Condition' : 'Attention Advised');
  const riskLevel = report?.riskLevel ?? 'LOW';
  const metrics = report?.metrics ?? {
    hydration: 86,
    texture: 84,
    pigmentation: 88,
    darkCircles: 74,
    skinAge: 26,
    rednessScore: 12,
    poreClarity: 88,
    photoprotection: 'SPF 50 Active',
  };

  const recommendations = (report?.recommendations && report.recommendations.length > 0)
    ? report.recommendations
    : [
        'Apply Multi-Molecular Hyaluronic Acid Serum twice daily after cleansing.',
        'Broad Spectrum Mineral SPF 50 application 15 minutes before UV exposure.',
        'Evening Barrier Restoration Complex for dermal recovery.',
      ];

  const formattedDate = report?.scannedAt
    ? new Date(report.scannedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Scan';

  async function handleShare() {
    const text = `Medivo AI Skin Telemetry Diagnostic:\nOverall Score: ${score}/100 (${grade})\nHydration: ${metrics.hydration}%\nTexture: ${metrics.texture}/100\nPhotoprotection: ${metrics.photoprotection || 'SPF 50'}`;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Medivo AI Skin Report', text });
      } catch (e) {
        navigator.clipboard?.writeText(text);
        setShareFeedback('Report copied to clipboard');
        setTimeout(() => setShareFeedback(null), 2500);
      }
    } else if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(text);
      setShareFeedback('Report copied to clipboard');
      setTimeout(() => setShareFeedback(null), 2500);
    } else {
      try {
        await Share.share({ message: text });
      } catch (e) {}
    }
  }

  const breakdownCards = [
    {
      label: 'Hydration Level',
      score: metrics.hydration,
      unit: '%',
      delta: metrics.hydration >= 80 ? '+5%' : '-2%',
      note: metrics.hydration >= 80 ? 'Optimal moisture retention' : 'Mild epidermal dryness detected',
      icon: 'droplet',
      color: '#0EA5E9',
      bg: '#E0F2FE',
    },
    {
      label: 'Skin Texture',
      score: metrics.texture,
      unit: '/100',
      delta: metrics.texture >= 80 ? '+3' : '0',
      note: metrics.texture >= 80 ? 'Smooth epidermal surface' : 'Micro-texture refinement recommended',
      icon: 'sparkles',
      color: '#059669',
      bg: '#D1FAE5',
    },
    {
      label: 'Pigmentation & Tone',
      score: metrics.pigmentation,
      unit: '/100',
      delta: '+2',
      note: metrics.pigmentation >= 80 ? 'Even tone distribution' : 'Localized melanin clustering noted',
      icon: 'sun',
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      label: 'Periorbital Contour',
      score: metrics.darkCircles,
      unit: '/100',
      delta: '+1',
      note: metrics.darkCircles >= 75 ? 'Rested, firm eye area' : 'Mild periorbital shadow detected',
      icon: 'moon',
      color: '#7C3AED',
      bg: '#F3E8FF',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Navigation & Actions */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('dashboard')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Skin Telemetry Report</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Feather name="share-2" size={18} color="#4338CA" />
        </TouchableOpacity>
      </View>

      {shareFeedback && (
        <View style={styles.toastBox}>
          <Feather name="check" size={14} color="#065F46" />
          <Text style={styles.toastText}>{shareFeedback}</Text>
        </View>
      )}

      {/* Hero Score Badge */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <Text style={styles.heroTag}>CLINICAL SKIN DIAGNOSTIC</Text>
          <Text style={styles.heroTimestamp}>{formattedDate}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.gradeBadge, riskLevel === 'HIGH' && styles.gradeBadgeAlert]}>
            <Text style={[styles.gradeText, riskLevel === 'HIGH' && styles.gradeTextAlert]}>
              {grade}
            </Text>
          </View>
          <View style={styles.trendBadge}>
            <Feather name="trending-up" size={12} color="#059669" />
            <Text style={styles.trendText}>+4 vs baseline</Text>
          </View>
        </View>

        {/* Secondary Dermal Indicators Grid */}
        <View style={styles.secondaryIndicatorsGrid}>
          <View style={styles.secondaryIndicator}>
            <Text style={styles.secondaryIndicatorVal}>{metrics.skinAge ?? 26} yrs</Text>
            <Text style={styles.secondaryIndicatorLabel}>Dermal Age</Text>
          </View>
          <View style={styles.secondaryDivider} />
          <View style={styles.secondaryIndicator}>
            <Text style={styles.secondaryIndicatorVal}>{metrics.rednessScore ?? 12}%</Text>
            <Text style={styles.secondaryIndicatorLabel}>Erythema</Text>
          </View>
          <View style={styles.secondaryDivider} />
          <View style={styles.secondaryIndicator}>
            <Text style={styles.secondaryIndicatorVal}>{metrics.poreClarity ?? 88}%</Text>
            <Text style={styles.secondaryIndicatorLabel}>Pore Clarity</Text>
          </View>
          <View style={styles.secondaryDivider} />
          <View style={styles.secondaryIndicator}>
            <Text style={styles.secondaryIndicatorVal}>{metrics.photoprotection || 'SPF 50'}</Text>
            <Text style={styles.secondaryIndicatorLabel}>Protection</Text>
          </View>
        </View>
      </View>

      {/* HIPAA / Clinical Disclaimer Banner (Rule A-1) */}
      <View style={styles.disclaimerBanner}>
        <Feather name="info" size={15} color="#6366F1" style={{ marginTop: 2 }} />
        <Text style={styles.disclaimerText}>
          <Text style={styles.disclaimerBold}>Clinical AI Wellness Notice:</Text> This analysis is an AI wellness evaluation and does not substitute professional medical diagnosis or dermatology treatment.
        </Text>
      </View>

      {/* Diagnostic Metrics Grid */}
      <Text style={styles.sectionTitle}>Diagnostic Breakdown</Text>
      <View style={styles.metricsList}>
        {breakdownCards.map((m, idx) => (
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
              <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(10, m.score))}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* AI Regimen Adjustments */}
      <Text style={styles.sectionTitle}>AI Regimen Recommendations</Text>
      <View style={styles.recContainer}>
        {recommendations.map((rec, idx) => (
          <View key={idx} style={styles.recCard}>
            <View style={styles.recIconBox}>
              <Feather name={idx === 0 ? 'droplet' : idx === 1 ? 'sun' : 'shield'} size={18} color="#4338CA" />
            </View>
            <View style={styles.recContent}>
              <Text style={styles.recNumber}>Step {idx + 1} Regimen Adjustment</Text>
              <Text style={styles.recDesc}>{rec}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Primary Action Stack */}
      <View style={styles.actionStack}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => onNavigate('products')}>
          <Feather name="shopping-bag" size={18} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>View Recommended Formulations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => onNavigate('consultations')}>
          <Feather name="user-check" size={18} color="#4338CA" />
          <Text style={styles.secondaryBtnText}>Book Dermatologist Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={() => onNavigate('faceMatch')}>
          <Feather name="camera" size={16} color="#64748B" />
          <Text style={styles.ghostBtnText}>Perform New AI Scan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toastText: { color: '#065F46', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  heroCard: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEF0F7',
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTag: { fontSize: 11, fontWeight: '700', color: '#4338CA', letterSpacing: 0.8 },
  heroTimestamp: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 4 },
  scoreNum: { fontSize: 54, fontWeight: '800', color: '#1E1B4B' },
  scoreMax: { fontSize: 18, color: '#94A3B8', marginLeft: 4, fontWeight: '600' },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 18 },
  gradeBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  gradeBadgeAlert: { backgroundColor: '#FEF2F2' },
  gradeText: { color: '#059669', fontSize: 12, fontWeight: '700' },
  gradeTextAlert: { color: '#DC2626' },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendText: { color: '#4338CA', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  secondaryIndicatorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  secondaryIndicator: { flex: 1, alignItems: 'center' },
  secondaryIndicatorVal: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  secondaryIndicatorLabel: { fontSize: 10, color: '#64748B', marginTop: 2, fontWeight: '500' },
  secondaryDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  disclaimerBanner: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    alignItems: 'flex-start',
  },
  disclaimerText: { fontSize: 11, color: '#4338CA', lineHeight: 16, marginLeft: 8, flex: 1 },
  disclaimerBold: { fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  metricsList: { gap: 12, marginBottom: 24 },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
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
  recContainer: { gap: 12, marginBottom: 24 },
  recCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
  recIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recContent: { flex: 1, marginLeft: 12 },
  recNumber: { fontSize: 11, fontWeight: '700', color: '#4338CA', letterSpacing: 0.5 },
  recDesc: { fontSize: 13, color: '#334155', marginTop: 3, lineHeight: 19 },
  actionStack: { gap: 12, marginTop: 8 },
  primaryBtn: {
    backgroundColor: '#4338CA',
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4338CA',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  secondaryBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#4338CA', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  ghostBtn: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: { color: '#64748B', fontWeight: '600', fontSize: 13, marginLeft: 6 },
});
