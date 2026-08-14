import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReset = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setErrorMessage('');
    const success = await resetPassword(email);
    if (success) {
      setIsSent(true);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-6">
          <ArrowLeft size={20} color="#1F7FC4" />
          <Text className="text-brand-primary font-bold text-sm ml-2">Back to Login</Text>
        </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Shield size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Reset Password</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">Enter your email to receive a secure password reset link</Text>
        </View>

        {isSent ? (
          <View className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 items-center">
            <CheckCircle size={40} color="#10B981" className="mb-3" />
            <Text className="text-emerald-500 font-extrabold text-base mb-1">Reset Link Sent!</Text>
            <Text className="text-slate-600 dark:text-slate-400 text-xs text-center mb-4">
              We've dispatched password reset instructions to <Text className="font-bold text-slate-900 dark:text-white">{email}</Text>.
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')} className="bg-brand-primary px-6 py-3 rounded-xl">
              <Text className="text-white font-bold text-sm">Return to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {errorMessage ? (
              <View className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-2">
                <Text className="text-rose-500 text-xs text-center font-bold">{errorMessage}</Text>
              </View>
            ) : null}

            <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
              <Mail size={20} color="#1F7FC4" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Registered email address"
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-3 text-slate-900 dark:text-white text-base"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              className="bg-brand-primary py-4 rounded-2xl items-center justify-center mt-2 shadow-sm"
            >
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-extrabold text-base">Send Reset Link</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
