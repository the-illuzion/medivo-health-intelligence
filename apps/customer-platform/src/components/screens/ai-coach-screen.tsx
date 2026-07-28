'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Sparkles, Send } from 'lucide-react';
import {
  INK, INK_SOFT, TEXT_TERTIARY, FONT_STACK,
  initialMessages, chatSuggestions,
} from '../../data/mock-data';
import { ChatMessage } from '../../types';

function MessageBubble({ sender, text }: ChatMessage) {
  const isAI = sender === 'ai';
  return (
    <div className={`flex mb-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div
          className="rounded-full flex items-center justify-center mr-2 flex-shrink-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700"
          style={{ width: '26px', height: '26px', marginTop: '2px' }}
        >
          <Sparkles size={13} className="text-indigo-700 dark:text-indigo-300" />
        </div>
      )}
      <div
        className={`px-4 py-2.5 text-sm leading-relaxed border ${
          isAI
            ? 'bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-100 border-stone-100 dark:border-slate-700 shadow-sm'
            : 'bg-gradient-to-r from-indigo-700 to-indigo-600 text-white border-transparent shadow-md'
        }`}
        style={{
          maxWidth: '78%',
          borderRadius: isAI ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start mb-3">
      <div
        className="rounded-full flex items-center justify-center mr-2 flex-shrink-0 bg-indigo-50 dark:bg-slate-800"
        style={{ width: '26px', height: '26px', marginTop: '2px' }}
      >
        <Sparkles size={13} className="text-indigo-700 dark:text-indigo-300" />
      </div>
      <div
        className="px-4 py-3 flex gap-1 items-center bg-white dark:bg-slate-800 border border-stone-100 dark:border-slate-700 shadow-sm"
        style={{ borderRadius: '4px 18px 18px 18px' }}
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
}

export function AICoach({ onBack }: AICoachProps) {
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
    <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-900" style={{ fontFamily: FONT_STACK }}>
      <div className="relative mx-auto w-full flex flex-col" style={{ maxWidth: '480px', height: '100%' }}>
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0 border-b border-indigo-100/50 dark:border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform flex-shrink-0 border border-stone-100 dark:border-slate-700"
            aria-label="Go back"
          >
            <ChevronLeft size={18} color={INK_SOFT} />
          </button>
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4338CA, #0EA5E9)' }}
          >
            <Sparkles size={18} color="#FFFFFF" />
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color: INK }}>
              AI Coach
            </p>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full" style={{ width: '6px', height: '6px', background: '#059669' }} />
              <span className="text-xs" style={{ color: TEXT_TERTIARY }}>
                Online
              </span>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} sender={m.sender} text={m.text} />
          ))}
          {isTyping && <TypingBubble />}
        </div>

        <div className="no-scrollbar px-6 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {chatSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              className="flex-shrink-0 text-xs font-medium px-3.5 py-2 rounded-full active:scale-95 transition-transform bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700"
              style={{ color: INK_SOFT }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6 pt-2 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask your AI Coach..."
            className="coach-input flex-1 text-sm outline-none bg-stone-100 dark:bg-slate-800 text-stone-900 dark:text-slate-100 border border-transparent dark:border-slate-700"
            style={{ borderRadius: '9999px', padding: '12px 18px', color: INK }}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="rounded-full flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
            style={{ width: '44px', height: '44px', background: input.trim() ? 'linear-gradient(135deg,#4338CA,#4F46E5)' : '#E5E3F0' }}
          >
            <Send size={17} color={input.trim() ? '#FFFFFF' : '#A8A29E'} />
          </button>
        </div>
      </div>
    </div>
  );
}
