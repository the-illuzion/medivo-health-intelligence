import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Video, Calendar, ShieldCheck } from 'lucide-react-native';
import { externalTelehealthService, DoctorConsultation } from '../src/services/telehealth/TelehealthProvider';
import { Badge, Button } from '../src/components/ui';

export default function ConsultationsScreen() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorConsultation[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadDoctors() {
      const data = await externalTelehealthService.getDoctors();
      setDoctors(data);
    }
    loadDoctors();
  }, []);

  const handleSelectSlot = (docId: string, slot: string) => {
    setSelectedSlot((prev) => ({ ...prev, [docId]: slot }));
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-6 pt-10 lg:pt-6 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] shadow-sm">
        <View className="max-w-7xl mx-auto w-full flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#1F7FC4" />
            </TouchableOpacity>
            <View>
              <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">Dermatologist Telehealth Network</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Direct integration with Board-Certified MDs</Text>
            </View>
          </View>
          <Badge label="HIPAA Encrypted Stream" variant="success" />
        </View>
      </View>

      <View className="p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Telehealth Network Banner */}
        <View className="bg-sky-500/10 dark:bg-sky-500/20 p-5 rounded-3xl border border-sky-500/30 flex-row items-center shadow-sm">
          <ShieldCheck size={24} color="#1F7FC4" className="mr-4 flex-shrink-0" />
          <View className="flex-1">
            <Text className="text-slate-900 dark:text-white font-extrabold text-base">External Provider Network Connected</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-5">
              Securely connected via Doximity & Amwell Telehealth APIs with automatic neural scan report sync.
            </Text>
          </View>
        </View>

        {/* Doctor Grid (2 Columns on Desktop) */}
        <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <View key={doc.id} className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] flex-col justify-between shadow-sm">
              <View>
                <View className="flex-row items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <View className="flex-row items-center">
                    <View className="w-14 h-14 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-4 border border-sky-500/30">
                      <Text className="text-brand-primary font-extrabold text-lg">MD</Text>
                    </View>
                    <View>
                      <Text className="text-slate-900 dark:text-white font-extrabold text-lg">{doc.name}</Text>
                      <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">{doc.specialty}</Text>
                      <Text className="text-brand-primary text-xs font-extrabold mt-1">{doc.providerName}</Text>
                    </View>
                  </View>
                </View>

                {/* Slots Selection */}
                <Text className="text-slate-900 dark:text-white font-bold text-xs mb-3">Available Consultation Slots:</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {doc.slots.map((slot) => {
                    const isSelected = selectedSlot[doc.id] === slot;
                    return (
                      <TouchableOpacity
                        key={slot}
                        onPress={() => handleSelectSlot(doc.id, slot)}
                        className={`px-4 py-2.5 rounded-xl border flex-row items-center transition-all ${
                          isSelected
                            ? 'bg-brand-primary border-brand-primary shadow-sm'
                            : 'bg-white dark:bg-[#1F2937] border-slate-200 dark:border-[#374151]'
                        }`}
                      >
                        <Calendar size={14} color={isSelected ? '#FFFFFF' : '#1F7FC4'} />
                        <Text
                          className={`text-xs font-bold ml-2 ${
                            isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Button
                title="Launch Telehealth Session"
                onPress={() => router.push(`/video-call/${doc.id}`)}
                icon={<Video size={18} color="#FFFFFF" />}
                className="w-full"
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
