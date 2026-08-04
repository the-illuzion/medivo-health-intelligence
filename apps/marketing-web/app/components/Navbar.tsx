'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Smartphone, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@medivo/theme';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 dark:bg-[#0d1f1c]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#2a4a43]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Medivo</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block -mt-1 uppercase tracking-wider">Health Intelligence</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Platform</Link>
          <Link href="/clinical-studies" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Clinical Studies</Link>
          <Link href="/pricing" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-emerald-600 dark:hover:text-white transition-colors">About & HIPAA</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white px-3 py-2 rounded-xl transition-colors hidden sm:block"
          >
            Launch Web App
          </a>

          <a
            href="/medivo-health-mobile-arm64-25MB.apk"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
}
