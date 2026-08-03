'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export function SkinScoreSimulator() {
  const [hydration, setHydration] = useState(76);
  const [texture, setTexture] = useState(84);
  const [pigmentation, setPigmentation] = useState(79);

  const score = Math.round((hydration + texture + pigmentation) / 3);

  return (
    <div className="bg-[#111827] border border-[#1f2937] p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-3 py-1 rounded-xl mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Telemetry Simulator
          </div>
          <h3 className="text-xl font-bold text-white">Live AI Skin Score Simulator</h3>
          <p className="text-xs text-slate-400 mt-1">Adjust telemetry parameters to preview custom recommendations</p>
        </div>

        <div className="text-right">
          <span className="text-4xl font-extrabold text-white">{score}</span>
          <span className="text-xs text-slate-400 block font-semibold">Overall Score</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 pt-2">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">Hydration Index</span>
            <span className="text-sky-400">{hydration}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={hydration}
            onChange={(e) => setHydration(Number(e.target.value))}
            className="w-full accent-sky-500 bg-[#1e293b] rounded-lg h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">Texture Smoothness</span>
            <span className="text-emerald-400">{texture}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={texture}
            onChange={(e) => setTexture(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-[#1e293b] rounded-lg h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">Pigmentation Clarity</span>
            <span className="text-purple-400">{pigmentation}%</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            value={pigmentation}
            onChange={(e) => setPigmentation(Number(e.target.value))}
            className="w-full accent-purple-500 bg-[#1e293b] rounded-lg h-2"
          />
        </div>
      </div>

      {/* Simulated Recommendation Output */}
      <div className="bg-[#1e293b]/60 border border-[#334155] p-5 rounded-2xl space-y-3">
        <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">AI Formulation Recommendation</h4>
        <div className="space-y-2 text-xs font-semibold text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{hydration < 70 ? 'Triple-Weight Hyaluronic Acid Serum' : 'Lightweight Barrier Hydramist'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{texture < 80 ? '10% Niacinamide & Zinc Renewal Emulsion' : 'Micro-Peptide Restorative Cream'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
