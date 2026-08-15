import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, Camera, MessageSquare, Sparkles, Sun, ShoppingBag, User, Bell, Activity, ArrowRight } from 'lucide-react-native';

export interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  route: string;
  icon: React.ReactNode;
}

const COMMANDS: CommandItem[] = [
  {
    id: 'scan',
    title: 'Perform AI Skin Telemetry Scan',
    description: 'Capture sub-dermal optical biomarkers via AI camera',
    category: 'AI Telemetry',
    route: '/(tabs)/scan',
    icon: <Camera size={18} color="#1F7FC4" />,
  },
  {
    id: 'history',
    title: 'View Scan History & Reports',
    description: 'Track 7-day dermal progress and biomarker trends',
    category: 'AI Telemetry',
    route: '/history',
    icon: <Activity size={18} color="#1F7FC4" />,
  },
  {
    id: 'coach',
    title: 'Ask AI Health Coach',
    description: 'Get instant 24/7 personalized skincare answers',
    category: 'AI Telemedicine',
    route: '/coach',
    icon: <MessageSquare size={18} color="#1F7FC4" />,
  },
  {
    id: 'consultations',
    title: 'Book Dermatologist Consultation',
    description: 'Schedule HD video visit with board-certified doctor',
    category: 'AI Telemedicine',
    route: '/consultations',
    icon: <Sparkles size={18} color="#059669" />,
  },
  {
    id: 'routines',
    title: 'Daily Regimen Protocol',
    description: 'View customized AM & PM topical application schedule',
    category: 'Regimen Protocol',
    route: '/(tabs)/routines',
    icon: <Sun size={18} color="#D97706" />,
  },
  {
    id: 'products',
    title: 'Clinical Skincare Store',
    description: 'Browse AI-curated biocompatible formulations',
    category: 'Marketplace',
    route: '/(tabs)/products',
    icon: <ShoppingBag size={18} color="#4F46E5" />,
  },
  {
    id: 'profile',
    title: 'Patient Account & Profile',
    description: 'Manage confidential profile and skin baseline',
    category: 'Account',
    route: '/edit-profile',
    icon: <User size={18} color="#1F7FC4" />,
  },
  {
    id: 'notifications',
    title: 'Notifications & Alerts',
    description: 'View system updates and prescription refill alerts',
    category: 'Account',
    route: '/notifications',
    icon: <Bell size={18} color="#1F7FC4" />,
  },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    onClose();
    setQuery('');
    router.push(route as any);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 dark:bg-black/80 items-center justify-start pt-16 md:pt-24 px-4">
        <View className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-[#374151] shadow-2xl overflow-hidden">
          
          {/* Header Search Input */}
          <View className="p-4 border-b border-slate-200 dark:border-[#374151] flex-row items-center bg-slate-50 dark:bg-[#192231]">
            <Search size={20} color="#1F7FC4" className="mr-3" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search actions, features, telemetry, routines... (e.g. scan, doctor, cart)"
              placeholderTextColor="#94A3B8"
              autoFocus
              style={{ outlineStyle: 'none' } as any}
              className="flex-1 text-slate-900 dark:text-white text-base outline-none"
            />
            <TouchableOpacity onPress={onClose} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 ml-2">
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Quick Filtered Command List */}
          <ScrollView className="max-h-96 p-3">
            {filteredCommands.length === 0 ? (
              <View className="py-12 items-center justify-center">
                <Text className="text-slate-500 dark:text-slate-400 text-sm">No matching actions found for "{query}"</Text>
              </View>
            ) : (
              filteredCommands.map((cmd) => (
                <TouchableOpacity
                  key={cmd.id}
                  onPress={() => handleSelect(cmd.route)}
                  className="p-3.5 rounded-2xl flex-row items-center justify-between mb-1.5 active:bg-sky-500/10 dark:active:bg-sky-500/20"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl items-center justify-center mr-3 border border-slate-200 dark:border-slate-700">
                      {cmd.icon}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-slate-900 dark:text-white font-extrabold text-sm">{cmd.title}</Text>
                        <Text className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded-full">
                          {cmd.category}
                        </Text>
                      </View>
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{cmd.description}</Text>
                    </View>
                  </View>
                  <ArrowRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Modal Footer Tip */}
          <View className="px-4 py-3 bg-slate-100 dark:bg-[#161F2E] border-t border-slate-200 dark:border-[#374151] flex-row items-center justify-between">
            <Text className="text-slate-500 dark:text-slate-400 text-xs">Navigation Command Palette</Text>
            <Text className="text-slate-400 text-xs font-semibold">Press ESC or tap outside to dismiss</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
