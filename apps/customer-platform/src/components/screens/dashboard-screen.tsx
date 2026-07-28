'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell, Search, TrendingUp, ChevronRight, Sparkles, CalendarCheck, Stethoscope,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, BG_GRADIENT, FONT_STACK, CARD_SHADOW,
  quickActions, metricsData, weeklyData, monthlyData,
} from '../../data/mock-data';
import { ScoreRing } from '../shared/score-ring';
import { MetricCard } from '../shared/metric-card';
import { ChartTooltip } from '../shared/chart-tooltip';
import { BottomNav } from '../shared/bottom-nav';
import { ThemeToggleButton } from '../theme/theme-toggle-button';
import { ScreenKey } from '../../types';

interface DashboardProps {
  onPush: (next: ScreenKey) => void;
  onSwitchTab: (next: ScreenKey) => void;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
  hasUnreadNotifications?: boolean;
}

export function Dashboard({
  onPush,
  onSwitchTab,
  onOpenNotifications,
  onOpenSearch,
  hasUnreadNotifications = true,
}: DashboardProps) {
  const [loaded, setLoaded] = useState(false);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  const chartData = period === 'weekly' ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen w-full" style={{ background: BG_GRADIENT, fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl lg:px-8" style={{ paddingBottom: '120px' }}>
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="px-6 pt-7 pb-1 lg:hidden">
          <div className="flex items-center justify-between mb-5">
            {/* Top-Left Identity Anchor -> Profile */}
            <button
              type="button"
              onClick={() => onPush('profile')}
              className="rounded-full flex items-center justify-center font-semibold text-white text-lg active:scale-95 transition-transform shadow-md"
              style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
              title="View Profile & Settings"
            >
              S
            </button>

            {/* Top-Right Quick Action Cluster: Search + Theme Switcher + Notifications */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenSearch}
                className="rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-stone-100 dark:border-slate-700"
                style={{ width: '40px', height: '40px' }}
                title="Search"
              >
                <Search size={18} color={INK_SOFT} />
              </button>
              <ThemeToggleButton />
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-stone-100 dark:border-slate-700"
                style={{ width: '40px', height: '40px' }}
                title="Notifications"
              >
                <Bell size={18} color={INK_SOFT} />
                {hasUnreadNotifications && (
                  <span
                    className="absolute rounded-full"
                    style={{ width: '8px', height: '8px', top: '9px', right: '10px', background: '#F87171', border: '1.5px solid white' }}
                  />
                )}
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Good Morning,<br />Sarah 👋
          </h1>
          <p className="text-sm mt-1.5 text-stone-500 dark:text-slate-400">
            Your Health Score today is improving.
          </p>
        </div>

        {/* Top Hero & Summary Row (Grid on Desktop) */}
        <div className="px-6 lg:px-0 mt-5 mb-6 lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Hero Card */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-6 mb-6 lg:mb-0 border border-stone-100 dark:border-slate-700" style={{ borderRadius: '28px', boxShadow: CARD_SHADOW }}>
            {!loaded ? (
              <div className="flex flex-col items-center py-3">
                <div className="app-shimmer rounded-full" style={{ width: '152px', height: '152px' }} />
                <div className="app-shimmer rounded-full mt-5" style={{ width: '120px', height: '22px' }} />
                <div className="app-shimmer rounded-full mt-3" style={{ width: '180px', height: '14px' }} />
              </div>
            ) : (
              <div className="app-fade">
                <span className="text-xs font-bold uppercase tracking-wider block mb-4 text-stone-500 dark:text-slate-400">
                  Your Health Score
                </span>
                <div className="flex flex-col items-center">
                  <ScoreRing score={87} />
                  <div className="flex items-center gap-1 mt-4 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800">
                    <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold">
                      +4 this week
                    </span>
                  </div>
                  <p className="text-sm mt-3 text-center text-stone-600 dark:text-slate-300">
                    You&apos;re healthier than last week.
                  </p>
                  <button
                    type="button"
                    onClick={() => onPush('scanReport')}
                    className="flex items-center gap-1 mt-5 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 active:opacity-60 transition-all"
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Summary & Routine Card */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {/* Today's AI Summary Card - Fully Dark Mode Compatible */}
            <div className="p-5 flex-1 rounded-[28px] bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/30 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 border border-indigo-200/60 dark:border-slate-700 shadow-sm">
              {!loaded ? (
                <div className="space-y-2.5">
                  <div className="app-shimmer rounded-full" style={{ width: '150px', height: '16px' }} />
                  <div className="app-shimmer rounded-full" style={{ width: '100%', height: '13px' }} />
                  <div className="app-shimmer rounded-full" style={{ width: '90%', height: '13px' }} />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Today&apos;s AI Summary
                    </span>
                  </div>
                  <p className="app-fade text-sm leading-relaxed mb-2 text-stone-700 dark:text-slate-200" style={{ animationDelay: '120ms' }}>
                    Your skin hydration is up <strong className="text-emerald-600 dark:text-emerald-400 font-bold">6%</strong> this week, and those dark circles are looking softer too — your morning routine is clearly working.
                  </p>
                  <p className="app-fade text-sm leading-relaxed text-stone-700 dark:text-slate-200" style={{ animationDelay: '420ms' }}>
                    Keep the water intake going today to build on it.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Routine Snippet Widget */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
                  <CalendarCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Morning Routine Progress
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400">2 of 4 steps completed today</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPush('routines')}
                className="px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-700/80 rounded-xl hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors"
              >
                View Routine
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {loaded && (
          <div className="app-fade px-6 lg:px-0 mb-8" style={{ animationDelay: '0ms' }}>
            <div className="grid grid-cols-5 gap-3">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  type="button"
                  onClick={() => onPush(qa.target)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div
                    className="hover-lift rounded-full flex items-center justify-center dark:bg-slate-800 dark:border dark:border-slate-700 dark:shadow-md"
                    style={{ width: '56px', height: '56px', background: qa.bg }}
                  >
                    <qa.icon size={22} color={qa.color} />
                  </div>
                  <span className="text-xs font-medium text-stone-600 dark:text-slate-300">
                    {qa.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Health Metrics */}
        {loaded && (
          <div className="app-fade px-6 lg:px-0 mb-8" style={{ animationDelay: '80ms' }}>
            <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Health Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {metricsData.map((m) => (
                <MetricCard
                  key={m.label}
                  icon={m.icon}
                  label={m.label}
                  score={m.score}
                  unit={m.unit}
                  delta={m.delta}
                  trendData={m.data}
                  span2={m.span2}
                />
              ))}
            </div>
          </div>
        )}

        {/* Progress Section & Recent Scan Grid */}
        {loaded && (
          <div className="app-fade px-6 lg:px-0 lg:grid lg:grid-cols-12 lg:gap-6" style={{ animationDelay: '160ms' }}>
            {/* Chart */}
            <div className="lg:col-span-8 mb-6 lg:mb-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Progress Trend
                </h3>
                <div className="flex p-1 rounded-full bg-stone-200/60 dark:bg-slate-800/90 border border-stone-200/50 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPeriod('weekly')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      period === 'weekly'
                        ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriod('monthly')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      period === 'monthly'
                        ? 'bg-white dark:bg-indigo-600 text-indigo-900 dark:text-white shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 pt-5 border border-stone-100 dark:border-slate-700" style={{ borderRadius: '22px', boxShadow: CARD_SHADOW }}>
                <div style={{ width: '100%', height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4338CA" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="var(--color-card-border)" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#A8A29E', fontSize: 11 }} />
                      <YAxis hide domain={['dataMin - 8', 'dataMax + 8']} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#4338CA" strokeWidth={2.5} fill="url(#progressGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Scan Widget */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-slate-100">
                Recent Scan
              </h3>
              <div className="hover-lift bg-white dark:bg-slate-800 p-5 flex flex-col justify-between h-full border border-stone-100 dark:border-slate-700" style={{ borderRadius: '22px', boxShadow: CARD_SHADOW }}>
                <div>
                  <p className="text-xs font-medium mb-2 text-stone-400">
                    Today, 8:42 AM
                  </p>
                  <div className="flex items-center gap-6 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        87
                      </p>
                      <p className="text-xs text-stone-500 dark:text-slate-400">
                        Health Score
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        84
                      </p>
                      <p className="text-xs text-stone-500 dark:text-slate-400">
                        Skin Score
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onPush('scanReport')}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2.5 rounded-xl active:scale-95 transition-transform bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-600"
                  >
                    View Report <ChevronRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onPush('consultations')}
                    className="p-2 rounded-xl text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-slate-700 hover:bg-pink-100 dark:hover:bg-slate-600 flex items-center justify-center border border-pink-100/50 dark:border-slate-600"
                    title="Consult Doctor"
                  >
                    <Stethoscope size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <BottomNav active="dashboard" onSwitchTab={onSwitchTab} />
      </div>
    </div>
  );
}
