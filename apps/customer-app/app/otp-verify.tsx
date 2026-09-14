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

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { verifyOtp, isLoading } = useAuthStore();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const handleVerify = async () => {
    if (code.length < 4) {
      setErrorMessage('Please enter the full 4-digit verification PIN.');
      return;
    }
    setErrorMessage('');
    const success = await verifyOtp(code.trim());
    if (success) {
      router.replace('/onboarding');
    } else {
      setErrorMessage('Invalid verification PIN. Please try again.');
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
          <View style={st.topNav}>
            <IconButton
              name="back"
              label="Back"
              onPress={() => router.back()}
            />
            <Text style={st.logo}>medivo</Text>
            <Chip tone="purple" icon="shield">
              2FA Shield
            </Chip>
          </View>

          <View style={st.headerSection}>
            <Heading size={24}>Security verification</Heading>
            <Copy size={13} color={c.muted} style={s.top4}>
              We sent a 4-digit verification PIN to confirm your patient identity.
            </Copy>
          </View>

          {errorMessage ? (
            <Card style={st.errorCard}>
              <Tile name="alert" tone="red" size={32} />
              <View style={s.flex}>
                <Heading size={13} style={{ color: c.red }}>
                  Verification Error
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
                4-Digit Security PIN
              </Copy>
              <View style={st.inputWrapper}>
                <Tile name="lock" tone="purple" size={30} />
                <TextInput
                  value={code}
                  onChangeText={(val) => {
                    setCode(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. 7482"
                  placeholderTextColor="#8a99ad"
                  keyboardType="number-pad"
                  maxLength={4}
                  style={st.pinInput}
                />
              </View>
            </View>

            <Action
              onPress={handleVerify}
              disabled={isLoading}
              style={st.submitButton}
            >
              {isLoading ? (
                <ActivityIndicator color={c.white} size="small" />
              ) : (
                <>
                  <Copy size={14} bold color={c.white}>
                    Verify & Continue
                  </Copy>
                  <Icon name="arrow" size={18} color={c.white} />
                </>
              )}
            </Action>
          </Card>

          <View style={st.footer}>
            <Copy size={12} color={c.muted}>
              Didn't receive the PIN?{' '}
            </Copy>
            <TextAction onPress={() => setCode('7482')}>
              Resend code
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
  pinInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    color: c.navy,
    paddingVertical: 8,
    minHeight: 40,
    // @ts-ignore
    outlineStyle: 'none',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    minHeight: 46,
    backgroundColor: c.blue,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
