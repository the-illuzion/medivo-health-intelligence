import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/useAuthStore';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  TextAction,
  Tile,
  s,
} from '../src/features/design-preview/components/UI';
import { colors as c } from '../src/features/design-preview/tokens';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    setErrorMessage('');
    const success = await register(name.trim(), email.trim(), password, skinType);
    if (success) {
      router.replace('/otp-verify');
    } else {
      setErrorMessage('Registration could not be completed. Please try again.');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={st.safe}>
      <ScrollView
        contentContainerStyle={[st.scrollContent, desktop && st.desktopScroll]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[st.cardContainer, desktop && st.desktopCard]}>
          {/* Header */}
          <View style={st.brandSection}>
            <View style={st.logoRow}>
              <Text style={st.logo}>medivo</Text>
              <Chip tone="blue" icon="heartpulse">
                Patient Portal
              </Chip>
            </View>
            <Copy size={11} color={c.muted} style={s.top4}>
              Health Intelligence for a Better You
            </Copy>
          </View>

          <View style={st.headerSection}>
            <Heading size={24}>Create patient account</Heading>
            <Copy size={13} color={c.muted} style={s.top4}>
              Join Medivo for AI-powered vitals monitoring, telemetry analysis, and daily care routines.
            </Copy>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <Card style={st.errorCard}>
              <Tile name="alert" tone="red" size={32} />
              <View style={s.flex}>
                <Heading size={13} style={{ color: c.red }}>
                  Registration Error
                </Heading>
                <Copy size={11} color={c.red} style={s.top4}>
                  {errorMessage}
                </Copy>
              </View>
            </Card>
          ) : null}

          {/* Form */}
          <Card style={st.formCard}>
            {/* Full Name */}
            <View style={st.inputGroup}>
              <Copy bold size={12} color={c.navy}>
                Full Name
              </Copy>
              <View style={st.inputWrapper}>
                <Tile name="user" tone="blue" size={30} />
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Alex Morgan"
                  placeholderTextColor="#8a99ad"
                  style={st.input}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={[st.inputGroup, { marginTop: 14 }]}>
              <Copy bold size={12} color={c.navy}>
                Email Address
              </Copy>
              <View style={st.inputWrapper}>
                <Tile name="file" tone="green" size={30} />
                <TextInput
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="patient@example.com"
                  placeholderTextColor="#8a99ad"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={st.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={[st.inputGroup, { marginTop: 14 }]}>
              <Copy bold size={12} color={c.navy}>
                Password (min. 6 characters)
              </Copy>
              <View style={st.inputWrapper}>
                <Tile name="lock" tone="purple" size={30} />
                <TextInput
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••••••"
                  placeholderTextColor="#8a99ad"
                  secureTextEntry
                  style={st.input}
                />
              </View>
            </View>

            {/* Primary Skin Type Selector */}
            <View style={[st.inputGroup, { marginTop: 14 }]}>
              <Copy bold size={12} color={c.navy}>
                Primary Skin Type
              </Copy>
              <View style={st.skinTypeRow}>
                {['Combination', 'Sensitive', 'Oily', 'Dry'].map((type) => {
                  const selected = skinType === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => setSkinType(type)}
                      style={[
                        st.skinTypeButton,
                        selected && st.skinTypeButtonActive,
                      ]}
                    >
                      <Copy
                        bold
                        size={11}
                        color={selected ? c.blue : c.muted}
                      >
                        {type}
                      </Copy>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Submit Action */}
            <Action
              onPress={handleRegister}
              disabled={isLoading}
              style={st.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator color={c.white} size="small" />
              ) : (
                <>
                  <Copy size={14} bold color={c.white}>
                    Create Account
                  </Copy>
                  <Icon name="arrow" size={18} color={c.white} />
                </>
              )}
            </Action>
          </Card>

          {/* Security Notice */}
          <Card style={st.securityCard}>
            <Tile name="shield" tone="green" size={32} />
            <View style={s.flex}>
              <Copy bold size={11} color={c.green}>
                HIPAA & SOC-2 Compliant
              </Copy>
              <Copy size={10} color={c.muted} style={s.top4}>
                Your data is encrypted and protected under strict clinical healthcare regulations.
              </Copy>
            </View>
          </Card>

          {/* Login Footer */}
          <View style={st.registerFooter}>
            <Copy size={12} color={c.muted}>
              Already have an account?{' '}
            </Copy>
            <TextAction onPress={() => router.push('/login')}>
              Sign In ›
            </TextAction>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#e9eef4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 28,
  },
  desktopScroll: {
    paddingVertical: 48,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: c.background,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: c.border,
  },
  desktopCard: {
    maxWidth: 480,
    padding: 32,
    backgroundColor: 'white',
    shadowColor: '#0c1935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  brandSection: {
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1.9,
    color: '#0d3447',
  },
  headerSection: {
    marginBottom: 18,
  },
  errorCard: {
    backgroundColor: c.redSoft,
    borderColor: '#ffd5dd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputGroup: {
    gap: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfdff',
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: c.navy,
    paddingVertical: 8,
    minHeight: 36,
    // @ts-ignore
    outlineStyle: 'none',
  },
  skinTypeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  skinTypeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: '#fbfdff',
  },
  skinTypeButtonActive: {
    backgroundColor: c.blueSoft,
    borderColor: c.blue,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    minHeight: 46,
    backgroundColor: c.blue,
  },
  securityCard: {
    backgroundColor: c.greenSoft,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
