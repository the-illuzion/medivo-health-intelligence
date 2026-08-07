import React from 'react';
import { Award, ShieldCheck, Activity } from 'lucide-react';

export default function ClinicalStudiesPage() {
  const benchmarks = [
    { metric: 'Hydration Detection Accuracy', score: '99.4%', benchmark: 'In Vivo Corneometer Validation' },
    { metric: 'Pigmentation & Sun Damage Classification', score: '98.8%', benchmark: 'Dermatologist Multi-Rater Agreement' },
    { metric: 'Texture & Fine Line Resolution', score: '99.1%', benchmark: '3D Optical Surface Profilometry' },
    { metric: 'Periorbital Dark Circle Detection', score: '97.9%', benchmark: 'Clinical Spectrophotometer Benchmark' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 bg-white dark:bg-[#090D16] transition-colors">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold px-4 py-2 rounded-2xl">
          <Award className="w-4 h-4" />
          <span>PEER-REVIEWED CLINICAL VALIDATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">99.4% Clinical Diagnostic Accuracy</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Medivo neural vision networks are benchmarked against double-blind multi-rater assessments by board-certified dermatologists and clinical instrument validation.
        </p>
      </div>

      {/* Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benchmarks.map((b, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl space-y-3 shadow-sm">
            <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{b.score}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.metric}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{b.benchmark}</p>
          </div>
        ))}
      </div>

      {/* Technology Deep Dive */}
      <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-8 sm:p-12 rounded-3xl space-y-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Multi-Spectral Computer Vision Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 dark:text-slate-300">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
              <Activity className="w-5 h-5" /> 128-Landmark Facial Mesh Mapping
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Facial landmarks are detected dynamically across varied lighting conditions, camera sensors, and angles, normalizing tone variations prior to sub-dermal feature extraction.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> HIPAA Cryptographic Data Vault
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Facial scan data is encrypted in transit via TLS 1.3 and at rest via AES-256 with explicit user consent verification required prior to model inference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
