import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Save, Check } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
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
      <View className="p-6 gap-6 max-w-4xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center flex-1 min-w-0">
          <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]">
            <ArrowLeft size={20} color="#1F7FC4" />
          </TouchableOpacity>
          <View className="flex-1 min-w-0">
            <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
              Edit Patient Profile
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
              Update your confidential account information
            </Text>
          </View>
        </View>

        <View className="gap-4">
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
              style={{ outlineStyle: 'none' } as any}
              className="flex-1 ml-3 text-slate-900 dark:text-white text-base outline-none"
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
              style={{ outlineStyle: 'none' } as any}
              className="flex-1 ml-3 text-slate-900 dark:text-white text-base outline-none"
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
      </View>
    </ScrollView>
  );
}
