import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WifiOff, RefreshCw, Shield, AlertTriangle } from 'lucide-react-native';
import { useBackendStatusStore } from '../store/useBackendStatusStore';
import { CompanyLogo } from '../components/ui/CompanyLogo';

export const ServerDownScreen: React.FC = () => {
  const { isBackendDown, isChecking, errorMessage, checkHealth } = useBackendStatusStore();

  if (!isBackendDown) return null;

  return (
    <View className="absolute inset-0 z-50 bg-white dark:bg-[#090D16] flex-1 items-center justify-center p-6 min-h-screen">
      <View className="max-w-md w-full items-center text-center">
        
        {/* Brand SVG Logo Badge (No Background) */}
        <View className="mb-6">
          <CompanyLogo width={48} height={48} />
        </View>

        {/* Pulsing Offline Connection Status Icon */}
        <View className="w-20 h-20 bg-amber-500/10 dark:bg-amber-500/20 rounded-full items-center justify-center mb-6 border border-amber-500/30">
          <WifiOff size={36} color="#D97706" />
        </View>

        {/* User-Friendly Main Heading */}
        <Text className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-3">
          Unable to Connect to Medivo
        </Text>

        {/* Clear, Non-Technical Explanation */}
        <Text className="text-slate-600 dark:text-slate-400 text-sm sm:text-base text-center leading-relaxed mb-6">
          We're having trouble connecting to Medivo services right now. Please check your internet connection or try again in a few moments.
        </Text>

        {/* Friendly Status Information Box */}
        <View className="w-full bg-slate-100 dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] mb-6 flex-row items-center">
          <AlertTriangle size={18} color="#D97706" className="mr-3 flex-shrink-0" />
          <Text className="text-slate-700 dark:text-slate-300 text-xs font-semibold flex-1 leading-relaxed">
            {errorMessage || 'Medivo services are temporarily unreachable. We are working to restore the connection.'}
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => checkHealth()}
          disabled={isChecking}
          activeOpacity={0.8}
          className="w-full py-3.5 px-6 bg-brand-primary rounded-2xl flex-row items-center justify-center shadow-md active:opacity-90 mb-6"
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
          ) : (
            <RefreshCw size={18} color="#FFFFFF" className="mr-2" />
          )}
          <Text className="text-white font-extrabold text-sm sm:text-base">
            {isChecking ? 'Reconnecting...' : 'Try Reconnecting ↻'}
          </Text>
        </TouchableOpacity>

        {/* HIPAA Data Security Note */}
        <View className="flex-row items-center justify-center gap-2 mb-8 bg-emerald-500/10 dark:bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
          <Shield size={14} color="#059669" />
          <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            Your health records and scan history remain safe and secure
          </Text>
        </View>

        {/* Urgent Medical Disclaimer */}
        <View className="border-t border-slate-200 dark:border-slate-800 pt-6 w-full items-center">
          <Text className="text-slate-400 text-[11px] text-center leading-normal">
            For immediate medical needs or emergencies, please contact your doctor or local emergency services directly.
          </Text>
        </View>

      </View>
    </View>
  );
};
