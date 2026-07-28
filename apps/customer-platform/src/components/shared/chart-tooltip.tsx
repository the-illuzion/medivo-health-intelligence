'use client';

import React from 'react';
import { INK_SOFT, TEXT_TERTIARY } from '../../data/mock-data';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-stone-100 dark:border-slate-700 shadow-xl">
      <p className="text-xs font-medium" style={{ color: TEXT_TERTIARY }}>
        {label}
      </p>
      <p className="text-sm font-bold" style={{ color: INK_SOFT }}>
        {payload[0]?.value}
      </p>
    </div>
  );
}
