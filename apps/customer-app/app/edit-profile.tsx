import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Save } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@medivo.health');

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Edit Profile</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Update your personal information</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-4xl mx-auto w-full">
        <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
          <User size={20} color="#1F7FC4" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
          />
        </View>

        <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
          <Mail size={20} color="#1F7FC4" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-2"
        >
          <Save size={20} color="#FFFFFF" />
          <Text className="text-white font-extrabold text-base ml-2">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
