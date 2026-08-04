import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, RefreshCw, Heart, Sparkles, Activity } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40, paddingTop: 50 }}>
      {/* Top Header */}
      <View className="px-6 items-center mb-4">
        <Text className="text-white text-2xl font-extrabold mb-1">AI Health & Skin Telemetry</Text>
        <Text className="text-ink-soft text-sm text-center">
          Real-time neural analysis powered by Perfect Corp & Shen AI
        </Text>
      </View>

      {/* Provider Selector Tabs */}
      <View className="px-6 mb-6">
        <View className="flex-row bg-surface-elevated p-1 rounded-2xl border border-[#2A4A43]">
          <TouchableOpacity
            onPress={() => setSelectedProvider('perfect_corp')}
            className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
              selectedProvider === 'perfect_corp' ? 'bg-brand-primary' : 'bg-transparent'
            }`}
          >
            <Sparkles size={16} color={selectedProvider === 'perfect_corp' ? '#0D1F1C' : '#94A3B8'} />
            <Text
              className={`text-xs font-bold ml-2 ${
                selectedProvider === 'perfect_corp' ? 'text-surface' : 'text-ink-soft'
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
            <Heart size={16} color={selectedProvider === 'shen_ai' ? '#0D1F1C' : '#94A3B8'} />
            <Text
              className={`text-xs font-bold ml-2 ${
                selectedProvider === 'shen_ai' ? 'text-surface' : 'text-ink-soft'
              }`}
            >
              Shen.ai Vitals
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera Viewfinder Overlay */}
      <View className="items-center justify-center my-2 px-6">
        <View className="w-64 h-80 border-2 border-brand-primary border-dashed rounded-full items-center justify-center bg-[#162E29]/50 relative overflow-hidden shadow-2xl">
          {isScanning ? (
            <View className="items-center px-4">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-brand-primary text-xs font-extrabold mt-4 text-center">
                {selectedProvider === 'perfect_corp'
                  ? 'Analyzing Skin Texture & Spots...'
                  : 'Measuring rPPG Pulse & HRV...'}
              </Text>
            </View>
          ) : (
            <View className="items-center p-4">
              <Camera size={48} color="#10B981" />
              <Text className="text-white text-sm font-semibold text-center mt-3">
                Align Face Inside Frame
              </Text>
              <Text className="text-ink-soft text-xs text-center mt-1">
                {selectedProvider === 'perfect_corp'
                  ? 'Dermatological AI Classification'
                  : 'Computer Vision Vital Telemetry'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Controls & Results */}
      <View className="px-6 mt-6">
        <View className="flex-row items-center justify-center gap-2 mb-4">
          <Shield size={14} color="#10B981" />
          <Text className="text-ink-soft text-xs">HIPAA Encrypted • On-Device & Cloud AI Pipeline</Text>
        </View>

        <Button
          title={isScanning ? 'Processing Inference...' : 'Capture & Run Inference'}
          onPress={handleStartScan}
          loading={isScanning}
          icon={<Zap size={20} color="#0D1F1C" />}
        />

        {/* Live Analysis Telemetry Results Card */}
        {report && (
          <View className="bg-surface-elevated rounded-2xl p-5 border border-[#2A4A43] mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-extrabold text-base">Analysis Telemetry</Text>
              <Badge label={report.provider === 'perfect_corp' ? 'Perfect Corp AI' : 'Shen.ai'} variant="accent" />
            </View>

            {report.skin && (
              <View className="bg-[#1C3833] p-4 rounded-xl mb-3 border border-[#2A4A43]">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-ink-soft text-xs">Overall Skin Score</Text>
                  <Text className="text-success-light font-extrabold text-base">{report.skin.overallScore}/100</Text>
                </View>
                <View className="flex-row justify-between text-xs mt-1">
                  <Text className="text-white text-xs">Skin Age: {report.skin.skinAge} yrs</Text>
                  <Text className="text-white text-xs">Hydration: {report.skin.moistureScore}%</Text>
                  <Text className="text-white text-xs">Redness: {report.skin.rednessScore}%</Text>
                </View>
              </View>
            )}

            {report.vitals && (
              <View className="bg-[#1C3833] p-4 rounded-xl border border-[#2A4A43]">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-ink-soft text-xs">Shen.ai Vital Telemetry</Text>
                  <Text className="text-accent-light font-extrabold text-xs">rPPG Active</Text>
                </View>
                <View className="flex-row justify-between text-xs">
                  <Text className="text-white text-xs">Heart Rate: {report.vitals.heartRate} BPM</Text>
                  <Text className="text-white text-xs">HRV: {report.vitals.hrv} ms</Text>
                  <Text className="text-white text-xs">BP: {report.vitals.bloodPressure.systolic}/{report.vitals.bloodPressure.diastolic}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
