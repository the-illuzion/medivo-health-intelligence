import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck, AlertCircle, Inbox } from 'lucide-react-native';
import { Badge } from '../src/components/ui';
import { useAuthStore } from '../src/store/useAuthStore';
import { useNotificationStore } from '../src/store/useNotificationStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const { token, isHydrated } = useAuthStore();
  const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (!isHydrated) return;
    fetchNotifications();
  }, [isHydrated, token, fetchNotifications]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 min-w-0 mr-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]">
              <ArrowLeft size={20} color="#1F7FC4" />
            </TouchableOpacity>
            <View className="flex-1 min-w-0">
              <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
                Notifications Center
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
                Real-time clinical alerts & health updates
              </Text>
            </View>
          </View>
          {unreadCount > 0 ? (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="flex-row items-center px-3 py-1.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/30"
            >
              <CheckCheck size={16} color="#1F7FC4" className="mr-1.5" />
              <Text className="text-brand-primary text-xs font-bold">Mark All Read</Text>
            </TouchableOpacity>
          ) : (
            <Badge label="All Caught Up" variant="success" className="hidden sm:flex" />
          )}
        </View>

        {/* Error Banner State */}
        {error ? (
          <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <AlertCircle size={20} color="#F43F5E" className="mr-2.5 flex-shrink-0" />
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold">{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchNotifications} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-extrabold">Retry ↻</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#1F7FC4" />
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-3">Fetching Clinical Alerts...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View className="items-center justify-center py-16 bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-[#374151]">
            <Inbox size={48} color="#94A3B8" className="mb-3" />
            <Text className="text-slate-900 dark:text-white font-bold text-base">No Notifications</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">You have no active alerts at this time.</Text>
          </View>
        ) : (
          <View className="gap-3">
            {notifications.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => n.unread && markAsRead(n.id)}
                className={`p-4 rounded-2xl border flex-row items-start transition-all shadow-sm ${
                  n.unread
                    ? 'bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/30'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#374151]'
                }`}
              >
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 mt-0.5 border ${
                  n.unread
                    ? 'bg-sky-500/20 border-sky-500/40'
                    : 'bg-slate-200/50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                }`}>
                  <Bell size={20} color={n.unread ? '#1F7FC4' : '#64748B'} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                      <Text className="text-slate-900 dark:text-white font-bold text-sm mr-2">{n.title}</Text>
                      {n.unread && <Badge label="New" variant="accent" />}
                    </View>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs">{n.timestamp}</Text>
                  </View>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs leading-5">{n.message || n.body}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
