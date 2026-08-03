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
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">TRANSPARENT PRICING</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Invest in Clinical Skin Intelligence</h1>
        <p className="text-slate-400 text-base">Select the plan tailored for your skin telemetry and telehealth consultation needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-[#111827] border p-8 rounded-3xl space-y-6 relative flex flex-col justify-between ${
              plan.highlight ? 'border-indigo-500 shadow-2xl shadow-indigo-600/20' : 'border-[#1f2937]'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#1f2937] text-xs font-semibold text-slate-300">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
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
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-[#334155]'
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
