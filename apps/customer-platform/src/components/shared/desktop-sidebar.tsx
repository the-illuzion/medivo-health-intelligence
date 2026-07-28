'use client';

import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { INK, TEXT_TERTIARY, navItems, userProfileData } from '../../data/mock-data';
import { ScreenKey } from '../../types';

interface DesktopSidebarProps {
  active: ScreenKey;
  onSwitchTab: (tab: ScreenKey) => void;
  onPush: (screen: ScreenKey) => void;
}

export function DesktopSidebar({ active, onSwitchTab, onPush }: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen fixed top-0 left-0 bg-white dark:bg-slate-900 border-r border-indigo-100/50 dark:border-slate-800 p-6 z-40">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20"
            style={{ background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
          >
            M
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight" style={{ color: INK }}>
              Medivo Health
            </h2>
            <p className="text-[11px] text-stone-400">Customer Portal v5.1</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onPush('faceMatch')}
          className="w-full py-3 px-4 mb-6 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-98 transition-all"
          style={{ background: 'linear-gradient(135deg, #4338CA, #4F46E5)' }}
        >
          <Camera size={16} />
          <span>New AI Face Scan</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.screenKey;
            const Icon = item.icon;
            return (
              <button
                key={item.screenKey}
                type="button"
                onClick={() => onSwitchTab(item.screenKey)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 border border-indigo-100/80 dark:border-slate-700 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-slate-800/60 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-stone-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Membership Footer Card */}
      <div className="bg-indigo-50/70 dark:bg-slate-800 p-4 rounded-2xl border border-indigo-100/80 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">{userProfileData.plan}</span>
        </div>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2">Unlimited AI Scans & Telehealth Priority</p>
        <div className="w-full bg-indigo-200/60 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 dark:bg-indigo-400 h-full w-4/5 rounded-full" />
        </div>
      </div>
    </aside>
  );
}
