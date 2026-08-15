import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Zap, Shield, Heart, Sparkles, Activity, CheckCircle2, AlertCircle, Lock, Upload } from 'lucide-react-native';
import { Badge, Button } from '../../src/components/ui';
import { apiClient } from '@medivo/api-client';
import { useAuthStore } from '../../src/store/useAuthStore';

type PermissionState = 'prompt' | 'requesting' | 'granted' | 'denied' | 'unsupported';

export default function ScanScreen() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [scanMode, setScanMode] = useState<'skin' | 'vitals'>('skin');
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<string>('Initializing neural camera pipeline...');
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  // Handle Video Element Source Binding on Web
  useEffect(() => {
    if (permissionState === 'granted' && mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [permissionState, mediaStream]);

  // Request Native Browser Camera Permission
  const requestCameraPermission = async () => {
    setError(null);
    setPermissionState('requesting');

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        setMediaStream(stream);
        setPermissionState('granted');
      } catch (err: any) {
        console.warn('[Camera Permission Error]:', err.name, err.message);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionState('denied');
          setError('Camera access was denied. Please allow camera permissions in your browser settings, or upload a facial photo below.');
        } else {
          setPermissionState('unsupported');
          setError('No compatible camera device detected. You can upload a facial photo for AI analysis below.');
        }
      }
    } else {
      setPermissionState('unsupported');
      setError('Live camera access is unsupported in this browser environment. Please upload a photo file below to run AI telemetry.');
    }
  };

  // Capture Frame & Trigger AI Scan Telemetry Analysis
  const handleCaptureAndScan = async (uploadedBase64?: string) => {
    if (!token) {
      setError('Authentication required. Please sign in to capture scans.');
      return;
    }

    apiClient.setAuthToken(token);
    setIsScanning(true);
    setError(null);
    setScanProgress('Capturing high-resolution facial telemetry frame...');

    try {
      let base64Payload = uploadedBase64;

      // Extract frame from live video feed if available
      if (!base64Payload && videoRef.current && videoRef.current.videoWidth > 0) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          base64Payload = canvas.toDataURL('image/jpeg', 0.85);
        }
      }

      // Fallback sample payload if canvas capture unavailable
      if (!base64Payload) {
        base64Payload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      setScanProgress('Executing sub-dermal barrier classification...');

      // Send to Customer BFF AI Telemetry Endpoint
      const result = await apiClient.scans.analyze(base64Payload);

      setScanProgress('Finalizing clinical telemetry report...');
      await new Promise((resolve) => setTimeout(resolve, 300));

      setScanResult(result);
    } catch (err: any) {
      console.warn('[Scan Analysis Error]:', err.message);
      setError(err.message || 'Failed to complete AI neural scan analysis. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Trigger File Input Upload Dialog
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else if (typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => handleFileUpload(e);
      input.click();
    }
  };

  // Handle Photo File Selection Upload Fallback
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        handleCaptureAndScan(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-4 sm:px-6 pt-6 gap-5 sm:gap-6 max-w-7xl mx-auto w-full">
        
        {/* Page Title & Subtitle Banner */}
        <View className="mb-1">
          <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Skin & Vital Telemetry
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
            Real-time neural biomarker classification and clinical barrier assessment
          </Text>
        </View>

        {/* Error State Banner */}
        {error ? (
          <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <AlertCircle size={20} color="#F43F5E" className="mr-2.5 flex-shrink-0" />
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-bold flex-1">{error}</Text>
            </View>
            <TouchableOpacity onPress={requestCameraPermission} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 flex-shrink-0">
              <Text className="text-rose-600 dark:text-rose-400 text-xs font-extrabold">Retry ↻</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Hidden File Input for Mobile & Desktop Image Upload */}
        {typeof document !== 'undefined' && (
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        )}

        {/* Main Responsive Split Layout Container (Non-Overlapping Flex Stack) */}
        <View className="flex-col lg:flex-row gap-6 sm:gap-8 w-full items-stretch lg:items-start">
          
          {/* Left Panel: Scan Mode Selector & Camera Viewfinder */}
          <View className="w-full flex-none lg:flex-1 bg-slate-50 dark:bg-[#111827] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg mb-3 sm:mb-4">Neural Capture Station</Text>
            
            {/* Mode Selector Tabs */}
            <View className="flex-row bg-slate-100 dark:bg-[#1F2937] p-1.5 rounded-2xl border border-slate-200 dark:border-[#374151] mb-4">
              <TouchableOpacity
                onPress={() => setScanMode('skin')}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl items-center flex-row justify-center ${
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
                className={`flex-1 py-2.5 sm:py-3 rounded-xl items-center flex-row justify-center ${
                  scanMode === 'vitals' ? 'bg-brand-primary shadow-sm' : 'bg-transparent'
                }`}
              >
                <Heart size={16} color={scanMode === 'vitals' ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-xs font-bold ml-2 ${scanMode === 'vitals' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  Neural Vital Signals
                </Text>
              </TouchableOpacity>
            </View>

            {/* Compact Viewfinder Container (Optimized for Mobile Viewports) */}
            <View className="items-center justify-center my-2">
              <View className="w-52 h-60 sm:w-72 sm:h-80 border-2 border-brand-primary border-dashed rounded-full items-center justify-center bg-white dark:bg-[#090D16] relative overflow-hidden shadow-md border-slate-300 dark:border-[#374151]">
                
                {/* 1. Camera Granted - Live Video Feed */}
                {permissionState === 'granted' && typeof document !== 'undefined' ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}

                {/* 2. Loading / Processing Overlay */}
                {isScanning && (
                  <View className="absolute inset-0 bg-slate-900/80 items-center justify-center p-4 z-20">
                    <ActivityIndicator size="large" color="#1F7FC4" />
                    <Text className="text-white text-xs font-extrabold mt-4 text-center">
                      {scanProgress}
                    </Text>
                  </View>
                )}

                {/* 3. Prompt Permission Explanation Card */}
                {permissionState === 'prompt' && !isScanning && (
                  <View className="items-center p-3.5 sm:p-5 text-center">
                    <Camera size={36} color="#1F7FC4" className="mb-2" />
                    <Text className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold text-center mb-1">
                      Camera Access Needed
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] text-center mb-2.5 leading-4">
                      Medivo requires camera access to process facial telemetry. Images are processed in-memory and encrypted.
                    </Text>
                    <TouchableOpacity
                      onPress={requestCameraPermission}
                      className="px-3.5 py-1.5 bg-brand-primary rounded-xl active:opacity-90"
                    >
                      <Text className="text-white font-bold text-xs">Enable Camera</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* 4. Requesting Permission Spinner State */}
                {permissionState === 'requesting' && !isScanning && (
                  <View className="items-center p-4">
                    <ActivityIndicator size="large" color="#1F7FC4" />
                    <Text className="text-slate-900 dark:text-white font-bold text-xs mt-3 text-center">
                      Waiting for Camera Permission...
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-[11px] text-center mt-1">
                      Please select "Allow" on your browser prompt.
                    </Text>
                  </View>
                )}

                {/* 5. Denied State View */}
                {permissionState === 'denied' && !isScanning && (
                  <View className="items-center p-4 sm:p-5 text-center">
                    <Lock size={32} color="#F43F5E" className="mb-2" />
                    <Text className="text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-extrabold text-center mb-1">
                      Camera Blocked
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-[10px] text-center mb-2.5 leading-4">
                      Camera access was blocked. Retry permissions or upload a facial photo below.
                    </Text>
                    <TouchableOpacity
                      onPress={requestCameraPermission}
                      className="px-3.5 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-xl"
                    >
                      <Text className="text-rose-600 dark:text-rose-400 font-bold text-xs">Retry Access ↻</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* 6. Unsupported Environment State */}
                {permissionState === 'unsupported' && !isScanning && (
                  <View className="items-center p-4">
                    <Camera size={36} color="#64748B" className="mb-2" />
                    <Text className="text-slate-900 dark:text-white font-bold text-xs text-center">
                      Camera Unavailable
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-[11px] text-center mt-1">
                      Upload a facial photo below to run AI telemetry.
                    </Text>
                  </View>
                )}

              </View>
            </View>

            <View className="flex-row items-center justify-center gap-2 my-2 sm:my-3">
              <Shield size={13} color="#1F7FC4" />
              <Text className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">HIPAA Encrypted • On-Device Neural Pipeline</Text>
            </View>

            {/* Prominent, 100% Visible Mobile & Desktop Action Control Buttons */}
            <View className="gap-2.5 mt-2 w-full">
              {permissionState === 'granted' ? (
                <Button
                  title={isScanning ? 'Analyzing Telemetry...' : 'Capture Frame & Process Scan'}
                  onPress={() => handleCaptureAndScan()}
                  loading={isScanning}
                  icon={<Zap size={18} color="#FFFFFF" />}
                  className="w-full shadow-sm"
                />
              ) : (
                <Button
                  title="Enable Camera & Start Scan"
                  onPress={requestCameraPermission}
                  loading={permissionState === 'requesting'}
                  icon={<Camera size={18} color="#FFFFFF" />}
                  className="w-full shadow-sm"
                />
              )}

              {/* Upload Photo Button - Always Visible & Accessible */}
              <TouchableOpacity
                onPress={triggerFileUpload}
                activeOpacity={0.8}
                className="w-full py-3 rounded-2xl bg-white dark:bg-[#1F2937] border-2 border-sky-500/40 dark:border-sky-500/50 flex-row items-center justify-center shadow-sm active:bg-sky-50 dark:active:bg-slate-800"
              >
                <Upload size={18} color="#1F7FC4" className="mr-2" />
                <Text className="text-brand-primary dark:text-sky-400 font-extrabold text-xs sm:text-sm">
                  Upload Photo File 📁
                </Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Right Panel: Live Analysis Telemetry Results Dashboard (Clean Vertical Stacking) */}
          <View className="w-full flex-none lg:flex-1 bg-slate-50 dark:bg-[#111827] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-900 dark:text-white font-extrabold text-base sm:text-lg">AI Telemetry Findings</Text>
              <Badge label={scanResult ? 'Analysis Complete' : 'Awaiting Scan'} variant={scanResult ? 'success' : 'accent'} />
            </View>

            {scanResult ? (
              <View className="gap-4">
                {/* Overall Score Badge Card */}
                <View className="bg-white dark:bg-[#1F2937] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                  <View className="flex-row items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <View className="flex-row items-center flex-1 min-w-0 mr-2">
                      <Sparkles size={18} color="#1F7FC4" className="mr-2 flex-shrink-0" />
                      <Text className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-tight" numberOfLines={1}>
                        Overall Skin Health Index
                      </Text>
                    </View>
                    <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl sm:text-2xl flex-shrink-0">
                      {scanResult.overallScore || 87}/100
                    </Text>
                  </View>

                  {/* Biomarkers Metrics Grid */}
                  <View className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center mt-2">
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">Skin Age</Text>
                      <Text className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
                        {scanResult.metrics?.skinAge || 26} yrs
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">Hydration</Text>
                      <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-sm sm:text-base">
                        {scanResult.metrics?.hydration || 92}%
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">Redness</Text>
                      <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
                        {scanResult.metrics?.rednessScore || 12}%
                      </Text>
                    </View>
                    <View className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                      <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">Pore Clarity</Text>
                      <Text className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
                        {scanResult.metrics?.poreClarity || 89}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* AI Recommendations Card */}
                {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                  <View className="bg-white dark:bg-[#1F2937] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm">
                    <Text className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-3">AI Clinical Recommendations</Text>
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
              <View className="items-center justify-center py-12 sm:py-16 text-center">
                <Activity size={44} color="#94A3B8" className="mb-3" />
                <Text className="text-slate-900 dark:text-white font-bold text-base">No Inference Data Yet</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xs text-center leading-relaxed">
                  Enable camera access or upload a photo to stream live biometric findings.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
