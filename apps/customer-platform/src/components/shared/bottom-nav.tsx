'use client';

import React from 'react';
import { Home, Camera, MessageCircle, CalendarCheck, User } from 'lucide-react';
import { ScreenKey, NavItem } from '../../types';

interface BottomNavProps {
  active: ScreenKey;
  onSwitchTab: (tab: ScreenKey) => void;
}

const bottomNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', screenKey: 'dashboard' },
  { icon: Camera, label: 'Scan', screenKey: 'faceMatch' },
  { icon: MessageCircle, label: 'Coach', screenKey: 'coach' },
  { icon: CalendarCheck, label: 'Routines', screenKey: 'routines' },
  { icon: User, label: 'Profile', screenKey: 'profile' },
];

export function BottomNav({ active, onSwitchTab }: BottomNavProps) {
  return (
    <nav
      className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 border border-stone-100/80 dark:border-slate-800"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '380px',
        backdropFilter: 'blur(12px)',
        borderRadius: '28px',
        padding: '12px 20px',
        boxShadow: '0 14px 36px rgba(0,0,0,0.2)',
        zIndex: 50,
      }}
    >
      {bottomNavItems.map((item) => {
        const isActive = item.screenKey === active;
        const Icon = item.icon;
        return (
          <button
            key={item.screenKey}
            type="button"
            onClick={() => onSwitchTab(item.screenKey)}
            className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
            style={{ color: isActive ? 'var(--color-ink-soft)' : '#B7B4C7' }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.3 : 2} />
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
