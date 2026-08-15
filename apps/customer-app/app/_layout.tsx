import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, LogBox, useWindowDimensions } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { WebSidebar } from '../src/components/navigation/WebSidebar';
import { useAuthStore } from '../src/store/useAuthStore';

import '../global.css';

LogBox.ignoreLogs(['Require cycle:']);

const queryClient = new QueryClient();

function StackNavigator() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="onboarding" />
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
    </>
  );
}

function MainAppShell() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const isAuthRoute =
    pathname === '/splash' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/otp-verify' ||
    pathname === '/onboarding';

  const showSidebar = Platform.OS === 'web' && width >= 1024 && isAuthenticated && !isAuthRoute;

  return (
    <View className="flex-1 flex-row bg-white dark:bg-[#090D16]" style={{ flex: 1, height: '100%' }}>
      {showSidebar && <WebSidebar />}
      <View className="flex-1 h-full" style={{ flex: 1, height: '100%' }}>
        <StackNavigator />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const Container = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <Container style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MainAppShell />
        </ThemeProvider>
      </QueryClientProvider>
    </Container>
  );
}
