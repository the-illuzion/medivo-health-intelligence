import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      id: 'n1',
      title: 'Routine Reminder',
      body: 'Time for your evening 0.5% Retinol Cream protocol.',
      time: '10 mins ago',
      type: 'routine',
    },
    {
      id: 'n2',
      title: 'Scan Score Improved',
      body: 'Your weekly hydration index increased by +3 points!',
      time: '2 hours ago',
      type: 'scan',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center flex-1 min-w-0">
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

        <View className="gap-3">
          {notifications.map((n) => (
            <View key={n.id} className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-row items-start shadow-sm">
              <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-xl items-center justify-center mr-3 mt-0.5 border border-sky-500/30">
                <Bell size={20} color="#1F7FC4" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-sm">{n.title}</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">{n.time}</Text>
                </View>
                <Text className="text-slate-600 dark:text-slate-400 text-xs leading-5">{n.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
