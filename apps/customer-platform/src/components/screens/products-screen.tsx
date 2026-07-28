'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_SECONDARY, TEXT_TERTIARY, FONT_STACK, CARD_SHADOW,
  categories, products,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { BottomNav } from '../shared/bottom-nav';
import { ScreenKey } from '../../types';

interface ProductsProps {
  onBack: () => void;
  onPush?: (screen: ScreenKey) => void;
  onSwitchTab?: (tab: ScreenKey) => void;
}

export function Products({ onBack, onSwitchTab }: ProductsProps) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [addedIds, setAddedIds] = useState<number[]>([]);

  function toggleAdd(id: number) {
    setAddedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  const filteredProducts =
    selectedCat === 'All' ? products : products.filter((p) => p.category === selectedCat);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="Marketplace" onBack={onBack} />

        {/* AI Recommendation Banner */}
        <div className="px-6 pt-2 mb-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-purple-300">
                <Sparkles size={16} /> AI Matched Formulas
              </div>
              <h2 className="text-lg font-bold">Curated for Your Hydration & Skin Score</h2>
              <p className="text-xs text-stone-300 mt-1">Formulated without parabens, dermatologically tested</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300 font-bold">
              AI
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="no-scrollbar px-6 mb-6 flex gap-2 overflow-x-auto">
          {categories.map((cat) => {
            const isSel = cat === selectedCat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`flex-shrink-0 text-xs font-bold px-4 py-2.5 rounded-full transition-all ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-slate-700 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const Icon = p.icon;
            const isAdded = addedIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="hover-lift bg-white dark:bg-slate-800 p-5 rounded-3xl border border-stone-100 dark:border-slate-700 flex flex-col justify-between"
                style={{ boxShadow: CARD_SHADOW }}
              >
                <div>
                  {/* SVG Product Glyph */}
                  <div
                    className="w-full h-36 rounded-2xl mb-4 flex items-center justify-center shadow-inner relative overflow-hidden dark:bg-slate-700/50"
                    style={{ background: p.tint }}
                  >
                    <div
                      className="w-20 h-24 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/40"
                      style={{ background: 'white' }}
                    >
                      <Icon size={28} color={p.accent} />
                      <span className="text-[9px] font-bold mt-2" style={{ color: p.accent }}>
                        MEDIVO
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-700 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-slate-600">
                    {p.tag}
                  </span>

                  <h3 className="text-base font-bold mt-3 mb-1" style={{ color: INK }}>
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400 text-xs">
                      <Star size={13} fill="currentColor" />
                      <span className="font-bold ml-1 text-stone-700 dark:text-stone-300">{p.rating}</span>
                    </div>
                    <span className="text-xs text-stone-400">· {p.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-slate-700">
                  <span className="text-lg font-bold" style={{ color: INK }}>
                    ${p.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAdd(p.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 hover:bg-indigo-100'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="products" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
