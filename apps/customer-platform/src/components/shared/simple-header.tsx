'use client';

import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { INK_SOFT } from '../../data/mock-data';

interface SimpleHeaderProps {
  title: string;
  onBack: () => void;
  showBack?: boolean;
  rightSlot?: ReactNode;
}

export function SimpleHeader({ title, onBack, showBack = true, rightSlot }: SimpleHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-7 pb-2">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-stone-100 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700"
          aria-label="Go back"
          title="Go back"
        >
          <ChevronLeft size={20} color={INK_SOFT} />
        </button>
      ) : (
        <div className="w-10 h-10" aria-hidden="true" />
      )}
      <span className="text-sm font-bold tracking-wide" style={{ color: INK_SOFT }}>
        {title}
      </span>
      {rightSlot || <div className="w-10 h-10" aria-hidden="true" />}
    </div>
  );
}
