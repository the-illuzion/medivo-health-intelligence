import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, LogBox } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/theme/ThemeProvider';

import '../global.css';

// Silence non-fatal Metro require cycle warnings in dev mode
LogBox.ignoreLogs(['Require cycle:']);

const queryClient = new QueryClient();

export default function RootLayout() {
  const Container = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <Container style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0D1F1C' },
              animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="privacy-policy" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="scan-report/[id]" />
            <Stack.Screen name="coach" />
            <Stack.Screen name="history" />
            <Stack.Screen name="routine/[id]" />
            <Stack.Screen name="consultations" />
            <Stack.Screen name="video-call/[id]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="order/[id]" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="notifications" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </Container>
  );
}
