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
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Notifications</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Alerts & health updates</Text>
        </View>
      </View>

      <View className="p-6 gap-3 max-w-4xl mx-auto w-full">
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
    </ScrollView>
  );
}
