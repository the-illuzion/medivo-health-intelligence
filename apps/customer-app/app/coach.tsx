import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, Bot, User, ShieldCheck } from 'lucide-react-native';
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
    <View className="flex-1 bg-surface">
      {/* Top Header */}
      <View className="px-6 pt-14 pb-4 bg-surface-elevated border-b border-[#2A4A43] flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-accent/20 rounded-full items-center justify-center mr-3 border border-accent/40">
              <Sparkles size={20} color="#818CF8" />
            </View>
            <View>
              <Text className="text-white text-lg font-extrabold">ChatGPT Health Coach</Text>
              <Text className="text-success-light text-xs font-semibold">Perfect Corp & Shen.ai Synced</Text>
            </View>
          </View>
        </View>
        <Badge label="GPT-4o Health" variant="accent" />
      </View>

      {/* Messages Scroll Area */}
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View key={msg.id} className="mb-4">
            <View className={`flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <View className="w-8 h-8 bg-brand-primary/20 rounded-full items-center justify-center mr-2 mt-1 border border-brand-primary/40">
                  <Bot size={16} color="#10B981" />
                </View>
              )}
              <View
                className={`p-4 rounded-2xl max-w-[82%] ${
                  msg.sender === 'user'
                    ? 'bg-brand-primary rounded-tr-none'
                    : 'bg-surface-elevated border border-[#2A4A43] rounded-tl-none'
                }`}
              >
                <Text className={`text-sm leading-6 ${msg.sender === 'user' ? 'text-surface font-semibold' : 'text-white'}`}>
                  {msg.text}
                </Text>
                <Text
                  className={`text-[10px] mt-1.5 align-self-end ${
                    msg.sender === 'user' ? 'text-surface/80 font-medium' : 'text-ink-soft'
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
                    className="bg-[#1C3833] px-3.5 py-2 rounded-xl border border-[#2A4A43] active:bg-brand-primary/20"
                  >
                    <Text className="text-brand-primary text-xs font-semibold">✨ {chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View className="flex-row items-center ml-10 my-2">
            <ActivityIndicator size="small" color="#10B981" />
            <Text className="text-ink-soft text-xs ml-2 font-medium">ChatGPT Health is reasoning...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input Box */}
      <View className="p-4 bg-surface-elevated border-t border-[#2A4A43]">
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask ChatGPT Health Coach..."
            placeholderTextColor="#64748B"
            className="flex-1 bg-[#1C3833] text-white px-4 py-3 rounded-xl border border-[#2A4A43] mr-2 text-sm"
          />
          <TouchableOpacity
            onPress={() => handleSendPrompt(input)}
            disabled={loading || !input.trim()}
            className={`w-11 h-11 rounded-xl items-center justify-center ${
              input.trim() ? 'bg-brand-primary' : 'bg-surface-elevated border border-[#2A4A43]'
            }`}
          >
            <Send size={18} color={input.trim() ? '#0D1F1C' : '#64748B'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
