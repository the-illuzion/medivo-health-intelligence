import React, { useState, useEffect, Component, ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView, BackHandler } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CameraScanScreen } from './screens/CameraScanScreen';
import { ScanReportScreen } from './screens/ScanReportScreen';
import { AICoachScreen } from './screens/AICoachScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ConsultationsScreen } from './screens/ConsultationsScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('MOBILE APP ERROR BOUNDARY CAUGHT:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, padding: 24, backgroundColor: '#FEF2F2', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#991B1B', marginBottom: 12 }}>
            App Exception Encountered
          </Text>
          <ScrollView style={{ maxHeight: 300, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5' }}>
            <Text style={{ fontSize: 12, color: '#B91C1C', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
              {String(this.state.error?.stack || this.state.error)}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<ScreenKey>('splash');
  const [navStack, setNavStack] = useState<ScreenKey[]>(['splash']);

  // Navigate with stack push history
  function navigateTo(screen: ScreenKey) {
    setNavStack((prev) => [...prev, screen]);
    setActiveTab(screen);
  }

  // Pop screen off stack on Android hardware back button press
  useEffect(() => {
    const onHardwareBackPress = () => {
      if (navStack.length > 1) {
        const newStack = [...navStack];
        newStack.pop();
        const prevScreen = newStack[newStack.length - 1];
        setNavStack(newStack);
        setActiveTab(prevScreen);
        return true; // Handled back navigation, prevent app exit
      }

      if (activeTab !== 'splash' && activeTab !== 'dashboard') {
        setNavStack(['dashboard']);
        setActiveTab('dashboard');
        return true; // Return to dashboard, prevent app exit
      }

      return false; // Already on root screen, allow standard app exit
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => backSubscription.remove();
  }, [navStack, activeTab]);

  const showBottomNav = !['splash', 'login', 'register', 'privacyPolicy', 'checkout', 'payments'].includes(activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFC" translucent={false} />
      
      {/* Primary Screen Canvas View (15 Native Screens Supported) */}
      <View style={[styles.screenContainer, showBottomNav && { paddingBottom: 90 }]}>
        {activeTab === 'splash' && <SplashScreen onNavigate={navigateTo} />}
        {activeTab === 'login' && <LoginScreen onNavigate={navigateTo} />}
        {activeTab === 'register' && <RegisterScreen onNavigate={navigateTo} />}
        {activeTab === 'privacyPolicy' && <PrivacyPolicyScreen onNavigate={navigateTo} />}
        {activeTab === 'dashboard' && <DashboardScreen onNavigate={navigateTo} />}
        {activeTab === 'faceMatch' && <CameraScanScreen onNavigate={navigateTo} />}
        {activeTab === 'scanReport' && <ScanReportScreen onNavigate={navigateTo} />}
        {activeTab === 'coach' && <AICoachScreen />}
        {activeTab === 'history' && <HistoryScreen onNavigate={navigateTo} />}
        {activeTab === 'routines' && <RoutinesScreen />}
        {activeTab === 'products' && <ProductsScreen />}
        {activeTab === 'consultations' && <ConsultationsScreen />}
        {activeTab === 'cart' && <CartScreen onNavigate={navigateTo} />}
        {activeTab === 'checkout' && <CheckoutScreen onNavigate={navigateTo} />}
        {activeTab === 'payments' && <PaymentsScreen onNavigate={navigateTo} />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Floating Glassmorphic Pill Navigation Bar */}
      {showBottomNav && (
        <View style={styles.floatingNavContainer}>
          <View style={styles.floatingNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('dashboard')}
              activeOpacity={0.75}
            >
              <Feather name="home" size={20} color={activeTab === 'dashboard' ? '#4338CA' : '#94A3B8'} />
              <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.navLabelActive]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('faceMatch')}
              activeOpacity={0.75}
            >
              <Feather name="camera" size={20} color={activeTab === 'faceMatch' ? '#4338CA' : '#94A3B8'} />
              <Text style={[styles.navLabel, activeTab === 'faceMatch' && styles.navLabelActive]}>
                Scan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('coach')}
              activeOpacity={0.75}
            >
              <Feather name="message-square" size={20} color={activeTab === 'coach' ? '#4338CA' : '#94A3B8'} />
              <Text style={[styles.navLabel, activeTab === 'coach' && styles.navLabelActive]}>
                Coach
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('products')}
              activeOpacity={0.75}
            >
              <Feather name="shopping-bag" size={20} color={activeTab === 'products' ? '#4338CA' : '#94A3B8'} />
              <Text style={[styles.navLabel, activeTab === 'products' && styles.navLabelActive]}>
                Store
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigateTo('consultations')}
              activeOpacity={0.75}
            >
              <Feather name="user-check" size={20} color={activeTab === 'consultations' ? '#4338CA' : '#94A3B8'} />
              <Text style={[styles.navLabel, activeTab === 'consultations' && styles.navLabelActive]}>
                Doctors
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  screenContainer: {
    flex: 1,
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  floatingNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EEF0F7',
    elevation: 12,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#4338CA',
    fontWeight: '700',
  },
});
