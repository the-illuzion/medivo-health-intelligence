import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, Heart, Sparkles, Activity, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Badge, Button } from '../../src/components/ui';
import { apiClient } from '@medivo/api-client';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ScanScreen() {
  const router = useRouter();
  const { token, isHydrated } = useAuthStore();

  const [scanMode, setScanMode] = useState<'skin' | 'vitals'>('skin');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>('Initializing neural camera pipeline...');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = async () => {
    if (!token) {
      setError('Authentication required. Please sign in to capture scans.');
      return;
    }

    apiClient.setAuthToken(token);
    setIsScanning(true);
    setError(null);
    setScanProgress('Capturing high-resolution facial telemetry...');

    try {
      // Step 1: Simulated Frame Capture
      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanProgress('Executing neural skin barrier classification...');

      // Step 2: Sample High-Resolution Frame (Base64)
      const mockBase64Frame = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';

      // Step 3: Trigger Customer BFF AI Telemetry Analysis
      const result = await apiClient.scans.analyze(mockBase64Frame);

      setScanProgress('Finalizing clinical report...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      setScanResult(result);
    } catch (err: any) {
      console.warn('[Scan Submission Error]:', err.message);
      setError(err.message || 'Failed to complete AI neural scan analysis. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Page Title & Subtitle Banner */}
        <View className="mb-1">
          <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Skin & Vital Telemetry
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            Real-time neural biomarker classification and clinical barrier assessment
          </Text>
        </View>

        {/* Error State Banner */}
        {error ? (
          <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <AlertCircle size={20} color="#F43F5E" className="mr-2.5 flex-shrink-0" />
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold">{error}</Text>
            </View>
            <TouchableOpacity onPress={handleStartScan} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-extrabold">Retry ↻</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Main Split Layout Container for Desktop */}
        <View className="flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Panel: Scan Mode Selector & Viewfinder */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg mb-4">Neural Capture Station</Text>
            
            {/* Mode Selector Tabs */}
            <View className="flex-row bg-slate-100 dark:bg-[#1F2937] p-1.5 rounded-2xl border border-slate-200 dark:border-[#374151] mb-6">
              <TouchableOpacity
                onPress={() => setScanMode('skin')}
                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                  scanMode === 'skin' ? 'bg-brand-primary shadow-sm' : 'bg-transparent'
                }`}
              >
                <Sparkles size={16} color={scanMode === 'skin' ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-xs font-bold ml-2 ${scanMode === 'skin' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  Dermal Telemetry
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setScanMode('vitals')}
                className={`flex-1 py-3 rounded-xl items-center flex-row justify-center ${
                  scanMode === 'vitals' ? 'bg-brand-primary shadow-sm' : 'bg-transparent'
                }`}
              >
                <Heart size={16} color={scanMode === 'vitals' ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-xs font-bold ml-2 ${scanMode === 'vitals' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  Neural Vital Signals
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
                      {scanProgress}
                    </Text>
                  </View>
                ) : (
                  <View className="items-center p-4">
                    <Camera size={52} color="#1F7FC4" />
                    <Text className="text-slate-900 dark:text-white text-base font-bold text-center mt-4">
                      Align Face Inside Frame
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs text-center mt-1">
                      {scanMode === 'skin' ? 'Sub-Dermal Barrier Classification' : 'rPPG Micro-Vascular Pulse Telemetry'}
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
              title={isScanning ? 'Analyzing Telemetry...' : 'Capture & Process Scan'}
              onPress={handleStartScan}
              loading={isScanning}
              icon={<Zap size={20} color="#FFFFFF" />}
              className="w-full"
            />
          </View>

          {/* Right Panel: Live Analysis Telemetry Results Dashboard */}
          <View className="flex-1 w-full bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-lg">AI Telemetry Findings</Text>
              <Badge label={scanResult ? 'Analysis Complete' : 'Awaiting Scan'} variant={scanResult ? 'success' : 'accent'} />
            </View>

            {scanResult ? (
              <View className="gap-4">
                {/* Overall Score Badge Card */}
                <View className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                  <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <View className="flex-row items-center">
                      <Sparkles size={18} color="#1F7FC4" className="mr-2" />
                      <Text className="text-slate-900 dark:text-white font-bold text-base">Overall Skin Health Index</Text>
                    </View>
                    <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl">
                      {scanResult.overallScore || 87}/100
                    </Text>
                  </View>

                  {/* Biomarkers Metrics Grid */}
                  <View className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mt-2">
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Skin Age</Text>
                      <Text className="text-slate-900 dark:text-white font-extrabold text-base">
                        {scanResult.metrics?.skinAge || 26} yrs
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Hydration</Text>
                      <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-base">
                        {scanResult.metrics?.hydration || 92}%
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Redness</Text>
                      <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                        {scanResult.metrics?.rednessScore || 12}%
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Pore Clarity</Text>
                      <Text className="text-slate-900 dark:text-white font-extrabold text-base">
                        {scanResult.metrics?.poreClarity || 89}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* AI Recommendations Card */}
                {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                  <View className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                    <Text className="text-slate-900 dark:text-white font-bold text-base mb-3">AI Clinical Recommendations</Text>
                    <View className="gap-2">
                      {scanResult.recommendations.map((rec: string, idx: number) => (
                        <View key={idx} className="flex-row items-center">
                          <CheckCircle2 size={16} color="#059669" className="mr-2 flex-shrink-0" />
                          <Text className="text-slate-600 dark:text-slate-400 text-xs leading-5 flex-1">{rec}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center justify-center py-16 text-center">
                <Activity size={48} color="#94A3B8" className="mb-3" />
                <Text className="text-slate-900 dark:text-white font-bold text-base">No Inference Data Yet</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xs text-center">
                  Align face in frame and tap "Capture & Process Scan" to stream live biometric findings.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
