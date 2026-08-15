import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    setErrorMessage('');
    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const activeError = errorMessage || authError;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Shield size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Welcome Back</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">Sign in to access your confidential skin intelligence</Text>
        </View>

        {activeError ? (
          <View className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-4">
            <Text className="text-rose-500 text-xs text-center font-bold">{activeError}</Text>
          </View>
        ) : null}

        <View className="gap-4">
          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm focus:border-brand-primary">
            <Mail size={20} color="#1F7FC4" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#94A3B8"
              style={{ outlineStyle: 'none' } as any}
              className="flex-1 ml-3 text-slate-900 dark:text-white text-base outline-none"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm focus:border-brand-primary">
            <Lock size={20} color="#1F7FC4" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={{ outlineStyle: 'none' } as any}
              className="flex-1 ml-3 text-slate-900 dark:text-white text-base outline-none"
            />
          </View>

          <TouchableOpacity onPress={() => router.push('/forgot-password')} className="align-self-end my-1">
            <Text className="text-right text-brand-primary text-xs font-bold">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center mt-2 flex-row shadow-sm active:opacity-90"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white font-extrabold text-base mr-2">Sign In</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')} className="mt-4 items-center">
            <Text className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account? <Text className="text-brand-primary font-bold">Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
