import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, ChevronRight, TrendingUp, Camera, Clock, AlertCircle } from 'lucide-react-native';
import { LineChart } from '../src/components/charts';
import { Badge, Button } from '../src/components/ui';
import { useScanStore } from '../src/store/useScanStore';
import { SkinScanResult } from '@medivo/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { scanHistory, isLoadingHistory, fetchScanHistory, setActiveScan } = useScanStore();

  useEffect(() => {
    fetchScanHistory();
  }, [fetchScanHistory]);

  const hasHistory = Array.isArray(scanHistory) && scanHistory.length > 0;
  
  // Sort scans: latest first for list, oldest first for chronological chart progression
  const latestScans = hasHistory ? [...scanHistory].sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()) : [];
  const chronologicalScans = hasHistory ? [...scanHistory].sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()) : [];

  const latestScore = hasHistory ? latestScans[0].overallScore : 0;
  const baselineScore = hasHistory ? chronologicalScans[0].overallScore : 0;
  const scoreDelta = latestScore - baselineScore;

  // Compute LineChart dynamic progression points from actual scan records
  const historyTrendData = chronologicalScans.map((scan, idx) => {
    const scanDate = new Date(scan.scannedAt);
    const label = scanDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      x: label || `Scan ${idx + 1}`,
      y: scan.overallScore,
    };
  });

  const handleSelectScan = (scan: SkinScanResult) => {
    setActiveScan(scan);
    router.push(`/scan-report/${scan.id}`);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#090D16]" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="p-6 max-w-7xl mx-auto w-full gap-6">
        {/* Page Title & Subtitle Banner */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 min-w-0 mr-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3.5 p-2 rounded-xl bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#374151]"
            >
              <ArrowLeft size={20} color="#1F7FC4" />
            </TouchableOpacity>
            <View className="flex-1 min-w-0">
              <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight" numberOfLines={1}>
                Scan History & Trends
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 font-medium" numberOfLines={1}>
                Longitudinal skin biomarker analysis
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            {hasHistory && (
              <Badge
                label={
                  scanHistory.length === 1
                    ? '1 Scan Baseline'
                    : scoreDelta >= 0
                    ? `+${scoreDelta} Pts Progress`
                    : `${scoreDelta} Pts Delta`
                }
                variant={scoreDelta >= 0 ? 'success' : 'warning'}
                className="hidden sm:flex"
              />
            )}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/scan')}
              className="px-3.5 py-2 rounded-xl bg-brand-primary flex-row items-center shadow-sm"
            >
              <Camera size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold ml-1.5">New Scan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoadingHistory && (
          <View className="flex-row items-center justify-center p-4 bg-slate-50 dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-[#374151]">
            <ActivityIndicator size="small" color="#1F7FC4" />
            <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold ml-2">
              Syncing longitudinal scan records from telemetry vault...
            </Text>
          </View>
        )}

        {hasHistory ? (
          /* Desktop 2-Column Split View for Active History */
          <View className="flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column (2/3 width on Desktop): Dynamic Line Chart & Trends */}
            <View className="flex-1 w-full gap-6">
              <LineChart
                data={historyTrendData}
                title="Longitudinal Skin Health Progression"
                height={280}
                color="#1F7FC4"
              />

              {/* Dynamic Trajectory Insights Card */}
              <View className="bg-sky-500/10 dark:bg-sky-500/20 p-5 rounded-3xl border border-sky-500/30 flex-row items-center shadow-sm">
                <TrendingUp size={24} color="#1F7FC4" className="mr-4 flex-shrink-0" />
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-white font-extrabold text-base">
                    {scanHistory.length === 1
                      ? 'Baseline Diagnostic Established'
                      : scoreDelta > 0
                      ? 'Consistent Positive Trajectory'
                      : scoreDelta < 0
                      ? 'Biomarker Flux Detected'
                      : 'Stable Skin Barrier Index'}
                  </Text>
                  <Text className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-5">
                    {scanHistory.length === 1
                      ? 'Your initial biometric baseline is recorded. Perform consecutive weekly scans to track dermal hydration and stratum corneum progression.'
                      : scoreDelta > 0
                      ? `Your skin health index has improved by +${scoreDelta} points across ${scanHistory.length} diagnostic scans. Stratum barrier defense is in optimal range.`
                      : scoreDelta < 0
                      ? `A minor delta of ${scoreDelta} points was observed. Consider reviewing your daily hydration and photoprotection regimen.`
                      : `Your skin metrics remain consistent across ${scanHistory.length} recorded telemetry sessions.`}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column (1/3 width on Desktop): Dynamic Past Scans List */}
            <View className="w-full lg:w-96 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-900 dark:text-white font-extrabold text-lg">Past Scan Records</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold">{latestScans.length} Recorded</Text>
              </View>

              <View className="gap-3">
                {latestScans.map((scan) => {
                  const dateObj = new Date(scan.scannedAt);
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const status =
                    scan.grade ||
                    (scan.overallScore >= 85
                      ? 'Optimal'
                      : scan.overallScore >= 70
                      ? 'Good Condition'
                      : 'Attention Advised');

                  const scoreColor =
                    scan.overallScore >= 85
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : scan.overallScore >= 70
                      ? 'text-sky-600 dark:text-sky-400'
                      : 'text-amber-600 dark:text-amber-400';

                  return (
                    <TouchableOpacity
                      key={scan.id}
                      onPress={() => handleSelectScan(scan)}
                      className="bg-slate-50 dark:bg-[#111827] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-[#374151] flex-row items-center justify-between active:border-brand-primary/40 transition-all shadow-sm"
                    >
                      <View className="flex-row items-center flex-1 min-w-0 mr-3">
                        <View className="w-12 h-12 bg-sky-500/10 dark:bg-sky-500/20 rounded-2xl items-center justify-center mr-3.5 border border-sky-500/30 flex-shrink-0">
                          <Calendar size={20} color="#1F7FC4" />
                        </View>
                        <View className="flex-1 min-w-0">
                          <Text className="text-slate-900 dark:text-white font-bold text-sm sm:text-base truncate" numberOfLines={1}>
                            {formattedDate}
                          </Text>
                          <Text className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 truncate" numberOfLines={1}>
                            {formattedTime} • ID: {scan.id.slice(0, 12)}...
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center flex-shrink-0">
                        <View className="items-end mr-3">
                          <Text className={`font-extrabold text-base ${scoreColor}`}>
                            {scan.overallScore}/100
                          </Text>
                          <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                            {status}
                          </Text>
                        </View>
                        <ChevronRight size={18} color="#64748B" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

          </View>
        ) : !isLoadingHistory ? (
          /* Empty State For New Users With 0 Scans */
          <View className="bg-slate-50 dark:bg-[#111827] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-[#374151] items-center text-center shadow-sm">
            <View className="w-16 h-16 rounded-3xl bg-sky-500/10 dark:bg-sky-500/20 items-center justify-center mb-4 border border-sky-500/30">
              <Clock size={32} color="#1F7FC4" />
            </View>
            <Text className="text-slate-900 dark:text-white font-extrabold text-xl mb-2 text-center">
              No Scan History Yet
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-sm max-w-md text-center leading-relaxed mb-6">
              Take your first 10-second facial biometric scan to compute your 15 clinical skin attributes, establish your dermal baseline, and observe telemetry evolutions over time.
            </Text>
            <Button
              title="Take First AI Scan"
              onPress={() => router.push('/(tabs)/scan')}
              icon={<Camera size={18} color="#FFFFFF" />}
              size="md"
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
