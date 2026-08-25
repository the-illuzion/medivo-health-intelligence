import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export function Footer() {
  const customerPortalUrl = process.env.NEXT_PUBLIC_APP_URL || '#simulator';

  return (
    <footer className="bg-slate-100 dark:bg-[#070a0f] border-t border-slate-200 dark:border-[#374151] py-16 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">Medivo</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            AI-powered digital health ecosystem providing instant multi-spectral face scan telemetry, board-certified dermatologists, and medical-grade custom formulations.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5" />
            HIPAA Compliant Platform
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Monorepo Apps</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href={customerPortalUrl} className="hover:text-brand-primary dark:hover:text-white transition-colors">Customer Web Portal</a></li>
            <li><a href="/doctor-portal" className="hover:text-brand-primary dark:hover:text-white transition-colors">Doctor Clinical Portal</a></li>
            <li><a href="/admin-panel" className="hover:text-brand-primary dark:hover:text-white transition-colors">Platform Admin Console</a></li>
            <li><a href="/api/mobile-bff/health" target="_blank" className="hover:text-brand-primary dark:hover:text-white transition-colors">Mobile BFF Health API</a></li>
            <li><a href="/medivo-health-mobile-arm64-25MB.apk" className="hover:text-brand-primary dark:hover:text-white transition-colors">Android Release APK (25MB)</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Clinical Technology</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="/clinical-studies" className="hover:text-brand-primary dark:hover:text-white transition-colors">99.4% Diagnostic Benchmarks</a></li>
            <li><a href="/clinical-studies" className="hover:text-brand-primary dark:hover:text-white transition-colors">Multi-Spectral Landmark Vision</a></li>
            <li><a href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">Medical Advisory Board</a></li>
            <li><a href="/about" className="hover:text-brand-primary dark:hover:text-white transition-colors">AES-256 Data Vault Encryption</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal & Compliance</h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="#" className="hover:text-brand-primary dark:hover:text-white transition-colors">HIPAA Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-primary dark:hover:text-white transition-colors">FDA Software Class II Disclosure</a></li>
            <li><a href="#" className="hover:text-brand-primary dark:hover:text-white transition-colors">Medical Disclaimers</a></li>
            <li><a href="#" className="hover:text-brand-primary dark:hover:text-white transition-colors">Terms of Telehealth Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-[#374151]/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2026 Medivo Health Intelligence Platform Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Clean Architecture Monorepo v5.1</p>
      </div>
    </footer>
  );
}
