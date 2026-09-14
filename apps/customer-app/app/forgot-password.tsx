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
  IconButton,
  TextAction,
  Tile,
  s,
} from '../src/features/design-preview/components/UI';
import { colors as c } from '../src/features/design-preview/tokens';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const handleReset = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setErrorMessage('');
    const success = await resetPassword(email.trim());
    if (success) {
      setIsSent(true);
    } else {
      setErrorMessage('Failed to send reset link. Please check your email.');
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
          {/* Back Action & Brand Header */}
          <View style={st.topNav}>
            <IconButton
              name="back"
              label="Back to Login"
              onPress={() => router.back()}
            />
            <Text style={st.logo}>medivo</Text>
            <Chip tone="green" icon="shield">
              Secure
            </Chip>
          </View>

          {/* Heading */}
          <View style={st.headerSection}>
            <Heading size={24}>Reset password</Heading>
            <Copy size={13} color={c.muted} style={s.top4}>
              Enter your registered email address to receive secure recovery instructions.
            </Copy>
          </View>

          {isSent ? (
            <Card style={st.successCard}>
              <Tile name="done" tone="green" size={48} />
              <Heading size={18} style={{ color: c.green, marginTop: 12 }}>
                Recovery Link Dispatched
              </Heading>
              <Copy size={12} color={c.muted} style={{ textAlign: 'center', marginTop: 6, marginBottom: 16 }}>
                We have sent password reset instructions to <Copy bold size={12}>{email}</Copy>.
              </Copy>
              <Action onPress={() => router.replace('/login')} style={{ width: '100%' }}>
                Return to Sign In
              </Action>
            </Card>
          ) : (
            <>
              {errorMessage ? (
                <Card style={st.errorCard}>
                  <Tile name="alert" tone="red" size={32} />
                  <View style={s.flex}>
                    <Heading size={13} style={{ color: c.red }}>
                      Error
                    </Heading>
                    <Copy size={11} color={c.red} style={s.top4}>
                      {errorMessage}
                    </Copy>
                  </View>
                </Card>
              ) : null}

              <Card style={st.formCard}>
                <View style={st.inputGroup}>
                  <Copy bold size={12} color={c.navy}>
                    Registered Email
                  </Copy>
                  <View style={st.inputWrapper}>
                    <Tile name="file" tone="blue" size={30} />
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

                <Action
                  onPress={handleReset}
                  disabled={isLoading}
                  style={st.submitButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color={c.white} size="small" />
                  ) : (
                    <>
                      <Copy size={14} bold color={c.white}>
                        Send Reset Link
                      </Copy>
                      <Icon name="arrow" size={18} color={c.white} />
                    </>
                  )}
                </Action>
              </Card>
            </>
          )}

          {/* Footer */}
          <View style={st.footer}>
            <TextAction onPress={() => router.replace('/login')}>
              ‹ Back to Sign In
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
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -1.5,
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
  successCard: {
    backgroundColor: c.greenSoft,
    borderColor: '#d2f3e4',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
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
  submitButton: {
    marginTop: 18,
    borderRadius: 12,
    minHeight: 46,
    backgroundColor: c.blue,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
