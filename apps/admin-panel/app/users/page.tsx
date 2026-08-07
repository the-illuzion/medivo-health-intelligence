import React from 'react';
import { Users, ShieldCheck, ShieldAlert, MoreVertical } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: 'usr-101', name: 'Sarah Jenkins', email: 'sarah.j@example.com', skinType: 'Combination', score: 87, consent: true, role: 'PATIENT', registered: '2026-01-15' },
    { id: 'usr-102', name: 'Alex Morgan', email: 'alex.m@example.com', skinType: 'Sensitive', score: 82, consent: true, role: 'PATIENT', registered: '2026-02-10' },
    { id: 'usr-103', name: 'Dr. Aris Thorne', email: 'dr.thorne@medivo.com', skinType: 'N/A', score: 0, consent: true, role: 'DERMATOLOGIST', registered: '2025-11-01' },
    { id: 'usr-104', name: 'Emily Chen', email: 'emily.c@example.com', skinType: 'Oily', score: 79, consent: false, role: 'PATIENT', registered: '2026-03-04' },
  ];

  return (
    <div className="space-y-8 bg-white dark:bg-[#090D16] min-h-full transition-colors">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" />
            <span>IDENTITY & TELEMETRY REGISTRY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Accounts & Consent Controls</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage user profiles, clinical telemetry scores, and HIPAA consent permissions.</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151]">
              <tr>
                <th className="p-4 rounded-l-xl">User ID</th>
                <th className="p-4">User Identity</th>
                <th className="p-4">Skin Profile</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">HIPAA Consent</th>
                <th className="p-4">Role</th>
                <th className="p-4 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#374151]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-100 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{u.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">{u.skinType}</td>
                  <td className="p-4">
                    {u.score > 0 ? (
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{u.score}/100</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    {u.consent ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="w-3 h-3" /> GRANTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        <ShieldAlert className="w-3 h-3" /> REVOKED
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs font-bold text-brand-primary">{u.role}</td>
                  <td className="p-4">
                    <button className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1F2937]">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
