import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../../src/store/useAuthStore';
import { PreviewProvider } from '../../src/features/design-preview/PreviewContext';
import { DesignFrame } from '../../src/features/design-preview/components/Shell';
import { SheetHost } from '../../src/features/design-preview/components/Sheets';
export default function DesignLayout() {
  const { isHydrated, isAuthenticated, isOnboarded } = useAuthStore();
  if (!isHydrated)
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
        <ActivityIndicator accessibilityLabel="Restoring session" />
      </View>
    );
  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!isOnboarded) return <Redirect href="/onboarding" />;
  return (
    <PreviewProvider>
      <StatusBar style="dark" />
      <DesignFrame>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f7faff' } }}
        />
      </DesignFrame>
      <SheetHost />
    </PreviewProvider>
  );
}
