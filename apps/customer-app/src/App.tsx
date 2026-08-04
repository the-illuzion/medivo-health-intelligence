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
import { RoutineDetailScreen } from './screens/RoutineDetailScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ConsultationsScreen } from './screens/ConsultationsScreen';
import { VideoCallScreen } from './screens/VideoCallScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { OrderDetailsScreen } from './screens/OrderDetailsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function navigateTo(screen: ScreenKey) {
    setNavStack((prev) => [...prev, screen]);
    setActiveTab(screen);
  }

  useEffect(() => {
    const onHardwareBackPress = () => {
      if (navStack.length > 1) {
        const newStack = [...navStack];
        newStack.pop();
        const prevScreen = newStack[newStack.length - 1];
        setNavStack(newStack);
        setActiveTab(prevScreen);
        return true;
      }

      if (activeTab !== 'splash' && activeTab !== 'dashboard') {
        setNavStack(['dashboard']);
        setActiveTab('dashboard');
        return true;
      }

      return false;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => backSubscription.remove();
  }, [navStack, activeTab]);

  const showHeader = !['splash', 'login', 'register', 'videoCall'].includes(activeTab);
  const showBottomNav = !['splash', 'login', 'register', 'privacyPolicy', 'checkout', 'payments', 'videoCall'].includes(activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFC" translucent={false} />
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Feather name="check-circle" size={16} color="#059669" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Top Header Bar */}
      {showHeader && (
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Feather name="activity" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.topBrandName}>Medivo Health</Text>
          </View>

          <View style={styles.topHeaderActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigateTo('notifications')}>
              <Feather name="bell" size={18} color="#1E1B4B" />
              <View style={styles.badgeDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigateTo('cart')}>
              <Feather name="shopping-bag" size={18} color="#1E1B4B" />
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Primary Screen View */}
      <View style={styles.screenContainer}>
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
        {activeTab === 'videoCall' && <VideoCallScreen onNavigate={navigateTo} />}
        {activeTab === 'cart' && <CartScreen onNavigate={navigateTo} />}
        {activeTab === 'checkout' && <CheckoutScreen onNavigate={navigateTo} />}
        {activeTab === 'payments' && <PaymentsScreen onNavigate={navigateTo} />}
        {activeTab === 'orderDetails' && <OrderDetailsScreen onNavigate={navigateTo} />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'notifications' && <NotificationsScreen onNavigate={navigateTo} />}
      </View>

      {/* Perfectly Spaced & Aligned Floating Glassmorphic Pill Navigation Bar */}
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
  toastBanner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
  },
  toastText: { color: '#065F46', fontSize: 13, fontWeight: '700', marginLeft: 8 },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FAFAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F7',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center' },
  topBrandName: { fontSize: 16, fontWeight: '800', color: '#1E1B4B', marginLeft: 8 },
  topHeaderActions: { flexDirection: 'row', gap: 10 },
  headerIconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7', position: 'relative' },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', position: 'absolute', top: 6, right: 6 },
  badgeCount: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 4, right: 4 },
  badgeCountText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  screenContainer: {
    flex: 1,
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  floatingNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#EEF0F7',
    elevation: 12,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#4338CA',
    fontWeight: '700',
  },
});
