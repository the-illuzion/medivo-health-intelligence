import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, ArrowRight } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { verifyOtp, isLoading } = useAuthStore();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    if (code.length < 4) {
      setErrorMessage('Please enter the full 4-digit verification code.');
      return;
    }
    setErrorMessage('');
    const success = await verifyOtp(code);
    if (success) {
      router.replace('/onboarding');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>
      <View className="max-w-md mx-auto w-full px-6 py-12">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mb-4 border border-sky-500/30">
            <Shield size={32} color="#1F7FC4" />
          </View>
          <Text className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2 text-center">Security Verification</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm text-center">
            We've sent a 4-digit security PIN to your email address
          </Text>
        </View>

        {errorMessage ? (
          <View className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-4">
            <Text className="text-rose-500 text-xs text-center font-bold">{errorMessage}</Text>
          </View>
        ) : null}

        <View className="gap-6">
          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-[#374151] flex-row items-center shadow-sm">
            <Lock size={20} color="#1F7FC4" />
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Enter 4-digit PIN (e.g. 7482)"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={4}
              className="flex-1 ml-3 text-slate-900 dark:text-white text-center text-xl tracking-widest font-extrabold"
            />
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            disabled={isLoading}
            className="bg-brand-primary py-4 rounded-2xl items-center justify-center flex-row shadow-sm"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white font-extrabold text-base mr-2">Verify & Continue</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
