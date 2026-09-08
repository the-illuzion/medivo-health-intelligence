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

  const hasHistory = scanHistory && scanHistory.length > 0;
  const latestScore = hasHistory ? scanHistory[0].overallScore : 0;
  const baselineScore = hasHistory ? scanHistory[scanHistory.length - 1].overallScore : 0;
  const scoreDelta = latestScore - baselineScore;

  // Last 7 scans in chronological order (oldest to newest) for chart
  const recentChronologicalScans = hasHistory ? [...scanHistory.slice(0, 7)].reverse() : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Scan History & Trends</Text>
          <Text style={styles.headerSub}>Track your skin health progress over time</Text>
        </View>
        <TouchableOpacity style={styles.newScanBtn} onPress={() => onNavigate('faceMatch')} activeOpacity={0.85}>
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.newScanBtnText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      {isLoadingHistory && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#4338CA" />
          <Text style={styles.loadingText}>Syncing scan telemetry records...</Text>
        </View>
      )}

      {/* Dynamic Summary Card (Only when scans exist) */}
      {hasHistory ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryTag}>
                {scanHistory.length === 1 ? 'INITIAL BASELINE' : 'LIFETIME PROGRESS'}
              </Text>
              <Text style={styles.summaryVal}>
                {scanHistory.length === 1
                  ? `${latestScore} Points`
                  : `${scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} Points`}
              </Text>
            </View>
            <View style={styles.badgeBox}>
              {scanHistory.length === 1 ? (
                <>
                  <Feather name="check-circle" size={14} color="#059669" />
                  <Text style={styles.badgeText}>1 Scan Recorded</Text>
                </>
              ) : scoreDelta > 0 ? (
                <>
                  <Feather name="trending-up" size={14} color="#059669" />
                  <Text style={styles.badgeText}>Consistent Improvement</Text>
                </>
              ) : scoreDelta < 0 ? (
                <>
                  <Feather name="trending-down" size={14} color="#D97706" />
                  <Text style={[styles.badgeText, { color: '#D97706' }]}>Monitoring Flux</Text>
                </>
              ) : (
                <>
                  <Feather name="minus" size={14} color="#4338CA" />
                  <Text style={[styles.badgeText, { color: '#4338CA' }]}>Stable Baseline</Text>
                </>
              )}
            </View>
          </View>

          {/* Sparkline Visualiser */}
          <View style={styles.chartContainer}>
            <View style={styles.chartBarGroup}>
              {recentChronologicalScans.map((scanItem, idx) => {
                const scanDate = new Date(scanItem.scannedAt);
                const shortDate = scanDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                const barPercent = Math.min(100, Math.max(25, (scanItem.overallScore / 100) * 80));

                return (
                  <View key={scanItem.id || idx} style={styles.barItem}>
                    <Text style={styles.barTopScore}>{scanItem.overallScore}</Text>
                    <View style={[styles.barFill, { height: `${barPercent}%` }]} />
                    <Text style={styles.barLabel}>{shortDate}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      ) : null}

      {/* Dynamic Scan List or Empty State */}
      {hasHistory ? (
        <>
          <Text style={styles.sectionTitle}>Historical AI Scans ({scanHistory.length})</Text>
          <View style={styles.historyList}>
            {scanHistory.map((entry, idx) => {
              const dateObj = new Date(entry.scannedAt);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const tag =
                entry.grade ||
                (entry.overallScore >= 85
                  ? 'Optimal Grade'
                  : entry.overallScore >= 70
                  ? 'Good Condition'
                  : 'Attention Advised');

              const scoreColor =
                entry.overallScore >= 85 ? '#059669' : entry.overallScore >= 70 ? '#4338CA' : '#D97706';
              const scoreBg =
                entry.overallScore >= 85 ? '#D1FAE5' : entry.overallScore >= 70 ? '#EEF2FF' : '#FEF3C7';

              return (
                <TouchableOpacity
                  key={entry.id || idx}
                  style={styles.entryCard}
                  onPress={() => handleSelectScan(entry)}
                  activeOpacity={0.75}
                >
                  <View style={styles.entryLeft}>
                    <View style={[styles.scoreCircle, { backgroundColor: scoreBg }]}>
                      <Text style={[styles.scoreText, { color: scoreColor }]}>{entry.overallScore}</Text>
                    </View>
                    <View style={styles.entryMeta}>
                      <Text style={styles.entryDate}>{formattedDate} · {formattedTime}</Text>
                      <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.entryRight}>
                    <Text style={styles.deltaText}>
                      {entry.metrics?.hydration != null
                        ? `Hydration ${entry.metrics.hydration}%`
                        : `${entry.overallScore}/100`}
                    </Text>
                    <Feather name="chevron-right" size={18} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : !isLoadingHistory ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <Feather name="clock" size={32} color="#4338CA" />
          </View>
          <Text style={styles.emptyTitle}>No Scan History Yet</Text>
          <Text style={styles.emptySub}>
            Take your first 10-second facial biometric scan to compute your 15 clinical skin attributes, track dermal
            age, and observe telemetry evolutions over time.
          </Text>
          <TouchableOpacity
            style={styles.emptyScanBtn}
            onPress={() => onNavigate('faceMatch')}
            activeOpacity={0.85}
          >
            <Feather name="camera" size={16} color="#FFFFFF" />
            <Text style={styles.emptyScanBtnText}>Take First AI Scan</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: { color: '#059669', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  chartContainer: { height: 100, justifyContent: 'flex-end', paddingTop: 10 },
  chartBarGroup: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
  barItem: { alignItems: 'center', flex: 1 },
  barTopScore: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  barFill: { width: 18, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 8 },
  barLabel: { color: '#C7D2FE', fontSize: 10, marginTop: 6, fontWeight: '700' },
  loadingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  loadingText: { color: '#64748B', fontSize: 13, marginLeft: 8 },
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
  entryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { fontWeight: '800', fontSize: 16 },
  entryMeta: { marginLeft: 12, flex: 1 },
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F7',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  emptyScanBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 6 },
});
