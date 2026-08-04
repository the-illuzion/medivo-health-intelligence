import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Bot } from 'lucide-react-native';
import { chatGPTHealthService, ChatMessageItem } from '../src/services/chatgpt-health/ChatGPTHealthService';
import { aiServiceManager, CombinedAIReport } from '../src/services/ai';
import { Badge } from '../src/components/ui';

export default function CoachScreen() {
  const router = useRouter();
  const [telemetry, setTelemetry] = useState<CombinedAIReport | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: 'Hello Alex! I am your Medivo AI Health Coach powered by ChatGPT Health intelligence. I have synced your latest Perfect Corp skin analysis (Hydration 93%) and Shen.ai telemetry (HRV 62ms). How can I assist your health regimen today?',
      timestamp: '12:00 PM',
      suggestedActions: [
        'Explain my hydration score',
        'Adjust my evening routine',
        'What do my HRV results mean?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTelemetry() {
      const data = await aiServiceManager.runFullScan('mock_frame', 'perfect_corp');
      setTelemetry(data);
    }
    loadTelemetry();
  }, []);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const aiReply = await chatGPTHealthService.generateHealthResponse(promptText, telemetry);
      setMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#090D16]">
      {/* Top Header */}
      <View className="px-6 pt-14 pb-4 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F7FC4" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center mr-3 border border-sky-500/30">
              <Sparkles size={20} color="#1F7FC4" />
            </View>
            <View>
              <Text className="text-slate-900 dark:text-white text-lg font-extrabold">ChatGPT Health Coach</Text>
              <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">Perfect Corp & Shen.ai Synced</Text>
            </View>
          </View>
        </View>
        <Badge label="GPT-4o Health" variant="accent" />
      </View>

      {/* Messages Scroll Area */}
      <ScrollView className="flex-1 p-6 max-w-4xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View key={msg.id} className="mb-4">
            <View className={`flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <View className="w-8 h-8 bg-sky-500/10 dark:bg-sky-500/20 rounded-full items-center justify-center mr-2 mt-1 border border-sky-500/30">
                  <Bot size={16} color="#1F7FC4" />
                </View>
              )}
              <View
                className={`p-4 rounded-2xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-brand-primary rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] rounded-tl-none shadow-sm'
                }`}
              >
                <Text className={`text-sm leading-6 ${msg.sender === 'user' ? 'text-white font-semibold' : 'text-slate-900 dark:text-white'}`}>
                  {msg.text}
                </Text>
                <Text
                  className={`text-[10px] mt-1.5 align-self-end ${
                    msg.sender === 'user' ? 'text-white/80 font-medium' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>

            {/* Interactive Suggestion Chips */}
            {msg.suggestedActions && (
              <View className="mt-3 ml-10 flex-row flex-wrap gap-2">
                {msg.suggestedActions.map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSendPrompt(chip)}
                    className="bg-sky-500/10 dark:bg-sky-500/20 px-3.5 py-2 rounded-xl border border-sky-500/30 active:bg-brand-primary/20"
                  >
                    <Text className="text-sky-600 dark:text-sky-400 text-xs font-semibold">✨ {chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View className="flex-row items-center ml-10 my-2">
            <ActivityIndicator size="small" color="#1F7FC4" />
            <Text className="text-slate-500 dark:text-slate-400 text-xs ml-2 font-medium">ChatGPT Health is reasoning...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input Box */}
      <View className="p-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-[#374151]">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask ChatGPT Health Coach..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white px-4 py-3 rounded-xl border border-slate-200 dark:border-[#374151] mr-2 text-sm"
          />
          <TouchableOpacity
            onPress={() => handleSendPrompt(input)}
            disabled={loading || !input.trim()}
            className={`w-11 h-11 rounded-xl items-center justify-center ${
              input.trim() ? 'bg-brand-primary shadow-sm' : 'bg-slate-200 dark:bg-[#1F2937] border border-slate-300 dark:border-[#374151]'
            }`}
          >
            <Send size={18} color={input.trim() ? '#FFFFFF' : '#94A3B8'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
