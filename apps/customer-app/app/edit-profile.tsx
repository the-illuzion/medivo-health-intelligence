import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Save } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@medivo.health');

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-white text-xl font-extrabold">Edit Profile</Text>
          <Text className="text-ink-soft text-xs">Update your personal information</Text>
        </View>
      </View>

      <View className="p-6 gap-4">
        <View className="bg-surface-elevated rounded-2xl p-4 border border-[#2A4A43] flex-row items-center">
          <User size={20} color="#64748B" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor="#64748B"
            className="flex-1 ml-3 text-white text-base"
          />
        </View>

        <View className="bg-surface-elevated rounded-2xl p-4 border border-[#2A4A43] flex-row items-center">
          <Mail size={20} color="#64748B" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#64748B"
            className="flex-1 ml-3 text-white text-base"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-lg mt-2"
        >
          <Save size={20} color="#0D1F1C" />
          <Text className="text-surface font-extrabold text-base ml-2">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
