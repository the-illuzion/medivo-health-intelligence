import React from 'react';
import { ShieldCheck, Activity, Smartphone, Video, Sparkles, Check, ArrowRight, Award } from 'lucide-react';
import { SkinScoreSimulator } from './components/SkinScoreSimulator';

export default function MarketingLandingPage() {
  const trustBadges = [
    { label: 'HIPAA Compliant', icon: ShieldCheck },
    { label: '99.4% Clinical Accuracy', icon: Award },
    { label: 'FDA Registered Software', icon: Activity },
  ];

  const features = [
    {
      title: 'Multi-Spectral AI Facial Scanning',
      desc: 'Sub-dermal computer vision analysis extracting hydration, texture, pigmentation, and periorbital dark circle metrics in under 3 seconds.',
      icon: Activity,
      color: 'text-indigo-400',
    },
    {
      title: 'Board-Certified Telehealth Consultations',
      desc: 'Connect with licensed dermatologists for HD video appointments, digital prescriptions, and personalized skincare treatment plans.',
      icon: Video,
      color: 'text-sky-400',
    },
    {
      title: 'Custom Prescribed Formulations',
      desc: 'Dermatologist-approved active formulations compounding medical-grade ingredients delivered straight to your door.',
      icon: Sparkles,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold px-4 py-2 rounded-2xl">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Next-Gen Tele-Dermatology Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Clinical AI Skin Intelligence in Your Pocket
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Instant multi-spectral facial telemetry, 1-on-1 virtual dermatologist consultations, and custom prescription formulations — backed by 99.4% clinical diagnostic benchmarks.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/medivo-health-mobile-arm64-25MB.apk"
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-7 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-3 shadow-xl shadow-indigo-600/30 transition-all"
              >
                <Smartphone className="w-5 h-5" />
                <span>Download Android APK (25MB)</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-100 px-6 py-4 rounded-2xl font-bold text-sm transition-all"
              >
                Launch Web Scan Trial
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#1f2937] flex flex-wrap gap-6 text-xs font-bold text-slate-400">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Skin Telemetry Simulator */}
          <div>
            <SkinScoreSimulator />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">CLINICAL ENGINE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Complete Tele-Dermatology Platform</h2>
          <p className="text-slate-400 text-sm">Combining computer vision neural networks with board-certified clinical care.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-[#111827] border border-[#1f2937] p-8 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-colors">
                <div className={`w-12 h-12 rounded-2xl bg-[#1e293b] flex items-center justify-center ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Download CTA Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-indigo-900/60 via-[#111827] to-[#111827] border border-indigo-500/30 p-10 sm:p-14 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-3xl font-extrabold text-white">Ready for Clinical AI Telemetry?</h2>
            <p className="text-slate-300 text-sm">Download the production Release APK for Android or launch the Customer Web Portal instantly.</p>
          </div>
          <a
            href="/medivo-health-mobile-arm64-25MB.apk"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all flex-shrink-0"
          >
            <Smartphone className="w-5 h-5" />
            <span>Download App Binary</span>
          </a>
        </div>
      </section>
    </div>
  );
}
