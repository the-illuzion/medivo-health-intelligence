import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, Mail, User, ArrowRight } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Shield size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Create Account</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">Join Medivo for personalized AI skin intelligence</Text>
        </View>

        <View className="gap-4">
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

          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
            <Lock size={20} color="#1F7FC4" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center mt-2 flex-row shadow-sm"
          >
            <Text className="text-white font-extrabold text-base mr-2">Create Account</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')} className="mt-4 items-center">
            <Text className="text-slate-600 dark:text-slate-400 text-sm">
              Already have an account? <Text className="text-brand-primary font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
