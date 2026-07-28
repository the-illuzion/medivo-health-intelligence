'use client';

import React, { useState } from 'react';
import { Search, X, Droplet, Stethoscope, CalendarCheck, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
import { INK, products, doctorsData, routineStepsData } from '../../data/mock-data';
import { ScreenKey } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenKey) => void;
}

export function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredDoctors = query.trim()
    ? doctorsData.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.specialty.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredRoutines = query.trim()
    ? routineStepsData.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.productName.toLowerCase().includes(query.toLowerCase()))
    : [];

  const popularTags = ['Hydration', 'SPF Shield', 'Elena Rostova', 'Retinol', 'Dark Circles'];

  function handleSelectTag(tag: string) {
    setQuery(tag);
  }

  function handleNavigateScreen(screen: ScreenKey) {
    onNavigate(screen);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 md:pt-20">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100 dark:border-slate-800 app-fade">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-100 dark:border-slate-800 flex items-center gap-3">
          <Search size={20} className="text-indigo-600 dark:text-indigo-400 ml-2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, doctors, routines, metrics..."
            className="flex-1 text-sm outline-none text-stone-800 dark:text-slate-100 placeholder-stone-400 bg-transparent font-medium"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1">
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-stone-100 dark:bg-slate-800 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>

        {/* Search Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 border border-transparent dark:border-slate-700 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigateScreen('products')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold" style={{ color: INK }}>
                      Marketplace
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateScreen('consultations')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-pink-600 dark:text-pink-400" />
                    <span className="text-xs font-bold" style={{ color: INK }}>
                      Doctors
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateScreen('routines')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold" style={{ color: INK }}>
                      Routines
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateScreen('scanReport')}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold" style={{ color: INK }}>
                      AI Report
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-stone-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Products</p>
                  <div className="space-y-2">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleNavigateScreen('products')}
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Droplet size={16} className="text-indigo-600 dark:text-indigo-400" />
                          <div>
                            <p className="text-xs font-bold" style={{ color: INK }}>
                              {p.name}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{p.category} · ${p.price}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-stone-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredDoctors.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Doctors</p>
                  <div className="space-y-2">
                    {filteredDoctors.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleNavigateScreen('consultations')}
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Stethoscope size={16} className="text-pink-600 dark:text-pink-400" />
                          <div>
                            <p className="text-xs font-bold" style={{ color: INK }}>
                              {d.name}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{d.specialty} · ${d.price}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-stone-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredRoutines.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Routines</p>
                  <div className="space-y-2">
                    {filteredRoutines.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleNavigateScreen('routines')}
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-700 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <CalendarCheck size={16} className="text-amber-600 dark:text-amber-400" />
                          <div>
                            <p className="text-xs font-bold" style={{ color: INK }}>
                              {r.title}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{r.productName}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-stone-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProducts.length === 0 && filteredDoctors.length === 0 && filteredRoutines.length === 0 && (
                <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-6">
                  No matching results found for &quot;{query}&quot;. Try another search term.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
