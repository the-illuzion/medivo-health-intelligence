'use client';

import React, { useState } from 'react';
import { Shield, Sparkles, Bell, Activity, CheckCircle2, Lock, LogOut, Sun, Moon, Laptop } from 'lucide-react';
import {
  INK, BG_GRADIENT, FONT_STACK, CARD_SHADOW,
  userProfileData,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { BottomNav } from '../shared/bottom-nav';
import { useTheme, ThemeMode } from '../theme/theme-provider';
import { ScreenKey } from '../../types';

interface ProfileProps {
  onBack: () => void;
  onPush?: (screen: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
  showBack?: boolean;
}

export function Profile({ onBack, onSwitchTab, showBack = true }: ProfileProps) {
  const [profile, setProfile] = useState(userProfileData);
  const { theme, setTheme } = useTheme();

  function toggleConsent() {
    setProfile((p) => ({ ...p, hipaaConsent: !p.hipaaConsent }));
  }

  function toggleApple() {
    setProfile((p) => ({ ...p, appleHealthSync: !p.appleHealthSync }));
  }

  function toggleGoogle() {
    setProfile((p) => ({ ...p, googleFitSync: !p.googleFitSync }));
  }

  function toggleNotifications() {
    setProfile((p) => ({ ...p, notificationsEnabled: !p.notificationsEnabled }));
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-5xl" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Profile & Settings" onBack={onBack} showBack={showBack} />

        {/* User Card */}
        <div className="px-6 pt-2 mb-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-indigo-100 dark:border-slate-700 shadow-md flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/20"
              style={{ background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
            >
              {profile.avatarInitials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {profile.name}
                </h2>
                <span className="bg-indigo-100 dark:bg-slate-700 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> Pro
                </span>
              </div>
              <p className="text-xs text-stone-400 dark:text-stone-400 mb-2">{profile.email}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-slate-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-slate-600">
                  Health Score: {profile.healthScore}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">{profile.skinType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Theme Switcher Options */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 mb-2">
              <Sun size={18} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                App Theme Preference
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 leading-relaxed">
              Choose your preferred visual theme across all devices.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold transition-all ${
                  theme === 'system'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-stone-50 dark:bg-slate-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-slate-600 hover:bg-stone-100'
                }`}
              >
                <Laptop size={18} />
                <span>System</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-stone-50 dark:bg-slate-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-slate-600 hover:bg-stone-100'
                }`}
              >
                <Moon size={18} className={theme === 'dark' ? 'text-amber-300' : 'text-amber-400'} />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-stone-50 dark:bg-slate-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-slate-600 hover:bg-stone-100'
                }`}
              >
                <Sun size={18} className={theme === 'light' ? 'text-amber-200' : 'text-amber-500'} />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Health Goals */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} color="#4338CA" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Health Goals
              </h3>
            </div>
            <div className="space-y-2.5">
              {profile.goals.map((g) => (
                <div key={g} className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-slate-700/50 border border-indigo-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">{g}</span>
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & HIPAA Consent */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} color="#059669" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Privacy & HIPAA Consent
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 leading-relaxed">
              Your health data is encrypted at rest (AES-256) and strictly handled under HIPAA compliance rules.
            </p>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-700 border border-stone-200/60 dark:border-slate-600">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  AI Analysis Data Consent
                </span>
                <p className="text-[11px] text-stone-400">Granted & Versioned</p>
              </div>
              <button
                type="button"
                onClick={toggleConsent}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  profile.hipaaConsent ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    profile.hipaaConsent ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Connected Integrations */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} color="#0EA5E9" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Health Apps & Devices
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-700">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">Apple HealthKit Sync</span>
                <button
                  type="button"
                  onClick={toggleApple}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    profile.appleHealthSync ? 'bg-indigo-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      profile.appleHealthSync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-700">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">Google Fit Sync</span>
                <button
                  type="button"
                  onClick={toggleGoogle}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    profile.googleFitSync ? 'bg-indigo-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      profile.googleFitSync ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications & Settings */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} color="#D97706" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Notification Preferences
              </h3>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-slate-700 mb-4">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">Routine & Scan Reminders</span>
              <button
                type="button"
                onClick={toggleNotifications}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  profile.notificationsEnabled ? 'bg-indigo-700' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    profile.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="profile" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
