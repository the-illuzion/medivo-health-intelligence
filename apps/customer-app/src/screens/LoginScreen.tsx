import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface LoginScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('sarah.j@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  function handleLogin() {
    onNavigate('dashboard');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('splash')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.heroBox}>
        <View style={styles.iconCircle}>
          <Feather name="lock" size={32} color="#4338CA" />
        </View>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your AI health diagnostic telemetry</Text>
      </View>

      {/* Form Controls */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputBox}>
          <Feather name="mail" size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputBox}>
          <Feather name="lock" size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsRow}>
          <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Feather name="check" size={12} color="#FFFFFF" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginBtnText}>Sign In to Dashboard</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Biometric Trigger */}
        <TouchableOpacity style={styles.bioBtn} onPress={handleLogin}>
          <Feather name="aperture" size={20} color="#4338CA" />
          <Text style={styles.bioBtnText}>Sign in with Biometrics / Face ID</Text>
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => onNavigate('register')}>
          <Text style={styles.registerLink}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  heroBox: { alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E1B4B', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  formCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#1E1B4B', marginBottom: 8, marginTop: 12 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0F172A' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#94A3B8', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  checkboxActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  rememberText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  forgotText: { fontSize: 12, color: '#4338CA', fontWeight: '700' },
  loginBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  loginBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, marginRight: 8 },
  bioBtn: { backgroundColor: '#EEF2FF', paddingVertical: 14, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bioBtnText: { color: '#4338CA', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14, color: '#64748B' },
  registerLink: { fontSize: 14, color: '#4338CA', fontWeight: '700' },
});
