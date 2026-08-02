import React from 'react';
import { Activity, Users, Video, DollarSign, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total AI Skin Scans', val: '14,892', change: '+18.4%', icon: Activity, tint: 'from-indigo-600/20 to-indigo-600/5', color: 'text-indigo-400' },
    { label: 'Active Platform Users', val: '8,410', change: '+12.1%', icon: Users, tint: 'from-emerald-600/20 to-emerald-600/5', color: 'text-emerald-400' },
    { label: 'Completed Consultations', val: '1,240', change: '+24.5%', icon: Video, tint: 'from-sky-600/20 to-sky-600/5', color: 'text-sky-400' },
    { label: 'Monthly Recurring Revenue', val: '$184,500', change: '+15.2%', icon: DollarSign, tint: 'from-purple-600/20 to-purple-600/5', color: 'text-purple-400' },
  ];

  const recentLogs = [
    { id: 'LOG-9482', event: 'HIPAA Consent Granted', user: 'sarah.j@example.com', ip: '192.168.1.45', status: 'VERIFIED', time: '2m ago' },
    { id: 'LOG-9481', event: 'AI Scan Data Encrypted', user: 'alex.m@example.com', ip: '192.168.1.88', status: 'VERIFIED', time: '14m ago' },
    { id: 'LOG-9480', event: 'Clinician Record Access', user: 'dr.thorne@medivo.com', ip: '10.0.4.12', status: 'VERIFIED', time: '28m ago' },
    { id: 'LOG-9479', event: 'Prescription Issued', user: 'dr.rostova@medivo.com', ip: '10.0.4.15', status: 'VERIFIED', time: '1h ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="flex justify-between items-end bg-gradient-to-r from-[#1e1b4b] via-[#111827] to-[#111827] p-8 rounded-3xl border border-[#1f2937]">
        <div>
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">SYSTEM EXECUTIVE CONSOLE</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Platform Telemetry Overview</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Real-time monitoring of AI scan inference nodes, clinician availability, HIPAA consent logs, and enterprise subscriptions.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#1e293b] border border-[#334155] px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">HIPAA Audit Compliance: 100%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-[#111827] border border-[#1f2937] p-6 rounded-3xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.tint} rounded-bl-full pointer-events-none`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-[#1e293b] ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                  <TrendingUp className="w-3 h-3" />
                  {item.change}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">{item.val}</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: System Health & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Audit Trail (2 cols) */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Live HIPAA Audit Logs</h3>
              <p className="text-xs text-slate-400">Cryptographic audit trail of user data events</p>
            </div>
            <a href="/hipaa-audit" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All Logs <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-400 uppercase bg-[#1e293b]/50 border-b border-[#1f2937]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Log ID</th>
                  <th className="p-3.5">Event Type</th>
                  <th className="p-3.5">Target Account</th>
                  <th className="p-3.5">IP Hash</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1e293b]/30 transition-colors">
                    <td className="p-3.5 font-mono text-xs text-slate-400">{log.id}</td>
                    <td className="p-3.5 font-bold text-slate-100">{log.event}</td>
                    <td className="p-3.5 text-slate-300">{log.user}</td>
                    <td className="p-3.5 font-mono text-xs text-slate-400">{log.ip}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Node Health Status (1 col) */}
        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white">Node Health Telemetry</h3>

          <div className="space-y-4">
            <div className="bg-[#1e293b]/60 border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Customer BFF API</h4>
                <p className="text-xs text-slate-400">Port 4000 · REST Services</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                100% ONLINE
              </span>
            </div>

            <div className="bg-[#1e293b]/60 border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">AI Vision Inference Engine</h4>
                <p className="text-xs text-slate-400">PyTorch Pipeline Node</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                OPERATIONAL
              </span>
            </div>

            <div className="bg-[#1e293b]/60 border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">PostgreSQL Database</h4>
                <p className="text-xs text-slate-400">13 Schema Monolith</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                HEALTHY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
