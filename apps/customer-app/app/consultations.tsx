import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Video, Calendar, Star, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-extrabold">Dermatologist Network</Text>
            <Text className="text-ink-soft text-xs">Telehealth Provider Integration</Text>
          </View>
        </View>
        <Badge label="HIPAA Compliant" variant="success" />
      </View>

      <View className="p-6 gap-6">
        {/* Telehealth Network Banner */}
        <View className="bg-[#1C3833] p-4 rounded-2xl border border-[#2A4A43] flex-row items-center">
          <ShieldCheck size={20} color="#10B981" className="mr-3" />
          <View className="flex-1">
            <Text className="text-white font-bold text-sm">External Provider Network</Text>
            <Text className="text-ink-soft text-xs mt-0.5">
              Securely connected via Doximity & Amwell Telehealth APIs.
            </Text>
          </View>
        </View>

        {/* Doctor List */}
        {doctors.map((doc) => (
          <View key={doc.id} className="bg-surface-elevated p-5 rounded-2xl border border-[#2A4A43]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-brand-primary/20 rounded-full items-center justify-center mr-3 border border-brand-primary/40">
                  <Text className="text-brand-primary font-extrabold text-base">MD</Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{doc.name}</Text>
                  <Text className="text-ink-soft text-xs">{doc.specialty}</Text>
                  <Text className="text-brand-primary text-[11px] font-semibold mt-0.5">{doc.providerName}</Text>
                </View>
              </View>
            </View>

            {/* Slots Selection */}
            <Text className="text-white font-semibold text-xs mb-2">Available Consultation Slots:</Text>
            <View className="flex-row gap-2 mb-4">
              {doc.slots.map((slot) => {
                const isSelected = selectedSlot[doc.id] === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => handleSelectSlot(doc.id, slot)}
                    className={`px-3 py-2 rounded-xl border flex-row items-center ${
                      isSelected
                        ? 'bg-brand-primary border-brand-primary'
                        : 'bg-[#1C3833] border-[#2A4A43]'
                    }`}
                  >
                    <Calendar size={12} color={isSelected ? '#0D1F1C' : '#10B981'} />
                    <Text
                      className={`text-xs font-bold ml-1.5 ${
                        isSelected ? 'text-surface' : 'text-white'
                      }`}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Launch Telehealth Session"
              onPress={() => router.push(`/video-call/${doc.id}`)}
              icon={<Video size={18} color="#0D1F1C" />}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
