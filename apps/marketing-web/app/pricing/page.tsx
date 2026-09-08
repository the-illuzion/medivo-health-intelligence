'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CreditCard,
  CalendarCheck,
  Zap,
  Users,
  Award,
  ArrowRight,
  ChevronDown,
  Info,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import { useDomainUrls } from '../utils/domainHelper';

export default function PricingPage() {
  const { appUrl } = useDomainUrls();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      badge: 'Essential Baseline',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'forever free',
      desc: 'Foundational AI multi-spectral scanning and standard ingredient verification for individuals.',
      features: [
        '1 Multi-Spectral AI Scan / month',
        'Basic 5-Biomarker Telemetry (Hydration, UV, Texture)',
        'Personalized OTC routine builder',
        'Ingredient safety & comedogenic scanner',
        'Standard mobile & web platform access',
      ],
      highlight: false,
      cta: 'Start Free Scan',
      buttonVariant: 'secondary',
    },
    {
      id: 'pro',
      name: 'Medivo Pro',
      badge: 'Most Popular',
      priceMonthly: '$19',
      priceAnnual: '$15',
      billedAnnualTotal: '$180 / year (Save $48)',
      period: 'per month',
      desc: 'Complete clinical telemetry, longitudinal progression tracking, and monthly dermatologist telehealth.',
      features: [
        'Unlimited Multi-Spectral AI Skin Scans',
        'Full 128-Point Sub-Dermal Biomarker Diagnostics',
        '1 Board-Certified Dermatologist Video Visit / month',
        '15% Off Compounded Prescription Formulations',
        'Longitudinal Disease & Flare-Up Tracking',
        'Exportable Physician-Ready PDF Health Dossiers',
        'Priority 24/7 AI Clinical Assistant Guidance',
      ],
      highlight: true,
      cta: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
    },
    {
      id: 'family',
      name: 'Family Clinical',
      badge: 'Comprehensive Family Care',
      priceMonthly: '$39',
      priceAnnual: '$31',
      billedAnnualTotal: '$372 / year (Save $96)',
      period: 'per month',
      desc: 'Multi-member household coverage with specialized pediatric screening and dedicated clinical concierge.',
      features: [
        'Up to 5 Individual Sub-Accounts & Profiles',
        'Unlimited AI Scans for All Family Members',
        '3 Board-Certified Dermatologist Video Visits / month',
        '25% Off Compounded Prescription Formulations',
        'Pediatric & Adolescent Skin Condition Telemetry',
        'Dedicated Clinical Account Concierge',
        'Priority Express Prescription Home Delivery',
      ],
      highlight: false,
      cta: 'Choose Family Clinical',
      buttonVariant: 'secondary',
    },
  ];

  const comparisonCategories = [
    {
      category: 'Diagnostic AI & Skin Telemetry',
      rows: [
        {
          feature: 'AI Multi-Spectral Face Scans',
          tooltip: 'Sub-second neural network facial landmark analysis',
          free: '1 / month',
          pro: 'Unlimited',
          family: 'Unlimited (5 Profiles)',
        },
        {
          feature: 'Biomarker Telemetry Depth',
          tooltip: 'Depth of clinical sub-dermal scoring',
          free: '3 Core Metrics',
          pro: 'All 8 Clinical Biomarkers',
          family: 'All 8 Clinical Biomarkers',
        },
        {
          feature: 'Longitudinal Telemetry Progression',
          tooltip: 'Track healing, barrier restoration, and anti-aging timelines',
          free: '30-Day History',
          pro: 'Unlimited Historical Timeline',
          family: 'Unlimited Historical Timeline',
        },
        {
          feature: 'Melanoma & Lesion Risk Pre-Screening',
          tooltip: 'ABCDE-guided dermatological boundary detection',
          free: 'Basic Warning Flags',
          pro: 'High-Precision SaMD Neural Mesh',
          family: 'High-Precision SaMD Neural Mesh',
        },
      ],
    },
    {
      category: 'Telehealth & Clinical Consultations',
      rows: [
        {
          feature: 'Board-Certified Dermatologist Visits',
          tooltip: 'Synchronous encrypted HD video consultations',
          free: 'Pay-per-visit ($79)',
          pro: '1 Included / month',
          family: '3 Included / month',
        },
        {
          feature: 'Prescription Formulation Review',
          tooltip: 'Licensed clinician Rx compounding authorization',
          free: '—',
          pro: 'Included',
          family: 'Included',
        },
        {
          feature: 'Pediatric & Teen Dermatology Support',
          tooltip: 'Age-appropriate dosage and active ingredient monitoring',
          free: '—',
          pro: '—',
          family: 'Dedicated Protocols',
        },
        {
          feature: 'Physician Clinical Health Report Export',
          tooltip: 'Downloadable PDF dossier for external clinic records',
          free: '—',
          pro: 'Included',
          family: 'Included',
        },
      ],
    },
    {
      category: 'Compounded Formulations & Pharmacy',
      rows: [
        {
          feature: 'Compounded Formulation Discount',
          tooltip: 'Exclusive savings on personalized clinical actives',
          free: 'Standard Retail',
          pro: '15% Off All Orders',
          family: '25% Off All Orders',
        },
        {
          feature: 'Automatic Refill & Barrier Calibration',
          tooltip: 'AI adjusts active percentages based on monthly skin updates',
          free: '—',
          pro: 'Included',
          family: 'Included',
        },
        {
          feature: 'Shipping & Delivery',
          tooltip: 'Temperature-controlled pharmaceutical logistics',
          free: 'Standard Shipping',
          pro: 'Free Expedited Shipping',
          family: 'Free Priority Overnight',
        },
      ],
    },
    {
      category: 'Security, Support & Compliance',
      rows: [
        {
          feature: 'HIPAA & SOC-2 Type II Compliance',
          tooltip: 'Zero third-party data monetization guarantee',
          free: 'Included',
          pro: 'Included',
          family: 'Included',
        },
        {
          feature: 'Customer & Clinical Support',
          tooltip: 'Availability of technical and medical coordinators',
          free: 'Standard Email',
          pro: '24/7 Priority Chat & AI',
          family: 'Dedicated Clinical Concierge',
        },
        {
          feature: 'HSA / FSA Reimbursement Support',
          tooltip: 'Itemized receipts with NPI & medical coding',
          free: '—',
          pro: 'Included',
          family: 'Included',
        },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Is Medivo eligible for HSA/FSA reimbursement?',
      answer:
        'Yes. Medivo Pro and Family Clinical subscriptions, as well as all dermatologist consultations and custom prescription formulations, are generally eligible for Health Savings Account (HSA) and Flexible Spending Account (FSA) reimbursement. We provide itemized receipts complete with clinical provider NPI numbers and diagnostic billing codes.',
    },
    {
      question: 'How do the monthly board-certified dermatologist video visits work?',
      answer:
        'Medivo Pro members receive 1 included telehealth video consultation every month (Family Clinical members receive 3). You can schedule an appointment directly within the Medivo web or mobile application with a board-certified dermatologist in your state. Unused monthly visits do not roll over.',
    },
    {
      question: 'Can I cancel or switch my plan at any time?',
      answer:
        'Yes. You can upgrade, downgrade, or cancel your subscription at any time with a single click inside your Patient Portal account settings. If you cancel, your access continues until the end of your current billing period without any penalties or hidden fees.',
    },
    {
      question: 'What is the difference between monthly and annual billing?',
      answer:
        'Annual billing provides a 20% discount across our Pro and Family plans (equivalent to 2 months free per year). Annual plans are charged once per year, whereas monthly plans are billed on the same calendar day every month.',
    },
    {
      question: 'Are Medivo AI scans a clinical replacement for in-person skin checks?',
      answer:
        'Medivo AI skin telemetry serves as a clinical-grade decision-support and longitudinal monitoring tool (FDA MDDS Class I compliant). While our 128-point neural mesh delivers over 99.4% classification precision, it is designed to augment, not replace, physical biopsy or emergency dermatological care. Our platform directly integrates board-certified physician consultations for clinical diagnosis.',
    },
    {
      question: 'How are custom compounded prescription formulations prepared?',
      answer:
        'When your dermatologist prescribes a custom treatment during a consultation or routine review, our FDA-registered 503A compounding pharmacy partners formulate your personalized active ingredients (e.g., micro-encapsulated Tretinoin, Niacinamide, Azelaic Acid, Tranexamic Acid) without harsh fillers and ship them directly to your door.',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#090D16] text-slate-800 dark:text-slate-100 transition-colors py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-brand-primary dark:text-sky-400 border border-sky-500/20 text-xs font-extrabold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            <span>TRANSPARENT CLINICAL PRICING</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Invest in Precision <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
              Skin Intelligence
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Select the clinical plan tailored for your skin telemetry, longitudinal tracking, and board-certified dermatologist consultation needs.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                  billingCycle === 'annual'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                  billingCycle === 'annual'
                    ? 'bg-white text-brand-primary'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-sky-500/[0.04] to-slate-50 dark:to-[#111827] border-2 border-brand-primary shadow-2xl shadow-sky-500/10 dark:shadow-none'
                    : 'bg-slate-50/70 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]'
                }`}
              >
                {/* Popular Pill */}
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
                      {!plan.highlight && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {displayPrice}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                        {plan.period}
                      </span>
                    </div>
                    {billingCycle === 'annual' && plan.billedAnnualTotal && (
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        Billed as {plan.billedAnnualTotal}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      What&apos;s Included:
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-8">
                  <a
                    href={`${appUrl}/register?plan=${plan.id}&billing=${billingCycle}`}
                    className={`w-full py-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                      plan.highlight
                        ? 'bg-brand-primary hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 active:scale-[0.99]'
                        : 'bg-white dark:bg-[#1F2937] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#374151] active:scale-[0.99]'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                    {plan.id === 'free' ? 'No credit card required' : '14-day risk-free guarantee • Cancel anytime'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">HSA / FSA Eligible</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Use pre-tax healthcare dollars</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">30-Day Guarantee</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Full refund if not 100% satisfied</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">256-Bit SSL Encrypted</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero data sharing with insurers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Cancel Anytime</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">1-click automated cancellation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compare Plan Capabilities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Review side-by-side clinical features, telehealth allocations, and pharmacy benefits.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-[#111827]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75">
                    <th className="py-5 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-2/5">
                      Platform Capability
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-extrabold text-slate-900 dark:text-white w-1/5">
                      Free Starter
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-extrabold text-brand-primary dark:text-sky-400 w-1/5 bg-sky-500/5 dark:bg-sky-500/10">
                      Medivo Pro
                    </th>
                    <th className="py-5 px-4 text-center text-xs font-extrabold text-slate-900 dark:text-white w-1/5">
                      Family Clinical
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {comparisonCategories.map((cat, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="bg-slate-100/50 dark:bg-slate-800/40">
                        <td
                          colSpan={4}
                          className="py-3 px-6 text-[11px] font-extrabold text-brand-primary uppercase tracking-widest"
                        >
                          {cat.category}
                        </td>
                      </tr>
                      {cat.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <span>{row.feature}</span>
                              <span title={row.tooltip} className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <Info className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">
                            {row.free}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white bg-sky-500/[0.02] dark:bg-sky-500/[0.05]">
                            {row.pro}
                          </td>
                          <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300 font-semibold">
                            {row.family}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Billing Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Clear answers regarding memberships, clinical consultations, HSA/FSA eligibility, and refunds.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#111827] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-brand-primary transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-primary' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white relative overflow-hidden shadow-2xl border border-sky-500/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-widest text-sky-300">
              <Award className="w-3.5 h-3.5" />
              <span>100% Risk-Free Clinical Guarantee</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Transform Your Skin Health?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Join over 50,000 active patients utilizing clinical AI telemetry and physician-compounded therapeutics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={`${appUrl}/register?plan=pro`}
                className="w-full sm:w-auto bg-brand-primary hover:bg-sky-400 text-white font-extrabold text-xs px-8 py-4 rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Start Medivo Pro Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/clinical-studies"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-8 py-4 rounded-2xl backdrop-blur-md transition-all border border-white/15"
              >
                View Clinical Validation Data
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
