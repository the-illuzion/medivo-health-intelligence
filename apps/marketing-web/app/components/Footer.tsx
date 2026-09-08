'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, HeartPulse, Lock, ExternalLink } from 'lucide-react';
import { useDomainUrls } from '../utils/domainHelper';

export function Footer() {
  const { appUrl, doctorUrl, adminUrl, apiUrl } = useDomainUrls();

  return (
    <footer className="bg-slate-50 dark:bg-[#070a0f] border-t border-slate-200 dark:border-[#1F2937] pt-16 pb-12 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Medivo</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              AI-powered digital health ecosystem providing instant multi-spectral facial telemetry, virtual board-certified dermatologist consultations, and custom prescription formulations.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA Compliant Platform</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl">
                <Lock className="w-3.5 h-3.5" />
                <span>AES-256 Vault Encryption</span>
              </div>
            </div>
          </div>

          {/* Platform Apps Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Platform Ecosystem</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href={appUrl} className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Patient Web Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a href={doctorUrl} className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Doctor Clinical Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a href={adminUrl} className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Platform Admin Console</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a href={`${apiUrl}/health`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Unified BFF Gateway Health</span>
                  <ExternalLink className="w-3 h-3 opacity-40" />
                </a>
              </li>
              <li>
                <a href="/medivo-health-mobile-arm64-25MB.apk" className="hover:text-brand-primary dark:hover:text-white transition-colors">
                  <span>Android Release APK (25MB)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical Science Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Clinical & Science</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/clinical-studies" className="hover:text-brand-primary dark:hover:text-white transition-colors">99.4% Diagnostic Benchmarks</Link></li>
              <li><Link href="/clinical-studies" className="hover:text-brand-primary dark:hover:text-white transition-colors">128-Mesh Multi-Spectral Vision</Link></li>
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Medical Advisory Board</Link></li>
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Cryptographic Health Vault</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-primary dark:hover:text-white transition-colors">Membership & Consultations</Link></li>
            </ul>
          </div>

          {/* Legal & Regulatory Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Legal & Compliance</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">HIPAA Privacy & Data Rights</Link></li>
              <li><Link href="/clinical-studies" className="hover:text-brand-primary dark:hover:text-white transition-colors">FDA SaMD Guidance Disclosure</Link></li>
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Medical AI Wellness Notice</Link></li>
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Telehealth Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Informed Consent Policies</Link></li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex flex-col sm:flex-row gap-3 items-start">
          <HeartPulse className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Clinical Disclaimer & Medical AI Notice:</span>
            Medivo AI skin analyses, hydration indexes, and predictive formulations are intended for skin wellness, monitoring, and educational support. They do not constitute an autonomous medical diagnosis. Board-certified dermatological evaluations and prescription treatments are provided directly by licensed physicians via our secure telehealth network.
          </div>
        </div>

        {/* Copyright & System Status */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#1F2937] flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <p>© 2026 Medivo Health Intelligence Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Clean Architecture Monorepo v5.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
