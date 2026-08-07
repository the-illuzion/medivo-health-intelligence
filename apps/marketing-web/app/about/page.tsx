import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  const advisors = [
    { name: 'Dr. Aris Thorne, MD', title: 'Chief Medical Officer', org: 'Board-Certified Dermatologist & Clinical Researcher' },
    { name: 'Dr. Elena Rostova, MD', title: 'Head of Telehealth Operations', org: 'Laser & Pigmentation Specialist' },
    { name: 'Dr. Marcus Vance, PhD', title: 'Director of AI Vision Systems', org: 'Former AI Research Scientist, Computer Vision' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 bg-white dark:bg-[#090D16] transition-colors">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">ABOUT MEDIVO</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Democratizing Medical-Grade Dermatology</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Our mission is to empower individuals globally with instant AI facial telemetry, transparent dermatologist care, and personalized prescriptions.
        </p>
      </div>

      {/* Advisory Board Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">Medical Advisory Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advisors.map((adv, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-brand-primary border border-sky-500/30 flex items-center justify-center font-bold text-lg">
                {adv.name.split(' ')[1][0]}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{adv.name}</h3>
              <p className="text-xs font-semibold text-brand-primary">{adv.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{adv.org}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 sm:p-12 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
          <ShieldCheck className="w-6 h-6" />
          <span>ENTERPRISE-GRADE HIPAA COMPLIANCE</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">AES-256 Encrypted Telemetry Vault</h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">
          Every face scan image and health record is encrypted at rest using AES-256 and in transit via TLS 1.3. User consent is explicitly verified prior to model inference.
        </p>
      </div>
    </div>
  );
}
