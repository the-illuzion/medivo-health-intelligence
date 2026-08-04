import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface RegisterScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [hipaaConsent, setHipaaConsent] = useState(true);

  const skinTypes = ['Combination', 'Oily', 'Dry', 'Sensitive'];

  function handleRegister() {
    onNavigate('dashboard');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('login')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.heroBox}>
        <Text style={styles.title}>Join Medivo Health</Text>
        <Text style={styles.subtitle}>Set up your personal profile to start real-time AI skin diagnostics</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputBox}>
          <Feather name="user" size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Sarah Jenkins"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputBox}>
          <Feather name="mail" size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="sarah@example.com"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputBox}>
          <Feather name="lock" size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Min 8 characters"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Primary Skin Type Selector */}
        <Text style={styles.label}>Primary Skin Type</Text>
        <View style={styles.skinGroup}>
          {skinTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.skinPill, skinType === type && styles.skinPillActive]}
              onPress={() => setSkinType(type)}
            >
              <Text style={[styles.skinText, skinType === type && styles.skinTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HIPAA Consent Switch */}
        <View style={styles.consentRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.consentTitle}>HIPAA AI Diagnostic Consent</Text>
            <Text style={styles.consentSub}>Allow AI analysis of camera scans for clinical skin telemetry.</Text>
          </View>
          <Switch
            value={hipaaConsent}
            onValueChange={setHipaaConsent}
            trackColor={{ true: '#10B981', false: '#CBD5E1' }}
          />
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
          <Text style={styles.registerBtnText}>Complete Registration</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => onNavigate('login')}>
          <Text style={styles.loginLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  heroBox: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E1B4B' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  formCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#1E1B4B', marginBottom: 8, marginTop: 12 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0F172A' },
  skinGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  skinPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F1F5F9' },
  skinPillActive: { backgroundColor: '#4338CA' },
  skinText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  skinTextActive: { color: '#FFFFFF' },
  consentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 20, padding: 12, backgroundColor: '#ECFDF5', borderRadius: 16 },
  consentTitle: { fontSize: 13, fontWeight: '700', color: '#065F46' },
  consentSub: { fontSize: 11, color: '#047857', marginTop: 2 },
  registerBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginRight: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14, color: '#64748B' },
  loginLink: { fontSize: 14, color: '#4338CA', fontWeight: '700' },
});
