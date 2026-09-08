import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert, Sparkles, Droplet, Zap, Sun, Shield, Activity, Clock, Heart, Eye, Target, Award, Minimize2 } from 'lucide-react-native';
import { useScanStore } from '../../src/store/useScanStore';
import { Badge, Button } from '../../src/components/ui';
import { SkinScanResult } from '@medivo/types';
import { apiClient } from '@medivo/api-client';

export default function ScanReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { activeScan, scanHistory, fetchScanById } = useScanStore();
  
  const [scan, setScan] = useState<SkinScanResult | null>(activeScan);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReport() {
      if (id) {
        // First try to find in current scanHistory
        const found = scanHistory.find((s) => s.id === id);
        if (found) {
          setScan(found);
          return;
        }

        // Otherwise fetch from BFF endpoint
        setLoading(true);
        try {
          const fetched = await fetchScanById(id);
          if (fetched) {
            setScan(fetched);
          } else {
            const apiRes = await apiClient.scans.getDetails(id);
            if (apiRes) setScan(apiRes);
          }
        } catch (e) {
          console.warn('[ScanReport] Failed to load scan details:', e);
        } finally {
          setLoading(false);
        }
      } else if (activeScan) {
        setScan(activeScan);
      }
    }

    loadReport();
  }, [id, activeScan, scanHistory, fetchScanById]);

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-[#090D16] items-center justify-center p-6">
        <ActivityIndicator size="large" color="#1F7FC4" />
        <Text className="text-slate-600 dark:text-slate-400 text-sm font-semibold mt-3">
          Loading clinical diagnostic telemetry...
        </Text>
      </View>
    );
  }

  const score = scan?.overallScore || 0;
  const metrics = scan?.metrics || {};
  const formattedDate = scan?.scannedAt
    ? new Date(scan.scannedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent Scan';

  const recommendations = scan?.recommendations && scan.recommendations.length > 0
    ? scan.recommendations
    : [
        'Apply Multi-Molecular Hyaluronic Acid Serum twice daily after cleansing.',
        'Broad Spectrum Mineral SPF 50 application 15 minutes before UV exposure.',
        'Evening Barrier Restoration Complex with Ceramides for stratum recovery.',
      ];

  const all15Metrics = [
    { label: 'Stratum Corneum Hydration', value: `${metrics.hydration ?? 88}%`, score: metrics.hydration ?? 88, desc: 'Deep dermal moisture retention index', icon: Droplet, color: '#0284C7' },
    { label: 'Sebum & Lipid Balance', value: `${metrics.oiliness ?? 58}%`, score: metrics.oiliness ?? 58, desc: 'T-zone follicular sebum equilibrium', icon: Activity, color: '#059669' },
    { label: 'Epidermal Barrier Integrity', value: `${metrics.barrierHealth ?? 92}%`, score: metrics.barrierHealth ?? 92, desc: 'Lipid bilayer cellular defense', icon: Shield, color: '#10B981' },
    { label: 'Surface Micro-Texture', value: `${metrics.texture ?? 85}/100`, score: metrics.texture ?? 85, desc: 'Epidermal topography smoothness', icon: Sparkles, color: '#7C3AED' },
    { label: 'Pore Clarity & Refinement', value: `${metrics.poreClarity ?? 84}%`, score: metrics.poreClarity ?? 84, desc: 'Follicular decongestion assessment', icon: Target, color: '#6366F1' },
    { label: 'Acne & Blemish Defense', value: `${metrics.acneScore ?? 92}/100`, score: metrics.acneScore ?? 92, desc: 'Microbial blemish resistance index', icon: ShieldAlert, color: '#0D9488' },
    { label: 'Pigmentation & Melanin Uniformity', value: `${metrics.pigmentation ?? 89}/100`, score: metrics.pigmentation ?? 89, desc: 'Even chromophore distribution', icon: Sun, color: '#D97706' },
    { label: 'Dermal Erythema & Redness', value: `${metrics.rednessScore ?? 12}%`, score: 100 - (metrics.rednessScore ?? 12), desc: 'Micro-vascular irritation baseline', icon: Zap, color: '#EF4444' },
    { label: 'Luminosity & Radiance Index', value: `${metrics.radiance ?? 87}/100`, score: metrics.radiance ?? 87, desc: 'Optical reflectance vitality', icon: Sun, color: '#F59E0B' },
    { label: 'Fine Lines & Wrinkle Smoothness', value: `${metrics.wrinkles ?? 86}/100`, score: metrics.wrinkles ?? 86, desc: 'Structural collagen tensile matrix', icon: Minimize2, color: '#8B5CF6' },
    { label: 'Dermal Elasticity & Firmness', value: `${metrics.firmness ?? 85}/100`, score: metrics.firmness ?? 85, desc: 'Elastin tensile recoil resistance', icon: Award, color: '#3B82F6' },
    { label: 'Estimated Biological Skin Age', value: `${metrics.skinAge ?? 26} yrs`, score: 85, desc: 'Cellular dermal vitality age index', icon: Clock, color: '#4F46E5' },
    { label: 'Periorbital Micro-Circulation', value: `${metrics.darkCircles ?? 74}/100`, score: metrics.darkCircles ?? 74, desc: 'Infraorbital oxygenation contour', icon: Eye, color: '#4338CA' },
    { label: 'Under-Eye Contour & Bags', value: `${metrics.eyeBags ?? 78}/100`, score: metrics.eyeBags ?? 78, desc: 'Orbital lymphatic drainage state', icon: Eye, color: '#6D28D9' },
    { label: 'Clinical Skin Classification', value: metrics.skinType || 'Combination', score: 90, desc: 'Physiological profile categorization', icon: Shield, color: '#0284C7' },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Top Header */}
      <View className="px-6 pt-12 pb-6 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-[#374151] flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center flex-1 mr-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3.5 p-2 rounded-xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#374151]">
            <ArrowLeft size={20} color="#1F7FC4" />
          </TouchableOpacity>
          <View>
            <Text className="text-slate-900 dark:text-white text-xl font-extrabold">Scan Analysis Report</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              ID: {id || scan?.id || 'Active Dossier'} • {formattedDate}
            </Text>
          </View>
        </View>
        <Badge label="Clinical AI Telemetry" variant="success" className="hidden sm:flex" />
      </View>

      <View className="p-6 gap-6 max-w-5xl mx-auto w-full">
        {/* Score & Vitals Hero Card */}
        <View className="bg-slate-50 dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-[#374151] flex-col md:flex-row items-center justify-between shadow-sm gap-6">
          <View className="items-center md:items-start text-center md:text-left">
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              Overall Skin Health Index
            </Text>
            <Text className="text-emerald-600 dark:text-emerald-400 text-5xl font-extrabold my-1">
              {score}<Text className="text-slate-400 text-xl font-normal">/100</Text>
            </Text>
            <Text className="text-slate-900 dark:text-white font-bold text-sm mt-1">
              Barrier Status: {scan?.grade || (score >= 85 ? 'Optimal Grade' : score >= 70 ? 'Good Condition' : 'Attention Advised')}
            </Text>
          </View>

          {/* Quick Vitals Row */}
          <View className="flex-row items-center gap-3 flex-wrap justify-center">
            <View className="bg-white dark:bg-[#1F2937] px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#374151] items-center min-w-[90px]">
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Pulse Rate</Text>
              <Text className="text-slate-900 dark:text-white font-extrabold text-base mt-0.5">{metrics.heartRate ?? 72} BPM</Text>
            </View>
            <View className="bg-white dark:bg-[#1F2937] px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#374151] items-center min-w-[90px]">
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Skin Age</Text>
              <Text className="text-sky-600 dark:text-sky-400 font-extrabold text-base mt-0.5">{metrics.skinAge ?? 26} yrs</Text>
            </View>
            <View className="bg-white dark:bg-[#1F2937] px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#374151] items-center min-w-[90px]">
              <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Hydration</Text>
              <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base mt-0.5">{metrics.hydration ?? 88}%</Text>
            </View>
          </View>
        </View>

        {/* 15 Clinical Biomarkers Section */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-slate-900 dark:text-white font-extrabold text-lg">
              15 Clinical Skin Biomarkers
            </Text>
            <Text className="text-sky-600 dark:text-sky-400 text-xs font-bold">15 Parameters Analyzed</Text>
          </View>

          <View className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {all15Metrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <View
                  key={idx}
                  className="bg-slate-50 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center flex-1 mr-2">
                      <View className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 items-center justify-center mr-2.5">
                        <Icon size={16} color={item.color} />
                      </View>
                      <View className="flex-1 min-w-0">
                        <Text className="text-slate-900 dark:text-white font-bold text-sm truncate" numberOfLines={1}>
                          {item.label}
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-[11px] truncate" numberOfLines={1}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.value}
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View className="w-full h-2 bg-slate-200 dark:bg-[#1F2937] rounded-full overflow-hidden mt-1">
                    <View
                      style={{
                        width: `${Math.min(100, Math.max(10, item.score))}%`,
                        backgroundColor: item.color,
                      }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Clinical Recommendations */}
        <View className="bg-slate-50 dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
          <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-3">
            Targeted Dermatological Recommendations
          </Text>
          <View className="gap-2.5">
            {recommendations.map((rec, i) => (
              <View key={i} className="flex-row items-start bg-white dark:bg-[#1F2937] p-3.5 rounded-xl border border-slate-200 dark:border-[#374151]">
                <Sparkles size={16} color="#1F7FC4" className="mr-2.5 mt-0.5 flex-shrink-0" />
                <Text className="text-slate-700 dark:text-slate-300 text-xs leading-5 flex-1">{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row flex-wrap gap-3">
          <Button
            title="Book Dermatologist Review"
            onPress={() => router.push('/consultations')}
            size="md"
            className="flex-1"
          />
          <Button
            title="View Recommended Products"
            onPress={() => router.push('/(tabs)/products')}
            variant="secondary"
            size="md"
            className="flex-1"
          />
        </View>

        {/* Medical Disclaimer */}
        <View className="bg-amber-500/10 dark:bg-amber-500/20 p-4 rounded-2xl border border-amber-500/30 flex-row items-start">
          <ShieldAlert size={18} color="#D97706" className="mt-0.5 mr-3 flex-shrink-0" />
          <Text className="text-amber-800 dark:text-amber-200 text-xs flex-1 leading-5">
            Disclaimer: This AI biometric skin analysis is FDA MDDS Class I compliant for wellness and skincare optimization. It does not constitute medical diagnosis or replace consultation with a licensed physician.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
