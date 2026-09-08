'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Smartphone, ArrowRight, Menu, X, ExternalLink, ShieldCheck, Stethoscope, UserCheck } from 'lucide-react';
import { ThemeToggle } from '@medivo/theme';
import { useDomainUrls } from '../utils/domainHelper';

export function Navbar() {
  const { appUrl, doctorUrl, adminUrl } = useDomainUrls();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Platform' },
    { href: '/clinical-studies', label: 'Clinical Studies' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About & Security' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#374151]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-2xl p-1">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Medivo</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
            </div>
            <span className="text-[10px] text-brand-primary font-bold block -mt-1 uppercase tracking-widest">Health Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative hover:text-brand-primary dark:hover:text-white ${
                  isActive ? 'text-brand-primary dark:text-sky-400 font-bold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {/* Web App CTA (Desktop) */}
          <a
            href={appUrl}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-primary dark:hover:text-white px-3.5 py-2 rounded-xl transition-all hidden lg:inline-flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span>Open Web App</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Primary Action Button */}
          <a
            href={appUrl}
            className="bg-brand-primary hover:bg-sky-600 text-white px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm shadow-brand-primary/20 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 hidden xs:inline" />
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900 dark:text-white" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 py-8 overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-6">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
              Navigation
            </div>
            <nav className="space-y-2" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between p-3.5 rounded-2xl text-base font-bold transition-colors ${
                      isActive
                        ? 'bg-sky-500/10 text-brand-primary dark:text-sky-400'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </nav>

            {/* Portal Direct Access */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                Ecosystem Portals
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                <a
                  href={appUrl}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-primary transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold">Patient Portal</span>
                    <span className="text-[11px] text-slate-500">Skin Telemetry & AI Scans</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>

                <a
                  href={doctorUrl}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-primary transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold">Doctor Clinical Portal</span>
                    <span className="text-[11px] text-slate-500">Clinician Consultations</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>

                <a
                  href={adminUrl}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-primary transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold">Platform Admin</span>
                    <span className="text-[11px] text-slate-500">System Telemetry & Controls</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Download & Security Badge */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <a
              href="/medivo-health-mobile-arm64-25MB.apk"
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android APK (25MB)</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA Compliant & AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
