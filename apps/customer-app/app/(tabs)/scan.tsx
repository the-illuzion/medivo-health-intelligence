import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, Heart, Sparkles, Activity } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="mb-1">
          <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">AI Health & Skin Telemetry</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">Real-time neural biomarker analysis powered by Perfect Corp & Shen AI</Text>
        </View>

        {/* Main Split Layout Container for Desktop */}
        <View className="flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Panel: Provider Tabs & Camera Viewfinder */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg mb-4">Neural Capture Station</Text>
            
            {/* Provider Selector Tabs */}
            <View className="flex-row bg-slate-100 dark:bg-[#1F2937] p-1.5 rounded-2xl border border-slate-200 dark:border-[#374151] mb-6">
              <TouchableOpacity
                onPress={() => setSelectedProvider('perfect_corp')}
                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                  selectedProvider === 'perfect_corp' ? 'bg-brand-primary shadow-sm' : 'bg-transparent'
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
                  selectedProvider === 'shen_ai' ? 'bg-brand-primary shadow-sm' : 'bg-transparent'
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

            {/* Viewfinder Circle Container */}
            <View className="items-center justify-center my-4">
              <View className="w-72 h-80 border-2 border-brand-primary border-dashed rounded-full items-center justify-center bg-white dark:bg-[#090D16] relative overflow-hidden shadow-md border-slate-300 dark:border-[#374151]">
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
                    <Camera size={52} color="#1F7FC4" />
                    <Text className="text-slate-900 dark:text-white text-base font-bold text-center mt-4">
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

            <View className="flex-row items-center justify-center gap-2 my-4">
              <Shield size={14} color="#1F7FC4" />
              <Text className="text-slate-600 dark:text-slate-400 text-xs">HIPAA Encrypted • On-Device Neural Pipeline</Text>
            </View>

            <Button
              title={isScanning ? 'Processing Inference...' : 'Capture & Run Inference'}
              onPress={handleStartScan}
              loading={isScanning}
              icon={<Zap size={20} color="#FFFFFF" />}
              className="w-full"
            />
          </View>

          {/* Right Panel: Live Analysis Telemetry Results Dashboard */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-lg">Real-Time Telemetry</Text>
              <Badge label={report ? (report.provider === 'perfect_corp' ? 'Perfect Corp AI' : 'Shen.ai Vitals') : 'Awaiting Scan'} variant="accent" />
            </View>

            {report ? (
              <View className="gap-4">
                {report.skin && (
                  <View className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                    <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <View className="flex-row items-center">
                        <Sparkles size={18} color="#1F7FC4" className="mr-2" />
                        <Text className="text-slate-900 dark:text-white font-bold text-base">Perfect Corp Classification</Text>
                      </View>
                      <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">{report.skin.overallScore}/100</Text>
                    </View>

                    <View className="grid grid-cols-3 gap-4 text-center mt-2">
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Skin Age</Text>
                        <Text className="text-slate-900 dark:text-white font-extrabold text-base">{report.skin.skinAge} yrs</Text>
                      </View>
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Hydration</Text>
                        <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-base">{report.skin.moistureScore}%</Text>
                      </View>
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Redness</Text>
                        <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">{report.skin.rednessScore}%</Text>
                      </View>
                    </View>
                  </View>
                )}

                {report.vitals && (
                  <View className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                    <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <View className="flex-row items-center">
                        <Heart size={18} color="#EF4444" className="mr-2" />
                        <Text className="text-slate-900 dark:text-white font-bold text-base">Shen.ai Computer Vision Vitals</Text>
                      </View>
                      <Badge label="rPPG Active" variant="success" />
                    </View>

                    <View className="grid grid-cols-3 gap-4 text-center mt-2">
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Heart Rate</Text>
                        <Text className="text-slate-900 dark:text-white font-extrabold text-base">{report.vitals.heartRate} BPM</Text>
                      </View>
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">HRV Index</Text>
                        <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-base">{report.vitals.hrv} ms</Text>
                      </View>
                      <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Blood Pressure</Text>
                        <Text className="text-slate-900 dark:text-white font-extrabold text-xs mt-1">{report.vitals.bloodPressure.systolic}/{report.vitals.bloodPressure.diastolic}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center justify-center py-16 text-center">
                <Activity size={48} color="#94A3B8" className="mb-3" />
                <Text className="text-slate-900 dark:text-white font-bold text-base">No Inference Data Yet</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xs text-center">
                  Align face in frame and tap "Capture & Run Inference" to stream live biometric findings.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
