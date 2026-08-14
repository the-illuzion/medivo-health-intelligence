import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Save, Check } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.j@example.com');
  const [skinType, setSkinType] = useState(user?.skinType || 'Combination');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({ name, email, skinType });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      router.back();
    }, 800);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-14 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F7FC4" />
        </TouchableOpacity>
        <View>
          <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Edit Profile</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-xs">Update your confidential patient information</Text>
        </View>
      </View>

      <View className="p-6 gap-4 max-w-4xl mx-auto w-full">
        {savedSuccess ? (
          <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex-row items-center justify-center">
            <Check size={20} color="#10B981" />
            <Text className="text-emerald-500 font-bold text-sm ml-2">Profile changes saved successfully!</Text>
          </View>
        ) : null}

        <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold">Full Name:</Text>
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

        <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold">Email Address:</Text>
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

        <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold">Skin Type:</Text>
        <View className="flex-row gap-2">
          {['Combination', 'Sensitive', 'Oily', 'Dry'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSkinType(type)}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                skinType === type
                  ? 'bg-brand-primary/10 border-brand-primary'
                  : 'bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-[#374151]'
              }`}
            >
              <Text className={`text-xs font-bold ${skinType === type ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm mt-4"
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text className="text-white font-extrabold text-base ml-2">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
