'use client';

import React from 'react';
import { Search, Bell, Shield } from 'lucide-react';
import { ThemeToggle } from '@medivo/theme';

export function Header() {
  return (
    <header className="h-16 bg-slate-900/80 dark:bg-[#0d1f1c]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#2a4a43] px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search audit logs, users, doctors..."
          className="w-full bg-slate-100 dark:bg-[#162e29] text-slate-800 dark:text-slate-200 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[#2a4a43] focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Right Action Icons & Admin Profile */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>AES-256 Encrypted</span>
        </div>

        <button className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#162e29] border border-slate-200 dark:border-[#2a4a43] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-[#2a4a43]"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">System Administrator</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Super Admin Role</p>
          </div>
        </div>
      </div>
    </header>
  );
}
