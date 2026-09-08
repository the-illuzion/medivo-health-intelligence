import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { useAuthStore } from '../store/useAuthStore';
import { useScanStore } from '../store/useScanStore';

interface ProfileScreenProps {
  onNavigate?: (screen: ScreenKey) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, logout } = useAuthStore();
  const { activeScan, scanHistory } = useScanStore();
  const [hipaaConsent, setHipaaConsent] = useState(user?.hipaaConsent ?? true);
  const [appleHealth, setAppleHealth] = useState(false);
  const [googleFit, setGoogleFit] = useState(false);

  const rawName = user?.name?.trim() || 'Patient Member';
  const initials = rawName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'MP';

  const userEmail = user?.email || 'patient@medivo.health';
  const skinType = user?.skinType || 'Combination';
  const latestScan = activeScan || (scanHistory.length > 0 ? scanHistory[0] : null);
  const scoreText = latestScan ? `Health Score: ${latestScan.overallScore} · ${skinType} Skin` : `${skinType} Skin Profile`;

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile & Settings</Text>
        {onNavigate && (
          <TouchableOpacity style={styles.editBtn} onPress={() => onNavigate('editProfile')}>
            <Feather name="edit-2" size={14} color="#4338CA" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{rawName}</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>Member</Text>
            </View>
          </View>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <Text style={styles.userScore}>{scoreText}</Text>
        </View>
      </View>

      {/* HIPAA Privacy Settings */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Feather name="shield" size={18} color="#059669" />
          <Text style={styles.cardTitle}>HIPAA Privacy & AI Consent</Text>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>AI Biometric Telemetry Consent</Text>
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

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Feather name="log-out" size={16} color="#DC2626" />
        <Text style={styles.logoutBtnText}>Sign Out</Text>
      </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  editBtnText: { color: '#4338CA', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  sectionCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F0F7' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B', marginLeft: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  switchLabel: { fontSize: 13, color: '#334155', fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  logoutBtnText: { color: '#DC2626', fontSize: 14, fontWeight: '700', marginLeft: 8 },
});
