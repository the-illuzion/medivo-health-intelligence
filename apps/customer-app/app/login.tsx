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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    setErrorMessage('');
    const success = await login(email.trim(), password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleFillTestCredentials = () => {
    setEmail('test@yopmail.com');
    setPassword('Test@123');
    setErrorMessage('');
  };

  const activeError = errorMessage || authError;

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={st.safe}>
      <ScrollView
        contentContainerStyle={[st.scrollContent, desktop && st.desktopScroll]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[st.cardContainer, desktop && st.desktopCard]}>
          {/* Brand Header */}
          <View style={st.brandSection}>
            <View style={st.logoRow}>
              <Text style={st.logo}>medivo</Text>
              <Chip tone="green" icon="shield">
                HIPAA Certified
              </Chip>
            </View>
            <Copy size={11} color={c.muted} style={s.top4}>
              Health Intelligence for a Better You
            </Copy>
          </View>

          {/* Greeting Header */}
          <View style={st.headerSection}>
            <Heading size={24}>Welcome back</Heading>
            <Copy size={13} color={c.muted} style={s.top4}>
              Sign in to access your personal biomarker intelligence, vital trends, and daily care plan.
            </Copy>
          </View>

          {/* Error Banner */}
          {activeError ? (
            <Card style={st.errorCard}>
              <Tile name="alert" tone="red" size={32} />
              <View style={s.flex}>
                <Heading size={13} style={{ color: c.red }}>
                  Authentication Error
                </Heading>
                <Copy size={11} color={c.red} style={s.top4}>
                  {activeError}
                </Copy>
              </View>
            </Card>
          ) : null}

          {/* Form Card */}
          <Card style={st.formCard}>
            {/* Email Field */}
            <View style={st.inputGroup}>
              <Copy bold size={12} color={c.navy}>
                Email address
              </Copy>
              <View style={st.inputWrapper}>
                <Tile name="user" tone="blue" size={30} />
                <TextInput
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="test@yopmail.com"
                  placeholderTextColor="#8a99ad"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={st.input}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={[st.inputGroup, { marginTop: 14 }]}>
              <View style={st.passwordHeader}>
                <Copy bold size={12} color={c.navy}>
                  Password
                </Copy>
                <TextAction onPress={() => router.push('/forgot-password')}>
                  Forgot password?
                </TextAction>
              </View>
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
                  secureTextEntry={!showPassword}
                  style={[st.input, { paddingRight: 40 }]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={st.eyeButton}
                >
                  <Icon name={showPassword ? 'done' : 'check'} size={16} color={c.muted} />
                </Pressable>
              </View>
            </View>

            {/* Submit Action */}
            <Action
              onPress={handleLogin}
              disabled={isLoading}
              style={st.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator color={c.white} size="small" />
              ) : (
                <>
                  <Copy size={14} bold color={c.white}>
                    Sign In
                  </Copy>
                  <Icon name="arrow" size={18} color={c.white} />
                </>
              )}
            </Action>

            {/* Quick-fill Dev Shortcut */}
            <Pressable
              onPress={handleFillTestCredentials}
              style={st.testCreds}
              accessibilityRole="button"
              accessibilityLabel="Fill demo test credentials"
            >
              <Tile name="bulb" tone="blue" size={24} />
              <View style={s.flex}>
                <Copy size={10} color={c.muted}>
                  Demo Account: <Copy bold size={10} color={c.blue}>test@yopmail.com / Test@123</Copy>
                </Copy>
              </View>
            </Pressable>
          </Card>

          {/* Security & HIPAA Notice */}
          <Card style={st.securityCard}>
            <Tile name="shield" tone="green" size={32} />
            <View style={s.flex}>
              <Copy bold size={11} color={c.green}>
                End-to-End Encrypted & Private
              </Copy>
              <Copy size={10} color={c.muted} style={s.top4}>
                Your health data, telemetry records, and vitals are encrypted under Medivo Privacy Standards.
              </Copy>
            </View>
          </Card>

          {/* Registration Link */}
          <View style={st.registerFooter}>
            <Copy size={12} color={c.muted}>
              Don't have an account?{' '}
            </Copy>
            <TextAction onPress={() => router.push('/register')}>
              Create Patient Account ›
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  eyeButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 18,
    borderRadius: 12,
    minHeight: 46,
    backgroundColor: c.blue,
  },
  testCreds: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: c.blueSoft,
    borderRadius: 10,
    padding: 9,
    marginTop: 14,
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
