import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Video, Calendar, Star, ShieldCheck } from 'lucide-react-native';

export default function ConsultationsScreen() {
  const router = useRouter();

  const doctors = [
    {
      id: 'doc_1',
      name: 'Dr. Elena Rostova, MD',
      specialty: 'Board Certified Dermatologist',
      experience: '12 yrs exp',
      rating: 4.9,
      nextAvailable: 'Today, 4:30 PM',
    },
    {
      id: 'doc_2',
      name: 'Dr. Marcus Vance, MD',
      specialty: 'Clinical Dermatology & AI Telehealth',
      experience: '15 yrs exp',
      rating: 4.95,
      nextAvailable: 'Tomorrow, 10:00 AM',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Dermatologist Consultations</Text>
          <Text className="text-ink-soft text-xs">Telehealth video care & prescription access</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        {doctors.map((doc) => (
          <View key={doc.id} className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-brand-primary/20 rounded-full items-center justify-center mr-3 border border-brand-primary/40">
                  <Text className="text-brand-primary font-bold text-base">MD</Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{doc.name}</Text>
                  <Text className="text-ink-soft text-xs">{doc.specialty}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-[#1C3833] p-3 rounded-xl mb-4 border border-[#2A4A43]">
              <View className="flex-row items-center">
                <Calendar size={14} color="#10B981" />
                <Text className="text-white text-xs font-medium ml-1.5">{doc.nextAvailable}</Text>
              </View>
              <View className="flex-row items-center">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-white text-xs font-bold ml-1">{doc.rating}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/video-call/${doc.id}`)}
              className="bg-brand-primary py-3.5 rounded-xl items-center justify-center flex-row shadow-lg"
            >
              <Video size={18} color="#0D1F1C" />
              <Text className="text-surface font-extrabold text-sm ml-2">Start Video Call</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
