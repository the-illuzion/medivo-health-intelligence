import React from 'react';
import { UserCheck, Star, ShieldCheck } from 'lucide-react';

export default function DoctorsAdminPage() {
  const doctors = [
    { id: 'DOC-01', name: 'Dr. Aris Thorne, MD', title: 'Board-Certified Dermatologist', license: 'NPI-9482019482', rating: 4.9, sessions: 142, price: '$95/session', status: 'VERIFIED_ACTIVE' },
    { id: 'DOC-02', name: 'Dr. Elena Rostova, MD', title: 'Cosmetic & Laser Specialist', license: 'NPI-8839201928', rating: 4.8, sessions: 98, price: '$110/session', status: 'VERIFIED_ACTIVE' },
  ];

  return (
    <div className="space-y-8 bg-white dark:bg-[#090D16] min-h-full transition-colors">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary uppercase tracking-widest mb-1">
            <UserCheck className="w-4 h-4" />
            <span>CLINICIAN DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dermatologist Network & Verification</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Oversight of licensed dermatologists, NPI licensing verification, and video session telemetry.</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151]">
              <tr>
                <th className="p-4 rounded-l-xl">Doc ID</th>
                <th className="p-4">Clinician</th>
                <th className="p-4">NPI License #</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Sessions Conducted</th>
                <th className="p-4">Rate</th>
                <th className="p-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#374151]">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-100 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-brand-primary font-bold">{d.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{d.title}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{d.license}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {d.rating}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white">{d.sessions} consultations</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{d.price}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED ACTIVE
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
