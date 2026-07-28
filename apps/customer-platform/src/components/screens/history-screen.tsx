'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  overviewData, historyGroups,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { ChartTooltip } from '../shared/chart-tooltip';
import { BottomNav } from '../shared/bottom-nav';
import { ScreenKey } from '../../types';

interface HistoryProps {
  onBack: () => void;
  onPush: (next: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
}

export function History({ onBack, onPush, onSwitchTab }: HistoryProps) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Scan History" onBack={onBack} />

        <div className="px-6 pt-2 mb-6 lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Trend Chart Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700 mb-6 lg:mb-0" style={{ boxShadow: CARD_SHADOW }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: INK }}>
              8-Week Health Score Trend
            </h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4338CA" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F1F0F7" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#A8A29E', fontSize: 11 }} />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="#4338CA" strokeWidth={2.5} fill="url(#historyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grouped Scans Timeline */}
          <div className="lg:col-span-6 space-y-6">
            {historyGroups.map((group) => (
              <div key={group.month}>
                <span className="text-xs font-bold uppercase tracking-wider block mb-3 text-stone-400">
                  {group.month}
                </span>
                <div className="space-y-2.5">
                  {group.entries.map((entry, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onPush('scanReport')}
                      className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-stone-100 dark:border-slate-700 flex items-center justify-between hover-lift text-left"
                      style={{ boxShadow: CARD_SHADOW }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-700 flex flex-col items-center justify-center text-indigo-900 dark:text-indigo-300">
                          <span className="text-xs font-bold">{entry.date.split(' ')[1]}</span>
                          <span className="text-[10px] uppercase font-bold">{entry.date.split(' ')[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold" style={{ color: INK }}>
                              Score: {entry.healthScore}
                            </h4>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              +{entry.delta}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">{entry.time} · Skin Score {entry.skinScore}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="history" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
