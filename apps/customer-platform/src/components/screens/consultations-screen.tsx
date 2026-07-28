'use client';

import React, { useState } from 'react';
import { Star, Video, Calendar, Clock, Stethoscope, CheckCircle2, X } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  doctorsData, appointmentsData,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { BottomNav } from '../shared/bottom-nav';
import { ScreenKey, Doctor } from '../../types';

interface ConsultationsProps {
  onBack: () => void;
  onPush?: (screen: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
  showBack?: boolean;
}

export function Consultations({ onBack, onSwitchTab, showBack = true }: ConsultationsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const specialties = ['All', 'Anti-Aging', 'Acne & Pigmentation', 'Sensitivities'];

  function handleOpenBooking(doc: Doctor) {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.slots[0] || '');
    setBookingConfirmed(false);
  }

  function handleConfirmBooking() {
    setBookingConfirmed(true);
    setTimeout(() => {
      setSelectedDoctor(null);
      setBookingConfirmed(false);
    }, 1800);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Dermatologist Consultations" onBack={onBack} showBack={showBack} />

        {/* Upcoming Video Appointment Banner */}
        {appointmentsData.length > 0 && (
          <div className="px-6 pt-2 mb-6">
            <div className="bg-gradient-to-r from-pink-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-700/50">
                  Upcoming Telehealth Appointment
                </span>
                <span className="text-xs text-stone-300">Jul 30, 2026</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-lg"
                  style={{ background: appointmentsData[0]?.avatarBg }}
                >
                  DR
                </div>
                <div>
                  <h3 className="text-base font-bold">{appointmentsData[0]?.doctorName}</h3>
                  <p className="text-xs text-stone-300">{appointmentsData[0]?.specialty} · 3:30 PM</p>
                </div>
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-98 transition-all"
              >
                <Video size={16} /> Join HD Video Call
              </button>
            </div>
          </div>
        )}

        {/* Specialty Filter Pills */}
        <div className="no-scrollbar px-6 mb-6 flex gap-2 overflow-x-auto">
          {specialties.map((spec) => {
            const isSel = spec === filterSpecialty;
            return (
              <button
                key={spec}
                type="button"
                onClick={() => setFilterSpecialty(spec)}
                className={`flex-shrink-0 text-xs font-bold px-4 py-2.5 rounded-full transition-all ${
                  isSel
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-slate-700 hover:bg-stone-50'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Doctors Directory Grid */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctorsData.map((doc) => (
            <div
              key={doc.id}
              className="hover-lift bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700 flex flex-col justify-between"
              style={{ boxShadow: CARD_SHADOW }}
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md flex-shrink-0"
                    style={{ background: doc.avatarBg }}
                  >
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-stone-400 dark:text-stone-400 mb-1">{doc.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400">
                      <Star size={13} fill="currentColor" />
                      <span className="font-bold text-stone-800 dark:text-stone-200">{doc.rating}</span>
                      <span className="text-stone-400">({doc.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="p-2.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-700/60 border border-indigo-100/60 dark:border-slate-600 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600 dark:text-stone-300">Specialty</span>
                    <span className="font-bold text-indigo-900 dark:text-indigo-300">{doc.specialty}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-slate-700/60 border border-stone-200/60 dark:border-slate-600 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-600 dark:text-stone-300">Next Slot</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{doc.nextAvailable}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-slate-700">
                <div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    ${doc.price}
                  </span>
                  <span className="text-xs text-stone-400"> / session</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenBooking(doc)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Confirmation Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-100 dark:border-slate-800 app-pop">
              {!bookingConfirmed ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Book Consultation
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-stone-500"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 mb-4 border border-stone-100 dark:border-slate-700">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                      style={{ background: selectedDoctor.avatarBg }}
                    >
                      {selectedDoctor.name.split(' ')[1]?.[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedDoctor.name}
                      </h4>
                      <p className="text-xs text-stone-400">{selectedDoctor.specialty} · ${selectedDoctor.price}</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Select Available Time Slot</p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {selectedDoctor.slots.map((slot) => {
                      const isSel = slot === selectedSlot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            isSel
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 active:scale-98 transition-all"
                  >
                    Confirm & Reserve (${selectedDoctor.price})
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-slate-100">
                    Appointment Confirmed!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                    Reserved with {selectedDoctor.name} for {selectedSlot}.
                  </p>
                  <p className="text-[11px] text-stone-400">A calendar invite & video link have been sent to your email.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="consultations" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
