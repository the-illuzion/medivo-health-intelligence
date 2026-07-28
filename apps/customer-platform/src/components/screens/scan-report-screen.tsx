'use client';

import React from 'react';
import { Sparkles, TrendingUp, ChevronRight, ShoppingBag, Stethoscope } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  reportMetrics, recommendations,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { ScoreRing } from '../shared/score-ring';
import { ScreenKey } from '../../types';

interface ScanReportProps {
  onBack: () => void;
  onPush: (screen: ScreenKey) => void;
  showBack?: boolean;
}

export function ScanReport({ onBack, onPush, showBack = true }: ScanReportProps) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-5xl" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Scan Report" onBack={onBack} showBack={showBack} />

        {/* Hero Score Overview */}
        <div className="px-6 pt-2 mb-6 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-100 dark:border-slate-700 flex flex-col items-center text-center mb-6 lg:mb-0" style={{ boxShadow: CARD_SHADOW }}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-4" style={{ color: INK_SOFT }}>
              Current Skin Score
            </span>
            <ScoreRing score={87} />
            <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              <TrendingUp size={13} />
              <span className="text-xs font-bold">+4 points this week</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-3">
              Scan completed today at 8:42 AM · 98.4% Confidence
            </p>
          </div>

          {/* AI Clinical Insight */}
          <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-400" />
                <span className="text-sm font-bold tracking-wide text-indigo-200">AI Clinical Summary</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200 mb-4">
                Your skin barrier resilience has improved markedly. Hydration levels show an <strong className="text-emerald-400">+8% gain</strong> following your updated morning regimen. Pigmentation spots are fading predictably.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPush('products')}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <ShoppingBag size={14} /> View Products
              </button>
              <button
                type="button"
                onClick={() => onPush('consultations')}
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <Stethoscope size={14} /> Consult Doctor
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Breakdown Grid */}
        <div className="px-6 mb-8">
          <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
            Detailed Metric Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportMetrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-stone-100 dark:border-slate-700" style={{ boxShadow: CARD_SHADOW }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {m.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: m.delta >= 0 ? '#059669' : '#D97706' }}>
                      {m.delta >= 0 ? '+' : ''}{m.delta}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                      {m.score}{m.unit || ''}
                    </span>
                    <div className="w-32 bg-stone-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">{m.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-6">
          <h3 className="text-base font-bold mb-3 text-slate-900 dark:text-slate-100">
            Personalized Action Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-stone-100 dark:border-slate-700 flex items-center gap-3" style={{ boxShadow: CARD_SHADOW }}>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{r.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
