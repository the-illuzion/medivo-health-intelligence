import React, { useState } from 'react';
import { useTheme } from './useTheme';
import { ThemeMode } from './tokens';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, setMode, resolvedMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Single button toggle: Click cycles through Light -> Dark -> System
  const handleQuickCycle = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  const getIcon = () => {
    if (mode === 'light') return '☀️';
    if (mode === 'dark') return '🌙';
    return '🖥️';
  };

  const getLabel = () => {
    if (mode === 'light') return 'Light';
    if (mode === 'dark') return 'Dark';
    return 'System';
  };

  const options: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light', label: 'Light', icon: '☀️' },
    { mode: 'dark', label: 'Dark', icon: '🌙' },
    { mode: 'system', label: 'System', icon: '🖥️' },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={handleQuickCycle}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 shadow-sm transition-all active:scale-95"
        title={`Theme: ${getLabel()} (Click to cycle Light → Dark → System)`}
      >
        <span className="text-sm">{getIcon()}</span>
        <span className="capitalize">{getLabel()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-1.5"
          onClick={() => setIsOpen(false)}
        >
          {options.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors ${
                mode === opt.mode
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
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
