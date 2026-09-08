'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Activity, Droplets, SunMedium, Eye, Flame } from 'lucide-react';
import { useDomainUrls } from '../utils/domainHelper';

export function SkinScoreSimulator() {
  const { appUrl } = useDomainUrls();
  const [hydration, setHydration] = useState(78);
  const [texture, setTexture] = useState(82);
  const [pigmentation, setPigmentation] = useState(85);
  const [redness, setRedness] = useState(14); // Lower is better
  const [darkCircles, setDarkCircles] = useState(72);

  // Overall Score Calculation (normalized 0-100)
  const erythemaScore = 100 - redness;
  const overallScore = Math.round((hydration + texture + pigmentation + erythemaScore + darkCircles) / 5);

  const getClinicalGrade = (score: number) => {
    if (score >= 85) return { label: 'Optimal Grade', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 70) return { label: 'Good Condition', color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/30' };
    return { label: 'Attention Advised', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  const grade = getClinicalGrade(overallScore);

  return (
    <div className="bg-slate-50/90 dark:bg-[#111827]/90 backdrop-blur-xl border border-slate-200 dark:border-[#1F2937] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-brand-primary dark:text-sky-400 text-[11px] font-extrabold px-3 py-1 rounded-xl mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Spectral Telemetry</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Skin Health Simulator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Adjust biological telemetry indicators to preview targeted clinical regimens</p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">{overallScore}</span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border mt-1 inline-block ${grade.color}`}>
              {grade.label}
            </span>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4 pt-1">
        {/* Hydration */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>Dermal Hydration Index</span>
            </span>
            <span className="text-brand-primary font-mono font-extrabold">{hydration}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={hydration}
            onChange={(e) => setHydration(Number(e.target.value))}
            className="w-full accent-sky-600 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            aria-label="Hydration Index"
          />
        </div>

        {/* Texture */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cellular Texture Smoothness</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">{texture}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={texture}
            onChange={(e) => setTexture(Number(e.target.value))}
            className="w-full accent-emerald-600 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            aria-label="Texture Smoothness"
          />
        </div>

        {/* Pigmentation */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-indigo-500" />
              <span>UV Pigmentation Clarity</span>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-extrabold">{pigmentation}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={pigmentation}
            onChange={(e) => setPigmentation(Number(e.target.value))}
            className="w-full accent-indigo-600 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            aria-label="Pigmentation Clarity"
          />
        </div>

        {/* Redness / Erythema */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Erythema & Sensitivity Level</span>
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-mono font-extrabold">{redness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={redness}
            onChange={(e) => setRedness(Number(e.target.value))}
            className="w-full accent-rose-600 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            aria-label="Redness Level"
          />
        </div>

        {/* Dark Circles */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span>Periorbital Micro-Circulation</span>
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono font-extrabold">{darkCircles}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={darkCircles}
            onChange={(e) => setDarkCircles(Number(e.target.value))}
            className="w-full accent-purple-600 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            aria-label="Periorbital Tone"
          />
        </div>
      </div>

      {/* Simulated Recommendation Output */}
      <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700/80 p-5 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Compounded Prescription Protocol
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Clinically Matched
          </span>
        </div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {hydration < 70 ? 'Multi-Molecular Hyaluronic Acid & Ceramide Complex' : 'Hydra-Balance Barrier Recovery Fluid'}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {hydration < 70 ? 'Deep sub-dermal moisture infusion targeting trans-epidermal water loss.' : 'Sustains optimal cellular hydration equilibrium.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {redness > 20 ? 'Centella & Azelaic Acid 10% Calming Emulsion' : texture < 75 ? '10% Micro-Encapsulated Retinoid Matrix' : 'Bio-Peptide Elasticity Restorative Serum'}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {redness > 20 ? 'Suppresses vascular inflammation and restores epidermal baseline.' : 'Refines pore clarity and smooths dermal topography.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Action Link to Camera Scan */}
      <a
        href={appUrl}
        className="w-full bg-brand-primary hover:bg-sky-600 text-white py-3.5 px-6 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20 hover:shadow-lg transition-all active:scale-[0.99]"
      >
        <span>Experience Real AI Scan with Camera</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
