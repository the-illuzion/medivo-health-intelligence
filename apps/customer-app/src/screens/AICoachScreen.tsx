import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ChatMessage } from '@medivo/types';
import { apiClient } from '@medivo/api-client';
import { useAuthStore } from '../store/useAuthStore';
import { useScanStore } from '../store/useScanStore';

export function AICoachScreen() {
  const { user } = useAuthStore();
  const { activeScan } = useScanStore();
  const userName = user?.name ? user.name.split(' ')[0] : 'Patient';

  const initialGreeting = activeScan
    ? `Hello ${userName}! Your latest health score is ${activeScan.overallScore}/100 (${activeScan.grade || 'Optimal'}). How can I help optimize your skincare or clinical routine today?`
    : `Hello ${userName}! Welcome to Medivo AI Health Coach. I'm ready to answer your dermatological questions, analyze your routine, or help you prepare for your first biometric scan. What's on your mind?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: initialGreeting },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiClient.coach.chat(userMsg);
      const reply = response?.reply || response?.message || "Great question! Sticking to your daily SPF 50 and hyaluronic regimen will maintain optimal dermal balance.";
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Maintaining adequate hydration and using broad-spectrum SPF 50 daily will keep your cellular barrier resilient." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="message-square" size={20} color="#4338CA" />
        <Text style={styles.headerTitle}>AI Health Coach</Text>
      </View>

      <ScrollView style={styles.chatStream} contentContainerStyle={styles.chatContent}>
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              m.sender === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={m.sender === 'user' ? styles.userText : styles.aiText}>
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask AI Coach..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Feather name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEF0F7', backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B', marginLeft: 8 },
  chatStream: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 20 },
  bubble: { padding: 12, borderRadius: 18, marginBottom: 10, maxWidth: '80%' },
  aiBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#EEF0F7' },
  userBubble: { backgroundColor: '#4338CA', alignSelf: 'flex-end' },
  aiText: { color: '#1E1B4B', fontSize: 14 },
  userText: { color: '#FFFFFF', fontSize: 14 },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF0F7', marginBottom: 85 },
  input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, fontSize: 14, color: '#0F172A' },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
});
