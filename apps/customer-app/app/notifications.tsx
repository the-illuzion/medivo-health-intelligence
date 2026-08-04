import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Sparkles, Calendar, CheckCircle2 } from 'lucide-react-native';

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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Notifications</Text>
          <Text className="text-ink-soft text-xs">Alerts & health updates</Text>
        </View>
      </View>

      <View className="p-6 gap-3">
        {notifications.map((n) => (
          <View key={n.id} className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-row items-start">
            <View className="w-10 h-10 bg-brand-primary/20 rounded-xl items-center justify-center mr-3 mt-0.5">
              <Bell size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-white font-bold text-sm">{n.title}</Text>
                <Text className="text-ink-soft text-xs">{n.time}</Text>
              </View>
              <Text className="text-ink-soft text-xs leading-5">{n.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
