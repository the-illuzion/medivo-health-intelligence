import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricsAdapter {
  isSupported: () => Promise<boolean>;
  authenticate: (reason?: string) => Promise<boolean>;
}

export const biometricsAdapter: BiometricsAdapter = {
  isSupported: async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },
  authenticate: async (reason = 'Authenticate to access health data') => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: 'Use Passcode',
    });
    return result.success;
  },
};
