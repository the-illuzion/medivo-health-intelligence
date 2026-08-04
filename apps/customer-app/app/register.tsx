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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-6 pt-16 pb-6 items-center">
        <View className="w-16 h-16 bg-brand-primary/20 rounded-full items-center justify-center mb-4">
          <Shield size={32} color="#10B981" />
        </View>
        <Text className="text-white text-3xl font-extrabold tracking-tight mb-2">Create Account</Text>
        <Text className="text-ink-soft text-sm text-center">Join Medivo for personalized AI skin intelligence</Text>
      </View>

      <View className="px-6 gap-4">
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

        <View className="bg-surface-elevated rounded-2xl p-4 border border-[#2A4A43] flex-row items-center">
          <Lock size={20} color="#64748B" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#64748B"
            secureTextEntry
            className="flex-1 ml-3 text-white text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-brand-primary py-4 rounded-2xl items-center justify-center mt-2 flex-row shadow-lg"
        >
          <Text className="text-surface font-extrabold text-base mr-2">Create Account</Text>
          <ArrowRight size={20} color="#0D1F1C" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')} className="mt-4 items-center">
          <Text className="text-ink-soft text-sm">
            Already have an account? <Text className="text-brand-primary font-bold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
