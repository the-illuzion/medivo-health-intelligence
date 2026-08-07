'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldCheck, Users, UserCheck, Package, Activity } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Executive Overview', href: '/', icon: LayoutDashboard },
    { label: 'HIPAA Audit Trail', href: '/hipaa-audit', icon: ShieldCheck },
    { label: 'User Telemetry', href: '/users', icon: Users },
    { label: 'Dermatologist Hub', href: '/doctors', icon: UserCheck },
    { label: 'Product Inventory', href: '/products', icon: Package },
  ];

  return (
    <aside className="w-64 bg-slate-50 dark:bg-[#090D16] border-r border-slate-200 dark:border-[#374151] flex flex-col h-screen sticky top-0 transition-colors">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-[#374151] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-md">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Medivo Admin</h1>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            HIPAA Compliant
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-200 dark:border-[#374151] m-4 bg-white dark:bg-[#111827] border rounded-2xl shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Core BFF API</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">ONLINE</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-[#1F2937] h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-full"></div>
        </div>
      </div>
    </aside>
  );
}
