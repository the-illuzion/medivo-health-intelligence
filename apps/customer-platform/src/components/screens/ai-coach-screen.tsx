'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Sparkles, Send, Bot, Lightbulb, ArrowRight } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_TERTIARY, FONT_STACK,
  initialMessages, chatSuggestions,
} from '../../data/mock-data';
import { SimpleHeader } from '../shared/simple-header';
import { BottomNav } from '../shared/bottom-nav';
import { ChatMessage, ScreenKey } from '../../types';

function MessageBubble({ sender, text }: ChatMessage) {
  const isAI = sender === 'ai';
  return (
    <div className={`flex mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div
          className="rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 shadow-sm"
          style={{ width: '32px', height: '32px', marginTop: '2px' }}
        >
          <Sparkles size={16} className="text-indigo-700 dark:text-indigo-300" />
        </div>
      )}
      <div
        className={`px-4 py-3 text-sm leading-relaxed border ${
          isAI
            ? 'bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-100 border-stone-100 dark:border-slate-700 shadow-sm'
            : 'bg-gradient-to-r from-indigo-700 to-indigo-600 text-white border-transparent shadow-md'
        }`}
        style={{
          maxWidth: '82%',
          borderRadius: isAI ? '4px 20px 20px 20px' : '20px 20px 4px 20px',
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start mb-4">
      <div
        className="rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-indigo-50 dark:bg-slate-800"
        style={{ width: '32px', height: '32px', marginTop: '2px' }}
      >
        <Sparkles size={16} className="text-indigo-700 dark:text-indigo-300" />
      </div>
      <div
        className="px-4 py-3 flex gap-1.5 items-center bg-white dark:bg-slate-800 border border-stone-100 dark:border-slate-700 shadow-sm"
        style={{ borderRadius: '4px 20px 20px 20px' }}
      >
        <span className="coach-dot" style={{ animationDelay: '0ms' }} />
        <span className="coach-dot" style={{ animationDelay: '150ms' }} />
        <span className="coach-dot" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function getAIResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('sleep')) {
    return 'Aim for 7-8 hours tonight. Your skin does most of its repair work while you sleep, and your dark circle score improves most on nights you get full rest.';
  }
  if (lower.includes('water') || lower.includes('hydrat')) {
    return "You're averaging six glasses a day this week, up from four. Try adding one more right after you wake up — that tends to boost your hydration score the most.";
  }
  if (lower.includes('routine') || lower.includes('adjust')) {
    return "Your morning routine looks solid. For evenings, I'd suggest adding a gentle retinol 2-3 nights a week to keep building on your texture improvements.";
  }
  const fallback = [
    "That's a great instinct. Based on your last scan, I'd keep doing exactly that.",
    "Noted — I'll factor that into your next weekly summary.",
    'Good to know. Your trends this month suggest that is already paying off.',
  ];
  return fallback[Math.floor(Math.random() * fallback.length)]!;
}

interface AICoachProps {
  onBack: () => void;
  onSwitchTab?: (tab: ScreenKey) => void;
  showBack?: boolean;
}

export function AICoach({ onBack, onSwitchTab, showBack = true }: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function handleSend(text?: string) {
    const trimmed = (text !== undefined ? text : input).trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: getAIResponse(trimmed) }]);
      setIsTyping(false);
    }, 1400);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto max-w-md md:max-w-3xl lg:max-w-6xl lg:px-8" style={{ paddingBottom: '120px' }}>
        <SimpleHeader title="AI Health Coach" onBack={onBack} showBack={showBack} />

        {/* Responsive Layout Grid */}
        <div className="px-6 lg:px-0 mt-2 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Chat Canvas (Fills 100% Height on Mobile) */}
          <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-stone-100 dark:border-slate-700 shadow-md h-[calc(100vh-210px)] lg:h-[78vh] overflow-hidden mb-6 lg:mb-0">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Clinical AI Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">Online & Analyzing Trends</span>
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-700 px-3 py-1 rounded-full border border-indigo-100 dark:border-slate-600">
                HIPAA Protected
              </span>
            </div>

            {/* Chat Stream View */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
              {messages.map((m, i) => (
                <MessageBubble key={i} sender={m.sender} text={m.text} />
              ))}
              {isTyping && <TypingBubble />}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="no-scrollbar px-6 py-2.5 flex gap-2 overflow-x-auto border-t border-stone-100 dark:border-slate-700 bg-stone-50/40 dark:bg-slate-800/40">
              {chatSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition-all bg-white dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 border border-indigo-100 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Send Input Bar */}
            <div className="p-4 border-t border-stone-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask your AI Coach about hydration, routines..."
                className="flex-1 text-sm outline-none bg-stone-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-5 py-3 border border-transparent dark:border-slate-600 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform flex-shrink-0 shadow-md"
                style={{ background: input.trim() ? 'linear-gradient(135deg,#4338CA,#4F46E5)' : '#E5E3F0' }}
              >
                <Send size={18} color={input.trim() ? '#FFFFFF' : '#A8A29E'} />
              </button>
            </div>
          </div>

          {/* Desktop Right Sidebar: AI Clinical Insights & Quick Topics */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-5">
            {/* Assistant Profile Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Bot size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Medivo Intelligence AI</h4>
                  <p className="text-xs text-stone-500 dark:text-slate-400">Trained on 50,000+ clinical scans</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed mb-4">
                Ask any questions about your daily Health Score, skin hydration trends, or recommended skincare products.
              </p>
              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-slate-700/60 border border-indigo-100 dark:border-slate-600 flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                <span>Active Model</span>
                <span className="font-bold">v5.1 Clinical Engine</span>
              </div>
            </div>

            {/* Frequently Asked Health Topics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Suggested Topics</h4>
              </div>
              <div className="space-y-2">
                {[
                  'How to increase skin hydration score by 10%',
                  'Best evening routine for dark circles',
                  'When should I use Vitamin C vs Retinol?',
                  'How sleep quality impacts my skin barrier',
                ].map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(topic)}
                    className="w-full text-left p-3 rounded-2xl bg-stone-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-stone-100 dark:border-slate-600 text-xs font-semibold text-stone-700 dark:text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span>{topic}</span>
                    <ArrowRight size={14} className="text-stone-400 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        {onSwitchTab && <BottomNav active="coach" onSwitchTab={onSwitchTab} />}
      </div>
    </div>
  );
}
