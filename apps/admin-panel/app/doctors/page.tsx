import React from 'react';
import { UserCheck, Star, ShieldCheck } from 'lucide-react';

export default function DoctorsAdminPage() {
  const doctors = [
    { id: 'DOC-01', name: 'Dr. Aris Thorne, MD', title: 'Board-Certified Dermatologist', license: 'NPI-9482019482', rating: 4.9, sessions: 142, price: '$95/session', status: 'VERIFIED_ACTIVE' },
    { id: 'DOC-02', name: 'Dr. Elena Rostova, MD', title: 'Cosmetic & Laser Specialist', license: 'NPI-8839201928', rating: 4.8, sessions: 98, price: '$110/session', status: 'VERIFIED_ACTIVE' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[#111827] p-8 rounded-3xl border border-[#1f2937]">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-400 uppercase tracking-widest mb-1">
            <UserCheck className="w-4 h-4" />
            <span>CLINICIAN DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Dermatologist Network & Verification</h1>
          <p className="text-slate-400 text-sm mt-1">Oversight of licensed dermatologists, NPI licensing verification, and video session telemetry.</p>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 uppercase bg-[#1e293b]/50 border-b border-[#1f2937]">
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
            <tbody className="divide-y divide-[#1f2937]">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-[#1e293b]/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-indigo-400 font-bold">{d.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{d.name}</div>
                    <div className="text-xs text-slate-400">{d.title}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400">{d.license}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {d.rating}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold text-white">{d.sessions} consultations</td>
                  <td className="p-4 font-bold text-emerald-400">{d.price}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
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
