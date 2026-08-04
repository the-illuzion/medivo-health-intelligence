export interface BiometricsAdapter {
  isSupported: () => Promise<boolean>;
  authenticate: (reason?: string) => Promise<boolean>;
}

export const biometricsAdapter: BiometricsAdapter = {
  isSupported: async () => {
    return typeof window !== 'undefined' && !!window.PublicKeyCredential;
  },
  authenticate: async () => {
    // Web fallback simulation or WebAuthn placeholder
    return true;
  },
};
