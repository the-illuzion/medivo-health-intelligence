import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skinType, setSkinType] = useState('Combination');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setErrorMessage('');
    const success = await register(name, email, password, skinType);
    if (success) {
      router.replace('/otp-verify');
    } else {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Shield size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Create Patient Account</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">Join Medivo for confidential AI telemetry skin analysis</Text>
        </View>

        {errorMessage ? (
          <View className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-4">
            <Text className="text-rose-500 text-xs text-center font-bold">{errorMessage}</Text>
          </View>
        ) : null}

        <View className="gap-4">
          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
            <UserIcon size={20} color="#1F7FC4" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
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
              keyboardType="email-address"
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

          <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold mt-2">Select Primary Skin Type:</Text>
          <View className="flex-row gap-2">
            {['Combination', 'Sensitive', 'Oily', 'Dry'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSkinType(type)}
                className={`flex-1 py-2 rounded-xl items-center border ${
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
            onPress={handleRegister}
            disabled={isLoading}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center mt-4 flex-row shadow-sm"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white font-extrabold text-base mr-2">Create Account</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
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
