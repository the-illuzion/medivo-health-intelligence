import React, { useState, Component, ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { DashboardScreen } from './screens/DashboardScreen';
import { CameraScanScreen } from './screens/CameraScanScreen';
import { ScanReportScreen } from './screens/ScanReportScreen';
import { AICoachScreen } from './screens/AICoachScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { ConsultationsScreen } from './screens/ConsultationsScreen';
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
  const [activeTab, setActiveTab] = useState<ScreenKey>('dashboard');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFC" translucent={false} />
      
      {/* Primary Screen Canvas View (All 9 Web Portal Screens Natively Supported) */}
      <View style={styles.screenContainer}>
        {activeTab === 'dashboard' && <DashboardScreen onNavigate={(screen) => setActiveTab(screen)} />}
        {activeTab === 'faceMatch' && <CameraScanScreen onNavigate={(screen) => setActiveTab(screen)} />}
        {activeTab === 'scanReport' && <ScanReportScreen onNavigate={(screen) => setActiveTab(screen)} />}
        {activeTab === 'coach' && <AICoachScreen />}
        {activeTab === 'history' && <HistoryScreen onNavigate={(screen) => setActiveTab(screen)} />}
        {activeTab === 'routines' && <RoutinesScreen />}
        {activeTab === 'products' && <ProductsScreen />}
        {activeTab === 'consultations' && <ConsultationsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Touch-Optimized Native Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
          activeOpacity={0.7}
        >
          <Feather name="home" size={20} color={activeTab === 'dashboard' ? '#4338CA' : '#94A3B8'} />
          <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('faceMatch')}
          activeOpacity={0.7}
        >
          <Feather name="camera" size={20} color={activeTab === 'faceMatch' ? '#4338CA' : '#94A3B8'} />
          <Text style={[styles.navLabel, activeTab === 'faceMatch' && styles.navLabelActive]}>
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('coach')}
          activeOpacity={0.7}
        >
          <Feather name="message-square" size={20} color={activeTab === 'coach' ? '#4338CA' : '#94A3B8'} />
          <Text style={[styles.navLabel, activeTab === 'coach' && styles.navLabelActive]}>
            Coach
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('products')}
          activeOpacity={0.7}
        >
          <Feather name="shopping-bag" size={20} color={activeTab === 'products' ? '#4338CA' : '#94A3B8'} />
          <Text style={[styles.navLabel, activeTab === 'products' && styles.navLabelActive]}>
            Store
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('consultations')}
          activeOpacity={0.7}
        >
          <Feather name="user-check" size={20} color={activeTab === 'consultations' ? '#4338CA' : '#94A3B8'} />
          <Text style={[styles.navLabel, activeTab === 'consultations' && styles.navLabelActive]}>
            Doctors
          </Text>
        </TouchableOpacity>
      </View>
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F7',
    elevation: 8,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
