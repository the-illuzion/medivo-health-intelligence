import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Bot, User } from 'lucide-react-native';

export default function CoachScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello Alex! I am your Medivo AI Health Coach. Based on your latest scan, your skin hydration is up 4%. How can I help refine your evening routine?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    const botReply = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: 'Great question! For niacinamide, apply it right after cleansing to maximize barrier lipid synthesis.',
    };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput('');
  };

  return (
    <View className="flex-1 bg-surface">
      <View className="px-6 pt-14 pb-4 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-accent/20 rounded-full items-center justify-center mr-2">
            <Sparkles size={16} color="#818CF8" />
          </View>
          <View>
            <Text className="text-white text-lg font-extrabold">Medivo AI Coach</Text>
            <Text className="text-success-light text-xs font-semibold">Online • Health Intelligence Bot</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 gap-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <View className="w-8 h-8 bg-brand-primary/20 rounded-full items-center justify-center mr-2 mt-1">
                <Bot size={16} color="#10B981" />
              </View>
            )}
            <View
              className={`p-4 rounded-2xl max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-brand-primary rounded-tr-none'
                  : 'bg-surface-elevated border border-[#2A4A43] rounded-tl-none'
              }`}
            >
              <Text className={`text-sm leading-5 ${msg.sender === 'user' ? 'text-surface font-semibold' : 'text-white'}`}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Box */}
      <View className="p-4 bg-surface-elevated border-t border-[#2A4A43] flex-row items-center">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI Coach..."
          placeholderTextColor="#64748B"
          className="flex-1 bg-[#1C3833] text-white px-4 py-3 rounded-xl border border-[#2A4A43] mr-2 text-sm"
        />
        <TouchableOpacity
          onPress={handleSend}
          className="w-11 h-11 bg-brand-primary rounded-xl items-center justify-center"
        >
          <Send size={18} color="#0D1F1C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
