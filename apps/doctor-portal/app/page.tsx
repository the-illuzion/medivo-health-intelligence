'use client';

import React from 'react';
import { Activity, Calendar, Users, Video, ShieldCheck, Clock, FileText } from 'lucide-react';
import { ThemeToggle } from '@medivo/theme';

export default function DoctorPortalPage() {
  const appointments = [
    { id: '1', patient: 'Alex Morgan', time: '10:30 AM', status: 'Confirmed', condition: 'Barrier Damage Assessment' },
    { id: '2', patient: 'Sarah Jenkins', time: '11:15 AM', status: 'In Waiting Room', condition: 'Eczema Flare Telemetry' },
    { id: '3', patient: 'David Chen', time: '02:00 PM', status: 'Scheduled', condition: 'Retinol Consultation' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1f1c] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-200 dark:border-[#2a4a43] bg-white/80 dark:bg-[#162e29]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">Medivo Clinical Portal</h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Dermatologist Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA Verified MD</span>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#2a4a43]">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              DR
            </div>
            <div>
              <p className="text-sm font-bold leading-none">Dr. Rachel Vance, MD</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Board-Certified Dermatologist</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-8 gap-8 flex flex-col">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#162e29] p-6 rounded-3xl border border-slate-200 dark:border-[#2a4a43] shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Today's Visits</span>
              <Calendar className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">8</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">3 Completed</p>
          </div>

          <div className="bg-white dark:bg-[#162e29] p-6 rounded-3xl border border-slate-200 dark:border-[#2a4a43] shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Active Patients</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">142</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">+12 this month</p>
          </div>

          <div className="bg-white dark:bg-[#162e29] p-6 rounded-3xl border border-slate-200 dark:border-[#2a4a43] shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Telehealth Queue</span>
              <Video className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">2</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Ready for Call</p>
          </div>

          <div className="bg-white dark:bg-[#162e29] p-6 rounded-3xl border border-slate-200 dark:border-[#2a4a43] shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">AI Telemetry Scans</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">19</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">Pending MD Sign-off</p>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white dark:bg-[#162e29] rounded-3xl border border-slate-200 dark:border-[#2a4a43] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Upcoming Patient Consultations</h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Provider Network
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-[#2a4a43]">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{apt.patient}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{apt.condition}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1c3833] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2a4a43]">
                    {apt.time}
                  </span>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm">
                    <Video className="w-3.5 h-3.5" />
                    Start Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
