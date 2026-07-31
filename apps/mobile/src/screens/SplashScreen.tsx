import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface SplashScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

const { width } = Dimensions.get('window');

export function SplashScreen({ onNavigate }: SplashScreenProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const slides = [
    {
      title: 'AI Clinical Skin Telemetry',
      desc: 'Instant face-match analysis tracking hydration, texture, pigmentation, and barrier health in real-time.',
      icon: 'camera',
      color: '#4338CA',
      bg: '#EEF2FF',
    },
    {
      title: 'Personalized Regimen Tracking',
      desc: 'Tailored morning and evening routines with consistency streaks to lock in long-term skin health.',
      icon: 'check-square',
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      title: '24/7 Board-Certified Telehealth',
      desc: 'Direct video consultations with licensed dermatologists and custom digital prescription delivery.',
      icon: 'user-check',
      color: '#0284C7',
      bg: '#E0F2FE',
    },
  ];

  function handleGetStarted() {
    if (!acceptedTerms) {
      setErrorMsg('Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }
    setErrorMsg('');
    onNavigate('dashboard');
  }

  return (
    <View style={styles.container}>
      {/* Top Brand Banner */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Feather name="activity" size={20} color="#4338CA" />
        </View>
        <Text style={styles.brandName}>Medivo Health</Text>
      </View>

      {/* Onboarding Carousel */}
      <View style={styles.carouselBox}>
        <View style={[styles.slideCard, { backgroundColor: slides[activeSlide].bg }]}>
          <View style={styles.iconCircle}>
            <Feather name={slides[activeSlide].icon as any} size={44} color={slides[activeSlide].color} />
          </View>
          <Text style={styles.slideTitle}>{slides[activeSlide].title}</Text>
          <Text style={styles.slideDesc}>{slides[activeSlide].desc}</Text>
        </View>

        {/* Carousel Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.dot, activeSlide === idx && styles.dotActive]}
              onPress={() => setActiveSlide(idx)}
            />
          ))}
        </View>
      </View>

      {/* Mandatory Terms & Privacy Checkbox */}
      <View style={styles.termsBox}>
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
        
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
            {acceptedTerms && <Feather name="check" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsLabel}>
            I agree to the{' '}
            <Text style={styles.linkText} onPress={() => onNavigate('privacyPolicy')}>
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text style={styles.linkText} onPress={() => onNavigate('privacyPolicy')}>
              Privacy Policy
            </Text>.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Primary Action Buttons */}
      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.authRow}>
          <TouchableOpacity onPress={() => onNavigate('login')}>
            <Text style={styles.authText}>Log In</Text>
          </TouchableOpacity>
          <Text style={styles.dividerText}>·</Text>
          <TouchableOpacity onPress={() => onNavigate('register')}>
            <Text style={styles.authText}>Register Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC', padding: 24, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  logoBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  brandName: { fontSize: 20, fontWeight: '800', color: '#1E1B4B', marginLeft: 10 },
  carouselBox: { alignItems: 'center', marginVertical: 20 },
  slideCard: { width: width - 48, padding: 28, borderRadius: 28, alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  slideTitle: { fontSize: 20, fontWeight: '800', color: '#1E1B4B', textAlign: 'center', marginBottom: 10 },
  slideDesc: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20 },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E1' },
  dotActive: { width: 24, backgroundColor: '#4338CA' },
  termsBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#EEF0F7' },
  errorText: { color: '#DC2626', fontSize: 11, fontWeight: '600', marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#94A3B8', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  termsLabel: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },
  linkText: { color: '#4338CA', fontWeight: '700', textDecorationLine: 'underline' },
  actionGroup: { gap: 14, marginBottom: 10 },
  getStartedBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  getStartedText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, marginRight: 8 },
  authRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  authText: { color: '#4338CA', fontSize: 14, fontWeight: '700' },
  dividerText: { color: '#94A3B8', fontSize: 16 },
});
