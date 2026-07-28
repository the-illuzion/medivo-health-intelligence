'use client';

import React, { useState } from 'react';
import { X, Sparkles, Droplet, Stethoscope, Moon, CheckCheck } from 'lucide-react';
import { INK, TEXT_TERTIARY } from '../../data/mock-data';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'score' | 'hydration' | 'doctor' | 'routine';
}

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'Scan Report Ready', message: 'Your latest Skin Score jumped to 87 (+4 this week). View detailed breakdown.', time: 'Today, 8:45 AM', unread: true, type: 'score' },
  { id: '2', title: 'Hydration Goal Achieved', message: 'Moisture levels reached 76%. Your morning routine is working well!', time: 'Yesterday', unread: true, type: 'hydration' },
  { id: '3', title: 'Upcoming Consultation', message: 'Video appointment with Dr. Elena Rostova confirmed for Jul 30 at 3:30 PM.', time: 'Jul 26', unread: false, type: 'doctor' },
  { id: '4', title: 'Evening Routine Reminder', message: "Don't forget your Retinol Smoothing Complex step tonight.", time: 'Jul 25', unread: false, type: 'routine' },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearUnread: () => void;
}

export function NotificationModal({ isOpen, onClose, onClearUnread }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  if (!isOpen) return null;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    onClearUnread();
  }

  function getIcon(type: NotificationItem['type']) {
    switch (type) {
      case 'score': return <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />;
      case 'hydration': return <Droplet size={16} className="text-cyan-600 dark:text-cyan-400" />;
      case 'doctor': return <Stethoscope size={16} className="text-pink-600 dark:text-pink-400" />;
      case 'routine': return <Moon size={16} className="text-purple-600 dark:text-purple-400" />;
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-stone-100 dark:border-slate-800 app-fade">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: INK }}>
              Notifications
            </h3>
            <span className="bg-indigo-100 dark:bg-slate-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full border border-transparent dark:border-slate-700">
              {notifications.filter((n) => n.unread).length} New
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800"
              title="Mark all as read"
            >
              <CheckCheck size={15} /> Mark read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center text-stone-500 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.unread
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800'
                  : 'bg-white dark:bg-slate-800 border-stone-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-700 border border-stone-200/60 dark:border-slate-600 flex items-center justify-center shadow-xs flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold" style={{ color: INK }}>
                      {item.title}
                    </h4>
                    <span className="text-[10px]" style={{ color: TEXT_TERTIARY }}>
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{item.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
