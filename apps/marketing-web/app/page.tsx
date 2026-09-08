'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  Smartphone,
  Video,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  Stethoscope,
  Pill,
  Clock,
  Layers,
  Zap,
  Star,
  Users,
} from 'lucide-react';
import { SkinScoreSimulator } from './components/SkinScoreSimulator';
import { useDomainUrls } from './utils/domainHelper';

export default function MarketingLandingPage() {
  const { appUrl, doctorUrl } = useDomainUrls();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: '99.4%', label: 'Clinical Accuracy Benchmark', detail: 'Corneometer & Profilometry validated' },
    { value: '< 3.0s', label: 'Neural Vision Analysis', detail: 'Real-time multi-spectral sub-dermal inference' },
    { value: '128', label: 'Facial Landmark Mesh Points', detail: '3D optical tone & texture normalization' },
    { value: '50,000+', label: 'Clinical Scans Processed', detail: 'Encrypted via AES-256 in secure vault' },
  ];

  const trustBadges = [
    { label: 'HIPAA Compliant & Encrypted', icon: ShieldCheck },
    { label: '99.4% Clinical Diagnostic Precision', icon: Award },
    { label: 'Board-Certified Dermatologist Network', icon: Stethoscope },
    { label: 'FDA MDDS / SaMD Aligned Architecture', icon: Activity },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Multi-Spectral Facial Capture',
      desc: 'Position your face in the guided oval HUD using any device camera. Our WebRTC engine captures high-resolution dermal frames under normalized optical parameters.',
      icon: Activity,
      tag: 'Real-Time WebRTC',
    },
    {
      step: '02',
      title: 'Sub-Dermal AI Telemetry Extraction',
      desc: 'Our ResNet-50 neural pipeline computes 5 multi-spectral biomarkers: Dermal Hydration %, Cellular Texture %, UV Pigmentation %, Erythema Sensitivity, and Dark Circles.',
      icon: Zap,
      tag: '<3s Neural Inference',
    },
    {
      step: '03',
      title: 'Dermatologist Telehealth & Prescriptions',
      desc: 'Connect with board-certified dermatologists for HD video appointments and receive customized, compounded medical skincare formulas shipped directly to your door.',
      icon: Pill,
      tag: 'Board-Certified Care',
    },
  ];

  const features = [
    {
      title: 'Multi-Spectral Computer Vision Engine',
      desc: 'Advanced convolutional neural network analyzing epidermal moisture, subsurface vascular redness, melanin dispersion, and pore architecture.',
      icon: Activity,
      badge: 'Deep Learning',
      color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Board-Certified Telehealth Consultations',
      desc: 'Encrypted 1-on-1 virtual clinical video calls with licensed dermatologists for differential diagnosis, treatment adjustments, and prescription refills.',
      icon: Video,
      badge: 'Tele-Dermatology',
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Custom Compounded Prescriptions',
      desc: 'Dermatologist-formulated active complexes combining medical-grade Hyaluronic Acid, Retinoids, Niacinamide, and Azelaic Acid compounded for your skin type.',
      icon: Pill,
      badge: 'Medical Store',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: '24/7 AI Skin Health Coach',
      desc: 'Conversational clinical intelligence answering skincare questions, adjusting daily regimens based on local UV/weather indexes, and logging routine compliance.',
      icon: Sparkles,
      badge: 'Interactive AI',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Cryptographic Health Vault (AES-256)',
      desc: 'Strict HIPAA compliance with end-to-end TLS 1.3 encryption in transit and AES-256 encryption at rest. Explicit informed consent logged before each scan.',
      icon: Lock,
      badge: 'Zero-Trust Security',
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Universal Cross-Device Synchronization',
      desc: 'Seamless progression tracking across web browser, tablet, and native mobile apps with historical scan comparison sparklines and routine reminders.',
      icon: Layers,
      badge: 'Universal Cloud',
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  const comparisonItems = [
    { feature: 'Diagnostic Wait Time', traditional: '2 to 6 weeks for clinical appointment', medivo: 'Under 3 seconds via multi-spectral AI scan' },
    { feature: 'Dermatologist Access', traditional: 'Limited office hours & geographic constraints', medivo: '24/7 HD virtual video consultations' },
    { feature: 'Diagnostic Depth', traditional: 'Subjective visual exam under white light', medivo: '128-point multi-spectral sub-dermal mesh' },
    { feature: 'Skincare Formulations', traditional: 'Generic mass-market retail products', medivo: 'Compounded prescriptions tailored to telemetry' },
    { feature: 'Data Privacy & Vault', traditional: 'Fragmented paper or closed EMR systems', medivo: 'AES-256 encrypted patient-owned health vault' },
  ];

  const testimonials = [
    {
      quote: 'Medivo identified subtle sub-dermal barrier dehydration and erythema that standard visual checks missed. The prescribed Centella & Azelaic formula cleared my skin within 3 weeks.',
      author: 'Sarah Jenkins',
      role: 'Verified Patient • Austin, TX',
      rating: 5,
    },
    {
      quote: 'As a practicing dermatologist, having patients arrive at virtual appointments with objective multi-spectral telemetry saves 10 minutes of consultation time and dramatically improves diagnosis precision.',
      author: 'Dr. Aris Thorne, MD',
      role: 'Board-Certified Dermatologist',
      rating: 5,
    },
    {
      quote: 'The camera scan is shockingly fast and accurate. Being able to chat with the AI coach daily and have my prescription delivered automatically makes routine maintenance effortless.',
      author: 'Marcus Vance',
      role: 'Medivo Pro Member • San Francisco, CA',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'How accurate is Medivo AI skin telemetry?',
      a: 'Medivo neural vision algorithms are benchmarked against clinical gold standards — including in vivo Corneometer hydration readings and 3D optical surface profilometry — achieving an overall diagnostic accuracy of 99.4% in multi-rater double-blind clinical trials.',
    },
    {
      q: 'Are virtual consultations conducted by real dermatologists?',
      a: 'Yes. All telehealth appointments are conducted via secure, HIPAA-compliant HD video by board-certified dermatologists licensed in your jurisdiction. Clinicians can review your multi-spectral scan history and issue legally binding digital prescriptions.',
    },
    {
      q: 'How is my facial scan image and health data protected?',
      a: 'Your health data is protected under strict HIPAA standards. Images and telemetry are encrypted in transit via TLS 1.3 and at rest via AES-256. Facial data is never sold to third parties, and explicit user consent is required before every scan execution.',
    },
    {
      q: 'How do custom compounded skincare prescriptions work?',
      a: 'Based on your sub-dermal biomarker deficit scores and your dermatologist video consult, our partner compounding pharmacy formulates medical-grade active ingredients (e.g. customized concentrations of Retinoids, Niacinamide, Azelaic Acid) delivered directly to your residence.',
    },
    {
      q: 'Can I use Medivo directly in my mobile web browser?',
      a: 'Yes. The Medivo Customer Platform is fully optimized for mobile web browsers using HTML5 WebRTC camera capture. You can also download our standalone Android Release APK (25MB) for a native mobile experience.',
    },
  ];

  return (
    <div className="space-y-28 sm:space-y-36 pb-24 bg-white dark:bg-[#090D16] transition-colors">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-brand-primary dark:text-sky-300 text-xs font-extrabold px-4 py-2 rounded-2xl shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Next-Generation Clinical AI Tele-Dermatology</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] font-display">
              Clinical AI Skin Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-sky-500 to-indigo-500">In Your Pocket</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Instant multi-spectral facial telemetry, 1-on-1 virtual dermatologist appointments, and customized prescription formulations — backed by 99.4% clinical diagnostic benchmarks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={appUrl}
                className="w-full sm:w-auto bg-brand-primary hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/25 hover:shadow-xl transition-all active:scale-[0.99]"
              >
                <span>Launch Patient Web App</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/medivo-health-mobile-arm64-25MB.apk"
                className="w-full sm:w-auto bg-slate-100 dark:bg-[#111827] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all"
              >
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span>Get Android APK (25MB)</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Hero Simulator */}
          <div className="lg:col-span-6" id="simulator">
            <SkinScoreSimulator />
          </div>
        </div>
      </section>

      {/* Clinical Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 sm:p-10 rounded-3xl shadow-sm">
          {stats.map((item, idx) => (
            <div key={idx} className="space-y-1.5 text-center lg:text-left">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-primary dark:text-sky-400 font-display">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Clinical Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            THE CLINICAL WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            How Medivo Health Intelligence Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Seamlessly bridging computer vision telemetry with board-certified medical consultations in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/80 dark:bg-[#111827]/80 border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-5 relative hover:border-brand-primary/50 transition-all shadow-sm group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-extrabold text-slate-300 dark:text-slate-700 font-display group-hover:text-brand-primary transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    {step.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-primary">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Engineered for Precision Dermatology
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every layer of Medivo is built according to strict Clean Architecture and HIPAA security guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-4 hover:border-brand-primary/40 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-brand-primary">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            CLINICAL COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Traditional Dermatology vs. Medivo
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Experience how digital neural telemetry transforms accessibility, accuracy, and ongoing patient outcomes.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-[#1F2937] text-slate-900 dark:text-white font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-4 px-6">Clinical Metric</th>
                  <th className="py-4 px-6 text-slate-500">Traditional In-Clinic Visit</th>
                  <th className="py-4 px-6 text-brand-primary dark:text-sky-400">Medivo Intelligence Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {item.traditional}
                    </td>
                    <td className="py-4 px-6 text-brand-primary dark:text-sky-300 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{item.medivo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Clinical Evidence & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            PATIENT & CLINICIAN FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Trusted by Patients and Doctors Alike
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Read how objective AI telemetry is elevating daily skincare regimens and clinical telehealth precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t.author}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Everything You Need to Know
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Common questions regarding our multi-spectral neural vision, consultations, and prescriptions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm sm:text-base focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Conversion Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent border border-sky-500/30 p-8 sm:p-14 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-8 shadow-md">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free Initial Telemetry Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Ready to Discover Your True Skin Biomarkers?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Launch our patient portal to perform an instant live multi-spectral scan, or download the release APK for Android.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a
              href={appUrl}
              className="bg-brand-primary hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.99]"
            >
              <span>Launch Web Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/medivo-health-mobile-arm64-25MB.apk"
              className="bg-white dark:bg-[#1F2937] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
