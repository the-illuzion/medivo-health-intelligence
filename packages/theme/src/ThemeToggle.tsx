import React, { useState } from 'react';
import { useTheme } from './useTheme';
import { ThemeMode } from './tokens';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, setMode, resolvedMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const options: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light', label: 'Light', icon: '☀️' },
    { mode: 'dark', label: 'Dark', icon: '🌙' },
    { mode: 'system', label: 'System', icon: '🖥️' },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 shadow-sm transition-all"
        title="Switch theme"
      >
        <span>{resolvedMode === 'dark' ? '🌙' : '☀️'}</span>
        <span className="capitalize">{mode}</span>
        <span className="text-[10px] opacity-60">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-1.5 backdrop-blur-lg"
          onClick={() => setIsOpen(false)}
        >
          {options.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                mode === opt.mode
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
