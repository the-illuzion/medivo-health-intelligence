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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-[#111827] p-8 rounded-3xl border border-[#1f2937]">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-1">
            <Lock className="w-4 h-4" />
            <span>ENCRYPTED AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">HIPAA Compliance & Consent Audit Viewer</h1>
          <p className="text-slate-400 text-sm mt-1">Immutable cryptographic log of user consents, health data encryptions, and clinician accesses.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Compliance Report (CSV)
          </button>
        </div>
      </div>

      {/* Audit Log Table Container */}
      <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Cryptographic Event Stream</h3>
          <div className="flex gap-2">
            <button className="bg-[#1e293b] text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#334155]">
              <Filter className="w-3.5 h-3.5" />
              Filter by Event
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 uppercase bg-[#1e293b]/50 border-b border-[#1f2937]">
              <tr>
                <th className="p-4 rounded-l-xl">Log ID</th>
                <th className="p-4">Timestamp (UTC)</th>
                <th className="p-4">Event Action</th>
                <th className="p-4">Account Identifier</th>
                <th className="p-4">Resource Target</th>
                <th className="p-4 rounded-r-xl">Cryptographic Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1e293b]/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-indigo-400 font-bold">{log.id}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-100">{log.event}</td>
                  <td className="p-4 text-slate-300">{log.user}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{log.resource}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-xl">
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
