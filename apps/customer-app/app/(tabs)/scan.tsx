import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, RefreshCw } from 'lucide-react-native';

export default function ScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      router.push('/scan-report/rep_1092');
    }, 1800);
  };

  return (
    <View className="flex-1 bg-surface items-center justify-between p-6 pt-14 pb-12">
      {/* Top Header */}
      <View className="items-center">
        <Text className="text-white text-2xl font-extrabold mb-1">AI Skin Scan</Text>
        <Text className="text-ink-soft text-sm">Align face inside mask indicator</Text>
      </View>

      {/* Camera Target Oval Overlay */}
      <View className="items-center justify-center">
        <View className="w-64 h-80 border-2 border-brand-primary/60 border-dashed rounded-full items-center justify-center bg-[#162E29]/40 relative overflow-hidden">
          {isScanning ? (
            <View className="items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-brand-primary text-xs font-bold mt-3">Analyzing Biomarkers...</Text>
            </View>
          ) : (
            <View className="items-center p-4">
              <Camera size={48} color="#10B981" />
              <Text className="text-ink-soft text-xs text-center mt-3">
                Ensure clear lighting and face forward
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Scan Control Button */}
      <View className="w-full">
        <View className="flex-row items-center justify-center gap-2 mb-4">
          <Shield size={14} color="#10B981" />
          <Text className="text-ink-soft text-xs">HIPAA Encrypted • On-Device Neural Processing</Text>
        </View>

        <TouchableOpacity
          onPress={handleStartScan}
          disabled={isScanning}
          className="w-full bg-brand-primary py-4 rounded-2xl items-center justify-center shadow-lg active:opacity-90"
        >
          <View className="flex-row items-center">
            {isScanning ? (
              <RefreshCw size={20} color="#0D1F1C" className="animate-spin" />
            ) : (
              <Zap size={20} color="#0D1F1C" />
            )}
            <Text className="text-surface font-extrabold text-base ml-2">
              {isScanning ? 'Processing Scan...' : 'Capture & Analyze'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
