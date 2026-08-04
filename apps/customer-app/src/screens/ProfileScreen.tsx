import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function ProfileScreen() {
  const [hipaaConsent, setHipaaConsent] = useState(true);
  const [appleHealth, setAppleHealth] = useState(true);
  const [googleFit, setGoogleFit] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile & Settings</Text>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SJ</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>Sarah Jenkins</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>Pro</Text>
            </View>
          </View>
          <Text style={styles.userEmail}>sarah.j@example.com</Text>
          <Text style={styles.userScore}>Health Score: 87 · Combination Skin</Text>
        </View>
      </View>

      {/* HIPAA Privacy Settings */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Feather name="shield" size={18} color="#059669" />
          <Text style={styles.cardTitle}>HIPAA Privacy & AI Consent</Text>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>AI Analysis Data Consent</Text>
          <Switch value={hipaaConsent} onValueChange={setHipaaConsent} trackColor={{ true: '#10B981', false: '#CBD5E1' }} />
        </View>
      </View>

      {/* Connected Integrations */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Feather name="lock" size={18} color="#0EA5E9" />
          <Text style={styles.cardTitle}>Health Devices & Integrations</Text>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Apple HealthKit Sync</Text>
          <Switch value={appleHealth} onValueChange={setAppleHealth} trackColor={{ true: '#4338CA', false: '#CBD5E1' }} />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Google Fit Sync</Text>
          <Switch value={googleFit} onValueChange={setGoogleFit} trackColor={{ true: '#4338CA', false: '#CBD5E1' }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E1B4B', marginBottom: 16 },
  userCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#F1F0F7' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  userInfo: { marginLeft: 16, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: '#1E1B4B' },
  proBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  proText: { color: '#4338CA', fontSize: 10, fontWeight: '700' },
  userEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  userScore: { fontSize: 12, fontWeight: '600', color: '#059669', marginTop: 4 },
  sectionCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F0F7' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B', marginLeft: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  switchLabel: { fontSize: 13, color: '#334155', fontWeight: '600' },
});
