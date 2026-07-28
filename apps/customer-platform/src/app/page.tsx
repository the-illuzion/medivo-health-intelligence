'use client';

import React, { useState, useEffect } from 'react';
import { Dashboard } from '../components/screens/dashboard-screen';
import { FaceMatch } from '../components/screens/face-match-screen';
import { ScanReport } from '../components/screens/scan-report-screen';
import { AICoach } from '../components/screens/ai-coach-screen';
import { History } from '../components/screens/history-screen';
import { Routines } from '../components/screens/routines-screen';
import { Products } from '../components/screens/products-screen';
import { Consultations } from '../components/screens/consultations-screen';
import { Profile } from '../components/screens/profile-screen';
import { DesktopSidebar } from '../components/shared/desktop-sidebar';
import { DesktopHeader } from '../components/shared/desktop-header';
import { NotificationModal } from '../components/shared/notification-modal';
import { SearchModal } from '../components/shared/search-modal';
import { ScreenKey } from '../types';

export default function CustomerPlatformPage() {
  const [stack, setStack] = useState<ScreenKey[]>(['dashboard']);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const screen = stack[stack.length - 1] || 'dashboard';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Global Cmd+K / Ctrl+K keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pushScreen = (next: ScreenKey) => setStack((s) => [...s, next]);
  const switchTab = (next: ScreenKey) => setStack([next]);
  
  // Intelligent back navigation fallback: if stack length is 1 and not on dashboard, return to dashboard!
  const goBack = () => {
    setStack((s) => {
      if (s.length > 1) {
        return s.slice(0, -1);
      }
      if (s[0] !== 'dashboard') {
        return ['dashboard'];
      }
      return s;
    });
  };

  const canGoBack = stack.length > 1 || screen !== 'dashboard';
  const navProps = { onPush: pushScreen, onSwitchTab: switchTab, onBack: goBack, showBack: canGoBack };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Navigation Shell */}
      <DesktopSidebar active={screen} onSwitchTab={switchTab} onPush={pushScreen} />
      <DesktopHeader
        activeScreen={screen}
        onPush={pushScreen}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        hasUnreadNotifications={hasUnreadNotifications}
      />

      {/* Main Content View */}
      <main className="w-full min-h-screen lg:pl-64">
        {screen === 'dashboard' && (
          <Dashboard
            {...navProps}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            hasUnreadNotifications={hasUnreadNotifications}
          />
        )}
        {screen === 'faceMatch' && <FaceMatch {...navProps} />}
        {screen === 'scanReport' && <ScanReport {...navProps} />}
        {screen === 'coach' && <AICoach {...navProps} />}
        {screen === 'history' && <History {...navProps} />}
        {screen === 'routines' && <Routines {...navProps} />}
        {screen === 'products' && <Products {...navProps} />}
        {screen === 'consultations' && <Consultations {...navProps} />}
        {screen === 'profile' && <Profile {...navProps} />}
      </main>

      {/* Notification Slide-Over Drawer */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearUnread={() => setHasUnreadNotifications(false)}
      />

      {/* Quick Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={pushScreen}
      />
    </div>
  );
}
