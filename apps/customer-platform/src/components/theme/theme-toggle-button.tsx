'use client';

import React, { useState } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from './theme-provider';
import { INK_SOFT } from '../../data/mock-data';

export function ThemeToggleButton() {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  function getIcon() {
    switch (theme) {
      case 'dark':
        return <Moon size={18} className="text-amber-400" />;
      case 'light':
        return <Sun size={18} className="text-amber-500" />;
      case 'system':
      default:
        return <Laptop size={18} color={INK_SOFT} />;
    }
  }

  function getLabel() {
    switch (theme) {
      case 'dark': return 'Dark Mode';
      case 'light': return 'Light Mode';
      case 'system': return 'System Mode';
    }
  }

  function handleSelect(mode: ThemeMode) {
    setTheme(mode);
    setShowMenu(false);
  }

  return (
    <div className="relative inline-block">
      {/* Single Toggle Button */}
      <button
        type="button"
        onClick={cycleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu((v) => !v);
        }}
        className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all hover:bg-stone-100 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700"
        title={`Theme: ${getLabel()} (Click to cycle, right-click/press for options)`}
      >
        {getIcon()}
      </button>

      {/* Popover Menu for Direct 3-Option Selection */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-stone-200 dark:border-slate-700 p-1.5 z-50 app-pop">
          <button
            type="button"
            onClick={() => handleSelect('system')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              theme === 'system'
                ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop size={14} />
              <span>System</span>
            </div>
            {theme === 'system' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('dark')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon size={14} className="text-amber-400" />
              <span>Dark</span>
            </div>
            {theme === 'dark' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('light')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-white'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun size={14} className="text-amber-500" />
              <span>Light</span>
            </div>
            {theme === 'light' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
          </button>
        </div>
      )}
    </div>
  );
}
