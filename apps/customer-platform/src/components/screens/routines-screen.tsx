'use client';

import React, { useState } from 'react';
import { Sun, Moon, CheckCircle2, Clock, Sparkles, ChevronRight, Flame } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  routineStepsData,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { BottomNav } from '../shared/bottom-nav';
import { ScreenKey, RoutineStep } from '../../types';

interface RoutinesProps {
  onBack: () => void;
  onPush: (screen: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
  showBack?: boolean;
}

export function Routines({ onBack, onPush, onSwitchTab, showBack = true }: RoutinesProps) {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [steps, setSteps] = useState<RoutineStep[]>(routineStepsData);

  function toggleStep(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }

  const currentSteps = steps.filter((s) => s.timeOfDay === activeTab);
  const completedCount = currentSteps.filter((s) => s.completed).length;
  const totalCount = currentSteps.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl lg:px-8" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Skincare & Wellness Routines" onBack={onBack} showBack={showBack} />

        {/* Responsive Desktop Grid */}
        <div className="px-6 lg:px-0 mt-2 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column (Streak Banner, Tab Controls, & Progress Widget) */}
          <div className="lg:col-span-5 flex flex-col gap-5 mb-6 lg:mb-0">
            {/* Streak Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1">
                  <Flame size={14} /> Consistency Streak
                </span>
                <h2 className="text-2xl font-black mt-0.5">🔥 12 Day Streak</h2>
                <p className="text-xs text-amber-100 mt-1">Keep up your morning & evening steps</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl border border-white/30">
                87%
              </div>
            </div>

            {/* Morning / Evening Segmented Control */}
            <div className="flex p-1.5 rounded-2xl bg-stone-200/60 dark:bg-slate-800 border border-stone-200/50 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('morning')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'morning'
                    ? 'bg-white dark:bg-slate-700 text-indigo-900 dark:text-white shadow-md'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
                }`}
              >
                <Sun size={16} className={activeTab === 'morning' ? 'text-amber-500' : ''} />
                Morning ({steps.filter((s) => s.timeOfDay === 'morning' && s.completed).length}/4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('evening')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'evening'
                    ? 'bg-white dark:bg-slate-700 text-indigo-900 dark:text-white shadow-md'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
                }`}
              >
                <Moon size={16} className={activeTab === 'evening' ? 'text-indigo-400' : ''} />
                Evening ({steps.filter((s) => s.timeOfDay === 'evening' && s.completed).length}/3)
              </button>
            </div>

            {/* Routine Progress Widget */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {activeTab === 'morning' ? 'Morning Routine Completion' : 'Evening Routine Completion'}
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}% Completed</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column (Steps Checklist & Product Refills) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <h3 className="hidden lg:block text-base font-bold text-slate-900 dark:text-slate-100">
              {activeTab === 'morning' ? 'Morning Step Checklist' : 'Evening Step Checklist'}
            </h3>

            <div className="space-y-3">
              {currentSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`cursor-pointer bg-white dark:bg-slate-800 p-4 rounded-2xl border transition-all flex items-center justify-between hover-lift ${
                      step.completed
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-slate-800'
                        : 'border-stone-100 dark:border-slate-700'
                    }`}
                    style={{ boxShadow: CARD_SHADOW }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                          step.completed
                            ? 'bg-emerald-100 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400'
                            : 'bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-400">Step {step.stepNumber}</span>
                          <h4
                            className={`text-sm font-bold ${step.completed ? 'line-through text-stone-400' : 'text-slate-900 dark:text-slate-100'}`}
                          >
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-slate-400">{step.productName} · {step.duration}</p>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        step.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 dark:border-slate-600'
                      }`}
                    >
                      {step.completed && <CheckCircle2 size={18} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Refill Recommended Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg flex items-center justify-between mt-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-200">Refill Recommended</span>
                </div>
                <h4 className="text-sm font-bold">Hydra Renew Serum is running low</h4>
                <p className="text-xs text-stone-300 mt-0.5">Re-order now to keep your routine consistent</p>
              </div>
              <button
                type="button"
                onClick={() => onPush('products')}
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
              >
                Shop <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="routines" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
