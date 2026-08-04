import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface HistoryScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const historyGroups = [
    {
      month: 'July 2026',
      entries: [
        { date: 'Jul 28', time: '09:15 AM', score: 87, delta: '+4', tag: 'Hydration Peak' },
        { date: 'Jul 21', time: '08:30 AM', score: 83, delta: '+2', tag: 'Routine Adjusted' },
        { date: 'Jul 14', time: '09:00 AM', score: 81, delta: '+1', tag: 'Barrier Recovery' },
      ],
    },
    {
      month: 'June 2026',
      entries: [
        { date: 'Jun 30', time: '08:45 AM', score: 80, delta: '+3', tag: 'Initial Scan' },
        { date: 'Jun 22', time: '09:30 AM', score: 77, delta: '0', tag: 'Baseline Baseline' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History & Trends</Text>
        <Text style={styles.headerSub}>Track your skin health progress over time</Text>
      </View>

      {/* Progress Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryTag}>30-DAY PROGRESS</Text>
            <Text style={styles.summaryVal}>+10 Points</Text>
          </View>
          <View style={styles.badgeBox}>
            <Feather name="trending-up" size={16} color="#059669" />
            <Text style={styles.badgeText}>Consistent Improvement</Text>
          </View>
        </View>

        {/* Sparkline Visualiser */}
        <View style={styles.chartContainer}>
          <View style={styles.chartBarGroup}>
            {[77, 80, 81, 83, 87].map((val, idx) => (
              <View key={idx} style={styles.barItem}>
                <View style={[styles.barFill, { height: `${(val / 100) * 80}%` }]} />
                <Text style={styles.barLabel}>{['Jun 22', 'Jun 30', 'Jul 14', 'Jul 21', 'Jul 28'][idx]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Historical Timeline Groups */}
      {historyGroups.map((group, gIdx) => (
        <View key={gIdx} style={styles.groupContainer}>
          <Text style={styles.groupMonth}>{group.month}</Text>
          {group.entries.map((entry, eIdx) => (
            <TouchableOpacity
              key={eIdx}
              style={styles.entryCard}
              onPress={() => onNavigate('scanReport')}
              activeOpacity={0.7}
            >
              <View style={styles.entryLeft}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{entry.score}</Text>
                </View>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryDate}>{entry.date} · {entry.time}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{entry.tag}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.entryRight}>
                <Text style={styles.deltaText}>{entry.delta}</Text>
                <Feather name="chevron-right" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  summaryCard: { backgroundColor: '#4338CA', padding: 20, borderRadius: 24, marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryTag: { fontSize: 10, fontWeight: '700', color: '#C7D2FE', letterSpacing: 1 },
  summaryVal: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  badgeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#059669', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  chartContainer: { height: 100, justifyContent: 'flex-end', paddingTop: 10 },
  chartBarGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' },
  barItem: { alignItems: 'center', flex: 1 },
  barFill: { width: 14, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 7 },
  barLabel: { color: '#C7D2FE', fontSize: 9, marginTop: 6, fontWeight: '600' },
  groupContainer: { marginBottom: 20 },
  groupMonth: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 10 },
  entryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#EEF0F7' },
  entryLeft: { flexDirection: 'row', alignItems: 'center' },
  scoreCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  scoreText: { color: '#4338CA', fontWeight: '800', fontSize: 16 },
  entryMeta: { marginLeft: 12 },
  entryDate: { fontSize: 13, fontWeight: '700', color: '#1E1B4B' },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  tagText: { color: '#475569', fontSize: 10, fontWeight: '600' },
  entryRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deltaText: { color: '#059669', fontWeight: '700', fontSize: 13 },
});
