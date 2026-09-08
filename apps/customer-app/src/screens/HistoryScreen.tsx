import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey, SkinScanResult } from '@medivo/types';
import { useScanStore } from '../store/useScanStore';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const { scanHistory, isLoadingHistory, fetchScanHistory, setActiveScan } = useScanStore();

  useEffect(() => {
    fetchScanHistory();
  }, []);

  function handleSelectScan(scan: SkinScanResult) {
    setActiveScan(scan);
    onNavigate('scanReport');
  }

  // Fallback seed entries if history is empty
  const fallbackEntries: SkinScanResult[] = [
    {
      id: 'scan-hist-1',
      userId: 'usr-demo',
      overallScore: 87,
      grade: 'Optimal Grade',
      metrics: {
        hydration: 86,
        oiliness: 58,
        texture: 84,
        poreClarity: 88,
        pigmentation: 88,
        wrinkles: 86,
        acneScore: 92,
        darkCircles: 74,
        eyeBags: 78,
        rednessScore: 12,
        firmness: 85,
        radiance: 87,
        skinAge: 26,
        skinType: 'Combination',
        barrierHealth: 92,
      },
      recommendations: ['Apply Hyaluronic Serum', 'Daily SPF 50 Application'],
      scannedAt: new Date().toISOString(),
    },
    {
      id: 'scan-hist-2',
      userId: 'usr-demo',
      overallScore: 83,
      grade: 'Good Condition',
      metrics: {
        hydration: 80,
        oiliness: 62,
        texture: 81,
        poreClarity: 82,
        pigmentation: 85,
        wrinkles: 83,
        acneScore: 88,
        darkCircles: 72,
        eyeBags: 75,
        rednessScore: 14,
        firmness: 82,
        radiance: 84,
        skinAge: 27,
        skinType: 'Combination',
        barrierHealth: 88,
      },
      recommendations: ['Incorporate Barrier Emulsion', 'Hydra-Gel Eye Contour'],
      scannedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'scan-hist-3',
      userId: 'usr-demo',
      overallScore: 81,
      grade: 'Good Condition',
      metrics: {
        hydration: 78,
        oiliness: 65,
        texture: 79,
        poreClarity: 80,
        pigmentation: 84,
        wrinkles: 81,
        acneScore: 86,
        darkCircles: 70,
        eyeBags: 74,
        rednessScore: 16,
        firmness: 80,
        radiance: 82,
        skinAge: 27,
        skinType: 'Combination',
        barrierHealth: 86,
      },
      recommendations: ['Multi-Molecular Hyaluronic Acid'],
      scannedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];


  const displayHistory = scanHistory.length > 0 ? scanHistory : fallbackEntries;
  const recentScores = displayHistory.slice(0, 5).map((s) => s.overallScore).reverse();
  const latestScore = displayHistory[0]?.overallScore ?? 87;
  const baselineScore = displayHistory[displayHistory.length - 1]?.overallScore ?? 80;
  const scoreDelta = latestScore - baselineScore;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Scan History & Trends</Text>
          <Text style={styles.headerSub}>Track your skin health progress over time</Text>
        </View>
        <TouchableOpacity style={styles.newScanBtn} onPress={() => onNavigate('faceMatch')}>
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.newScanBtnText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryTag}>LIFETIME PROGRESS</Text>
            <Text style={styles.summaryVal}>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} Points</Text>
          </View>
          <View style={styles.badgeBox}>
            <Feather name="trending-up" size={16} color="#059669" />
            <Text style={styles.badgeText}>Consistent Improvement</Text>
          </View>
        </View>

        {/* Sparkline Visualiser */}
        <View style={styles.chartContainer}>
          <View style={styles.chartBarGroup}>
            {recentScores.map((val, idx) => (
              <View key={idx} style={styles.barItem}>
                <View style={[styles.barFill, { height: `${Math.min(100, Math.max(25, (val / 100) * 80))}%` }]} />
                <Text style={styles.barLabel}>{val}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {isLoadingHistory && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#4338CA" />
          <Text style={styles.loadingText}>Syncing scan telemetry records...</Text>
        </View>
      )}

      {/* Historical Timeline List */}
      <Text style={styles.sectionTitle}>Historical AI Scans ({displayHistory.length})</Text>
      <View style={styles.historyList}>
        {displayHistory.map((entry, idx) => {
          const dateObj = new Date(entry.scannedAt);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const tag = entry.grade || (entry.overallScore >= 85 ? 'Optimal Grade' : 'Good Condition');

          return (
            <TouchableOpacity
              key={entry.id || idx}
              style={styles.entryCard}
              onPress={() => handleSelectScan(entry)}
              activeOpacity={0.75}
            >
              <View style={styles.entryLeft}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{entry.overallScore}</Text>
                </View>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryDate}>{formattedDate} · {formattedTime}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.entryRight}>
                <Text style={styles.deltaText}>Hydration {entry.metrics?.hydration || 85}%</Text>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  newScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4338CA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  newScanBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  summaryCard: {
    backgroundColor: '#4338CA',
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#4338CA',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryTag: { fontSize: 10, fontWeight: '700', color: '#C7D2FE', letterSpacing: 1 },
  summaryVal: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#059669', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  chartContainer: { height: 90, justifyContent: 'flex-end', paddingTop: 10 },
  chartBarGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' },
  barItem: { alignItems: 'center', flex: 1 },
  barFill: { width: 16, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 8 },
  barLabel: { color: '#C7D2FE', fontSize: 10, marginTop: 6, fontWeight: '700' },
  loadingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  loadingText: { color: '#64748B', fontSize: 12, marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  historyList: { gap: 10 },
  entryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
  entryLeft: { flexDirection: 'row', alignItems: 'center' },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { color: '#4338CA', fontWeight: '800', fontSize: 16 },
  entryMeta: { marginLeft: 12 },
  entryDate: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagText: { color: '#475569', fontSize: 10, fontWeight: '600' },
  entryRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deltaText: { color: '#059669', fontWeight: '700', fontSize: 12 },
});
