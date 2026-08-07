'use client';

import React from 'react';
import { Search, Bell, Shield } from 'lucide-react';
import { ThemeToggle } from '@medivo/theme';

export function Header() {
  return (
    <header className="h-16 bg-slate-50/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#374151] px-8 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search audit logs, users, doctors..."
          className="w-full bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[#374151] focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
        />
      </div>

      {/* Right Action Icons & Admin Profile */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="hidden sm:flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 text-brand-primary dark:text-sky-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>AES-256 Encrypted</span>
        </div>

        <button className="w-9 h-9 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#374151] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors relative shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-primary absolute top-2 right-2"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:border-[#374151]"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center font-extrabold text-white text-sm shadow-sm">
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
