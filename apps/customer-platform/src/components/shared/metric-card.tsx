'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Sparkline } from './sparkline';
import { INK, CARD_SHADOW, TEXT_SECONDARY } from '../../data/mock-data';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  score: number;
  unit?: string;
  delta: number;
  trendData: number[];
  span2?: boolean;
}

export function MetricCard({ icon: Icon, label, score, unit, delta, trendData, span2 }: MetricCardProps) {
  const isPositive = delta >= 0;
  const trendColor = isPositive ? '#059669' : '#D97706';
  return (
    <div className={`hover-lift bg-white dark:bg-slate-800 p-4 border border-stone-100 dark:border-slate-700 ${span2 ? 'col-span-2' : ''}`} style={{ borderRadius: '20px', boxShadow: CARD_SHADOW }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="rounded-full flex items-center justify-center bg-indigo-50 dark:bg-slate-700" style={{ width: '32px', height: '32px' }}>
          <Icon size={16} className="text-indigo-700 dark:text-indigo-300" />
        </div>
        <span className="text-xs font-semibold" style={{ color: trendColor }}>
          {isPositive ? '+' : ''}
          {delta}
        </span>
      </div>
      <p className="text-xs font-medium mb-1" style={{ color: TEXT_SECONDARY }}>
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold" style={{ color: INK }}>
          {score}
          {unit || ''}
        </p>
        <Sparkline data={trendData} color={trendColor} />
      </div>
    </div>
  );
}
