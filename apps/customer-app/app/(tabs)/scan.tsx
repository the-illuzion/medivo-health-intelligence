import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, Heart, Sparkles } from 'lucide-react-native';
import { aiServiceManager, CombinedAIReport, AIProviderType } from '../../src/services/ai';
import { Badge, Button } from '../../src/components/ui';

export default function ScanScreen() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('perfect_corp');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<CombinedAIReport | null>(null);

  const handleStartScan = async () => {
    setIsScanning(true);
    try {
      const result = await aiServiceManager.runFullScan('mock_base64_frame', selectedProvider);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40, paddingTop: 50 }}>
      {/* Top Header */}
      <View className="px-6 items-center mb-6 max-w-4xl mx-auto w-full">
        <Text className="text-slate-900 dark:text-white text-3xl font-extrabold mb-1.5 text-center">AI Health & Skin Telemetry</Text>
        <Text className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm text-center max-w-md">
          Real-time neural analysis powered by Perfect Corp & Shen AI
        </Text>
      </View>

      {/* Provider Selector Tabs */}
      <View className="px-6 mb-6 max-w-xl mx-auto w-full">
        <View className="flex-row bg-slate-100 dark:bg-[#111827] p-1.5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <TouchableOpacity
            onPress={() => setSelectedProvider('perfect_corp')}
            className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
              selectedProvider === 'perfect_corp' ? 'bg-brand-primary' : 'bg-transparent'
            }`}
          >
            <Sparkles size={16} color={selectedProvider === 'perfect_corp' ? '#FFFFFF' : '#64748B'} />
            <Text
              className={`text-xs font-bold ml-2 ${
                selectedProvider === 'perfect_corp' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Perfect Corp AI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedProvider('shen_ai')}
            className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
              selectedProvider === 'shen_ai' ? 'bg-brand-primary' : 'bg-transparent'
            }`}
          >
            <Heart size={16} color={selectedProvider === 'shen_ai' ? '#FFFFFF' : '#64748B'} />
            <Text
              className={`text-xs font-bold ml-2 ${
                selectedProvider === 'shen_ai' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Shen.ai Vitals
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Viewfinder Overlay */}
      <View className="items-center justify-center my-2 px-6">
        <View className="w-64 h-80 border-2 border-brand-primary border-dashed rounded-full items-center justify-center bg-slate-50 dark:bg-[#111827] relative overflow-hidden shadow-md border-slate-300 dark:border-[#374151]">
          {isScanning ? (
            <View className="items-center px-4">
              <ActivityIndicator size="large" color="#1F7FC4" />
              <Text className="text-brand-primary text-xs font-extrabold mt-4 text-center">
                {selectedProvider === 'perfect_corp'
                  ? 'Analyzing Skin Texture & Spots...'
                  : 'Measuring rPPG Pulse & HRV...'}
              </Text>
            </View>
          ) : (
            <View className="items-center p-4">
              <Camera size={48} color="#1F7FC4" />
              <Text className="text-slate-900 dark:text-white text-sm font-semibold text-center mt-3">
                Align Face Inside Frame
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs text-center mt-1">
                {selectedProvider === 'perfect_corp'
                  ? 'Dermatological AI Classification'
                  : 'Computer Vision Vital Telemetry'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Controls & Results */}
      <View className="px-6 mt-6 max-w-xl mx-auto w-full">
        <View className="flex-row items-center justify-center gap-2 mb-4">
          <Shield size={14} color="#1F7FC4" />
          <Text className="text-slate-600 dark:text-slate-400 text-xs">HIPAA Encrypted • On-Device & Cloud AI Pipeline</Text>
        </View>

        <Button
          title={isScanning ? 'Processing Inference...' : 'Capture & Run Inference'}
          onPress={handleStartScan}
          loading={isScanning}
          icon={<Zap size={20} color="#FFFFFF" />}
        />

        {/* Live Analysis Telemetry Results Card */}
        {report && (
          <View className="bg-slate-50 dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-[#374151] mt-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-slate-900 dark:text-white font-extrabold text-base">Analysis Telemetry</Text>
              <Badge label={report.provider === 'perfect_corp' ? 'Perfect Corp AI' : 'Shen.ai'} variant="accent" />
            </View>

            {report.skin && (
              <View className="bg-white dark:bg-[#1F2937] p-4 rounded-xl mb-3 border border-slate-200 dark:border-[#374151]">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Overall Skin Score</Text>
                  <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">{report.skin.overallScore}/100</Text>
                </View>
                <View className="flex-row justify-between text-xs mt-1">
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">Skin Age: {report.skin.skinAge} yrs</Text>
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">Hydration: {report.skin.moistureScore}%</Text>
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">Redness: {report.skin.rednessScore}%</Text>
                </View>
              </View>
            )}

            {report.vitals && (
              <View className="bg-white dark:bg-[#1F2937] p-4 rounded-xl border border-slate-200 dark:border-[#374151]">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Shen.ai Vital Telemetry</Text>
                  <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-xs">rPPG Active</Text>
                </View>
                <View className="flex-row justify-between text-xs">
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">Heart Rate: {report.vitals.heartRate} BPM</Text>
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">HRV: {report.vitals.hrv} ms</Text>
                  <Text className="text-slate-800 dark:text-slate-200 text-xs">BP: {report.vitals.bloodPressure.systolic}/{report.vitals.bloodPressure.diastolic}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
