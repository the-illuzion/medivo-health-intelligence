'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Lock,
  HeartPulse,
  Users,
  CheckCircle2,
  Activity,
  ArrowRight,
  Server,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import { useDomainUrls } from '../utils/domainHelper';

export default function AboutPage() {
  const { appUrl } = useDomainUrls();

  const pillars = [
    {
      title: 'Clinical Diagnostic Rigor',
      desc: 'We benchmark every neural model against gold-standard dermatological tools — corneometry, 3D surface profilometry, and multi-rater double-blind dermatologist panels.',
      icon: Award,
    },
    {
      title: 'Zero-Trust Cryptographic Privacy',
      desc: 'Personal health data and facial telemetry belong solely to the patient. Encrypted with AES-256 at rest and TLS 1.3 in transit under strict HIPAA Rule H-1 compliance.',
      icon: Lock,
    },
    {
      title: 'Physician-in-the-Loop Telehealth',
      desc: 'AI empowers clinicians rather than replacing them. Board-certified dermatologists verify telemetry, conduct HD video consults, and formulate compounded prescriptions.',
      icon: Stethoscope,
    },
    {
      title: 'Global Health Accessibility',
      desc: 'Eliminating geographic constraints and months-long appointment waitlists, delivering instant precision skincare intelligence directly to any mobile device.',
      icon: Users,
    },
  ];

  const advisors = [
    {
      name: 'Dr. Aris Thorne, MD, FAAD',
      title: 'Chief Medical Officer',
      org: 'Board-Certified Dermatologist • Clinical Associate Professor of Dermatology • 15+ years in photomedicine and laser surgery.',
      initials: 'AT',
      badge: 'Board-Certified FAAD',
    },
    {
      name: 'Dr. Elena Rostova, MD, PhD',
      title: 'Head of Tele-Dermatology Operations',
      org: 'Clinical Dermatopathologist • Former Director of Telehealth Systems • Expert in pigmentation and barrier dysfunction.',
      initials: 'ER',
      badge: 'Clinical MD / PhD',
    },
    {
      name: 'Dr. Marcus Vance, PhD',
      title: 'Director of AI Vision & Neural Systems',
      org: 'Computer Vision Research Fellow • Specializing in deep-learning multi-spectral facial mesh reconstruction.',
      initials: 'MV',
      badge: 'AI Vision Lead',
    },
  ];

  const securityMatrix = [
    { rule: 'Encryption in Transit', standard: 'TLS 1.3 with Perfect Forward Secrecy', status: 'Active & Verified' },
    { rule: 'Encryption at Rest', standard: 'AES-256 GCM authenticated payload encryption', status: 'Active & Verified' },
    { rule: 'Patient Informed Consent', standard: 'Explicit HIPAA Rule H-2 verification before analysis', status: 'Enforced' },
    { rule: 'Access Control', standard: 'Role-Based Access Control (RBAC) with JWT rotation', status: 'Enforced' },
    { rule: 'Data Ownership & Rights', standard: 'Full patient export & instant deletion compliance', status: 'Supported' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32 bg-white dark:bg-[#090D16] transition-colors">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30 text-brand-primary dark:text-sky-300 text-xs font-extrabold px-4 py-2 rounded-2xl">
          <Activity className="w-4 h-4" />
          <span>ABOUT MEDIVO HEALTH INTELLIGENCE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-[1.1]">
          Democratizing Medical-Grade Dermatology Globally
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
          Medivo was founded by clinical dermatologists and computer vision scientists to bridge the gap between subjective skincare routines and objective, data-backed medical care.
        </p>
      </section>

      {/* 4 Core Pillars */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            OUR GUIDING PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Built on Medical Integrity & Patient Trust
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-4 shadow-sm hover:border-brand-primary/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-brand-primary dark:text-sky-400 border border-sky-500/30 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Medical Advisory Board */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-widest">
            CLINICAL LEADERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Medical Advisory Board
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Guiding our clinical validation, diagnostic benchmarks, and pharmaceutical compounding standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisors.map((adv, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 rounded-3xl space-y-5 shadow-sm flex flex-col justify-between hover:border-brand-primary/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 dark:bg-sky-500/20 text-brand-primary dark:text-sky-400 border border-brand-primary/30 flex items-center justify-center font-extrabold text-lg font-display">
                    {adv.initials}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {adv.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {adv.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-primary dark:text-sky-400 mt-0.5">
                    {adv.title}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {adv.org}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Clinical Credentials</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HIPAA Security Architecture */}
      <section className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] p-8 sm:p-14 rounded-3xl space-y-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold px-3.5 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>ENTERPRISE-GRADE HIPAA COMPLIANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            AES-256 Cryptographic Health Vault
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            All facial telemetry data and diagnostic records are isolated in encrypted object vaults. We implement strict Zero-Knowledge authentication safeguards to guarantee confidentiality.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 dark:bg-[#1F2937] text-slate-900 dark:text-white font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-5">Compliance Standard</th>
                <th className="py-3.5 px-5">Implementation Specification</th>
                <th className="py-3.5 px-5">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {securityMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                    {item.rule}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">
                    {item.standard}
                  </td>
                  <td className="py-3.5 px-5 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action CTA */}
      <section className="text-center max-w-xl mx-auto space-y-6 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Experience Medical-Grade AI Telemetry
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={appUrl}
            className="w-full sm:w-auto bg-brand-primary hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.99]"
          >
            <span>Launch Web App</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/clinical-studies"
            className="w-full sm:w-auto bg-slate-100 dark:bg-[#111827] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all"
          >
            View Clinical Studies ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
