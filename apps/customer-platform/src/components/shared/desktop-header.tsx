'use client';

import React from 'react';
import { Search, Bell, Sparkles, ChevronDown } from 'lucide-react';
import { INK, INK_SOFT, TEXT_TERTIARY, userProfileData } from '../../data/mock-data';
import { ThemeToggleButton } from '../theme/theme-toggle-button';
import { ScreenKey } from '../../types';

interface DesktopHeaderProps {
  activeScreen: ScreenKey;
  onPush: (screen: ScreenKey) => void;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
  hasUnreadNotifications?: boolean;
}

export function DesktopHeader({
  activeScreen,
  onPush,
  onOpenNotifications,
  onOpenSearch,
  hasUnreadNotifications = true,
}: DesktopHeaderProps) {
  const titles: Record<ScreenKey, string> = {
    dashboard: 'Dashboard Overview',
    faceMatch: 'AI Face Match Analysis',
    scanReport: 'Scan Report Details',
    coach: 'AI Health Coach',
    history: 'Scan History & Trends',
    routines: 'Skincare & Health Routines',
    products: 'Recommended Products Marketplace',
    consultations: 'Dermatologist Telehealth Consultations',
    profile: 'Profile & Settings',
  };

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-indigo-100/50 dark:border-slate-800 sticky top-0 z-30 ml-64">
      <div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
          {titles[activeScreen] || 'Customer Portal'}
        </h1>
        <p className="text-xs" style={{ color: TEXT_TERTIARY }}>
          Welcome back, {userProfileData.name}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="relative w-64 flex items-center gap-2 pl-3.5 pr-4 py-2 text-xs rounded-full bg-stone-100/70 dark:bg-slate-800 hover:bg-stone-100 text-stone-400 border border-transparent hover:border-stone-200 dark:hover:border-slate-700 transition-all text-left"
        >
          <Search size={16} className="text-stone-400" />
          <span className="flex-1">Search products, doctors...</span>
          <span className="text-[10px] font-bold bg-stone-200/60 dark:bg-slate-700 text-stone-600 dark:text-stone-300 px-1.5 py-0.5 rounded">⌘K</span>
        </button>

        {/* Theme Switcher Single Button */}
        <ThemeToggleButton />

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-stone-100/80 dark:bg-slate-800 flex items-center justify-center hover:bg-stone-200/60 dark:hover:bg-slate-700 active:scale-95 transition-all border border-transparent dark:border-slate-700"
          title="Notifications"
        >
          <Bell size={18} color={INK_SOFT} />
          {hasUnreadNotifications && (
            <span className="absolute w-2 h-2 top-2.5 right-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900" />
          )}
        </button>

        {/* Quick Coach Pill */}
        <button
          type="button"
          onClick={() => onPush('coach')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100/80 transition-all active:scale-95 border border-transparent dark:border-slate-700"
        >
          <Sparkles size={14} color="#4338CA" />
          <span>Ask AI Coach</span>
        </button>

        {/* Profile Dropdown */}
        <button
          type="button"
          onClick={() => onPush('profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 hover:border-indigo-300 shadow-sm transition-all"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
          >
            {userProfileData.avatarInitials}
          </div>
          <span className="text-xs font-semibold" style={{ color: INK }}>
            {userProfileData.name.split(' ')[0]}
          </span>
          <ChevronDown size={14} className="text-stone-400" />
        </button>
      </div>
    </header>
  );
}
