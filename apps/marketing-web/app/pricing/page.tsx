import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'forever free',
      desc: 'Basic AI Face Scan & Recommendations',
      features: ['1 AI Skin Scan per month', 'Basic hydration & texture telemetry', 'Curated product recommendations', 'Community access'],
      highlight: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Medivo Pro',
      price: '$19',
      period: 'per month',
      desc: 'Unlimited AI Telemetry & Telehealth Consultations',
      features: ['Unlimited AI Skin Scans', 'Multi-spectral sub-dermal telemetry', '1 Free Dermatologist Video Consultation/mo', '15% Off Custom Prescribed Formulations', 'Priority 24/7 AI Coach access'],
      highlight: true,
      cta: 'Subscribe to Medivo Pro',
    },
    {
      name: 'Family Clinical',
      price: '$39',
      period: 'per month',
      desc: 'Complete Family Healthcare Coverage',
      features: ['Up to 4 Sub-Accounts', 'Unlimited AI Skin Scans for all profiles', '2 Free Telehealth Video Consultations/mo', '25% Off Custom Prescribed Formulations', 'Dedicated Account Manager'],
      highlight: false,
      cta: 'Get Family Clinical',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 bg-white dark:bg-[#090D16] transition-colors">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">TRANSPARENT PRICING</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">Invest in Clinical Skin Intelligence</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">Select the plan tailored for your skin telemetry and telehealth consultation needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-slate-50 dark:bg-[#111827] border p-8 rounded-3xl space-y-6 relative flex flex-col justify-between shadow-sm transition-all ${
              plan.highlight ? 'border-brand-primary shadow-xl shadow-sky-500/10 dark:border-brand-primary' : 'border-slate-200 dark:border-[#374151]'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{plan.period}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition-all mt-8 ${
                plan.highlight
                  ? 'bg-brand-primary hover:bg-sky-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#1F2937] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#374151]'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
