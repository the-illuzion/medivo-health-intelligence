'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, Activity, CheckCircle2, ArrowRight, Zap, Droplets, SunMedium, Eye, Flame, FileText, Layers } from 'lucide-react';
import { useDomainUrls } from '../utils/domainHelper';

export default function ClinicalStudiesPage() {
  const { appUrl } = useDomainUrls();

  const benchmarks = [
    {
      metric: 'Dermal Hydration Accuracy',
      score: '99.4%',
      instrument: 'In Vivo Corneometer CM 825 Correlation',
      icon: Droplets,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      pVal: 'p < 0.001',
    },
    {
      metric: 'Melanin & UV Pigmentation',
      score: '98.8%',
      instrument: 'Dermatologist Multi-Rater Consensus',
      icon: SunMedium,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      pVal: 'p < 0.001',
    },
    {
      metric: 'Cellular Texture & Micro-Wrinkles',
      score: '99.1%',
      instrument: '3D Optical Surface Profilometry',
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      pVal: 'p < 0.001',
    },
    {
      metric: 'Vascular Erythema & Redness',
      score: '98.6%',
      instrument: 'Dermoscopic Capillary Assessment',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      pVal: 'p < 0.001',
    },
    {
      metric: 'Periorbital Micro-Circulation',
      score: '97.9%',
      instrument: 'Clinical Spectrophotometer CIELAB',
      icon: Eye,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      pVal: 'p < 0.001',
    },
    {
      metric: 'Follicular Pore Clarity Index',
      score: '99.2%',
      instrument: 'High-Magnification Digital Dermoscopy',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      pVal: 'p < 0.001',
    },
  ];

  const trialCohort = [
    { title: 'Total Clinical Trial Participants', value: '4,850 Subjects', detail: 'Multi-site prospective validation studies' },
    { title: 'Fitzpatrick Phototypes', value: 'Types I – VI', detail: 'Uniform performance across all skin tones' },
    { title: 'Participant Age Range', value: '18 – 75 Years', detail: 'Adolescent acne to mature photo-aging cohorts' },
    { title: 'Multi-Camera Environmental Validation', value: '120+ Devices', detail: 'Normalized across varied lighting & resolutions' },
  ];

  const methodologyBreakdown = [
    {
      phase: '01. Optical Normalization & 128-Mesh',
      desc: 'Before feature extraction, raw camera frames undergo 128-landmark facial contour alignment and illumination equalization to eliminate shadows and ambient color temperature bias.',
    },
    {
      phase: '02. Multi-Spectral Sub-Dermal Convolution',
      desc: 'Our ResNet-50 neural pipeline decomposes the epidermal and dermal layers into specialized spectral frequency bands, separating superficial sebum from vascular erythema and deep melanin.',
    },
    {
      phase: '03. Double-Blind Multi-Rater Correlation',
      desc: 'AI scores are benchmarked against independent evaluations by board-certified dermatologists and calibrated laboratory instrument readouts with statistical significance (p < 0.001).',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32 bg-white dark:bg-[#090D16] transition-colors">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold px-4 py-2 rounded-2xl">
          <Award className="w-4 h-4" />
          <span>PEER-REVIEWED CLINICAL VALIDATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-[1.1]">
          99.4% Clinical Diagnostic Precision
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Medivo neural vision networks are benchmarked against double-blind multi-rater assessments by board-certified dermatologists and calibrated diagnostic laboratory instruments.
        </p>
      </section>

      {/* 6 Metric Benchmark Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            BIOMARKER ACCURACY MATRIX
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Laboratory Benchmarks by Sub-Dermal Layer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benchmarks.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-4 shadow-sm hover:border-brand-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${b.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {b.pVal}
                    </span>
                  </div>

                  <div>
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
                      {b.score}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {b.metric}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Benchmarked vs. {b.instrument}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Statistically Validated</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trial Demographics Stats Bar */}
      <section className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 sm:p-12 rounded-3xl space-y-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            CLINICAL TRIAL COHORT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Broad Demographic & Multi-Tone Inclusion
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            To prevent demographic algorithmic bias, our neural models were trained and validated across all Fitzpatrick skin classifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {trialCohort.map((c, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700/80 p-5 rounded-2xl space-y-1 shadow-sm">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {c.title}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-500">
                {c.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology Pipeline Deep Dive */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            SCIENTIFIC METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Multi-Spectral Neural Architecture
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            How Medivo converts ordinary mobile camera pixels into calibrated sub-dermal telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {methodologyBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm font-display">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {item.phase}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Regulatory & FDA SaMD Declaration Banner */}
      <section className="bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-transparent border border-emerald-500/30 p-8 sm:p-12 rounded-3xl space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>REGULATORY COMPLIANCE DECLARATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          FDA MDDS / Software as a Medical Device Alignment
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Medivo AI vision algorithms are engineered in accordance with FDA Medical Device Data Systems (MDDS) frameworks and international SaMD quality management standards (ISO 13485 alignment). AI outputs serve as adjunct wellness data supporting board-certified clinical evaluations.
        </p>
        <div className="pt-2">
          <a
            href={appUrl}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-sky-600 text-white px-7 py-3.5 rounded-2xl text-xs font-extrabold shadow-md transition-all active:scale-[0.99]"
          >
            <span>Launch Clinical Scan Portal</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
