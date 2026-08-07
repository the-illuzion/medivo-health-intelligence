import React from 'react';
import { ShieldCheck, Download, Filter, Lock } from 'lucide-react';

export default function HipaaAuditPage() {
  const auditLogs = [
    { id: 'LOG-9482', timestamp: '2026-07-31 16:42:15', event: 'HIPAA_CONSENT_GRANTED', user: 'sarah.j@example.com', resource: 'USER_CONSENT_REGISTRY', ipHash: 'a8f9...39b1', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9481', timestamp: '2026-07-31 16:30:10', event: 'SCAN_DATA_ENCRYPTED_AES256', user: 'alex.m@example.com', resource: 'AI_SCAN_VAULT_S3', ipHash: 'b4c2...88a4', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9480', timestamp: '2026-07-31 15:45:00', event: 'CLINICIAN_RECORD_ACCESS', user: 'dr.thorne@medivo.com', resource: 'PATIENT_SCAN_901', ipHash: 'c7d1...12e9', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9479', timestamp: '2026-07-31 14:20:18', event: 'DIGITAL_PRESCRIPTION_ISSUED', user: 'dr.rostova@medivo.com', resource: 'RX_RECORD_442', ipHash: 'd3e2...99f8', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
    { id: 'LOG-9478', timestamp: '2026-07-31 12:10:04', event: 'JWT_BEARER_TOKEN_ROTATED', user: 'sarah.j@example.com', resource: 'AUTH_SERVICE', ipHash: 'a8f9...39b1', verification: 'CRYPTOGRAPHICALLY_VERIFIED' },
  ];

  return (
    <div className="space-y-8 bg-white dark:bg-[#090D16] min-h-full transition-colors">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
            <Lock className="w-4 h-4" />
            <span>ENCRYPTED AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">HIPAA Compliance & Consent Audit Viewer</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Immutable cryptographic log of user consents, health data encryptions, and clinician accesses.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-[#1F2937] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-[#374151] text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            Export Compliance Report (CSV)
          </button>
        </div>
      </div>

      {/* Audit Log Table Container */}
      <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cryptographic Event Stream</h3>
          <div className="flex gap-2">
            <button className="bg-white dark:bg-[#1F2937] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-[#374151] shadow-sm">
              <Filter className="w-3.5 h-3.5" />
              Filter by Event
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151]">
              <tr>
                <th className="p-4 rounded-l-xl">Log ID</th>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Event Action</th>
                <th className="p-4">Account Identifier</th>
                <th className="p-4">Resource Target</th>
                <th className="p-4 rounded-r-xl">Cryptographic Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#374151]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-100 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-brand-primary font-bold">{log.id}</td>
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{log.event}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{log.resource}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-xl">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {log.verification}
                    </span>
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
