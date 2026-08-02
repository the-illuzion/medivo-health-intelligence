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
    <aside className="w-64 bg-[#111827] border-r border-[#1f2937] flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1f2937] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight">Medivo Admin</h1>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2937]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#1f2937] m-4 bg-[#1e293b]/50 rounded-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
          <span>Core BFF API</span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
        <div className="w-full bg-[#334155] h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full w-full"></div>
        </div>
      </div>
    </aside>
  );
}
