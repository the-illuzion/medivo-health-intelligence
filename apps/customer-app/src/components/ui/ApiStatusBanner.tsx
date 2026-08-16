import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { useBackendStatusStore } from '../../store/useBackendStatusStore';

export const ApiStatusBanner: React.FC = () => {
  const { isBackendDown, isChecking, errorMessage, checkHealth } = useBackendStatusStore();
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [wasDown, setWasDown] = useState(false);

  // Initial health check on mount & periodic polling when backend is down
  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBackendDown) {
      setWasDown(true);
      // Auto-poll every 12 seconds when offline
      interval = setInterval(() => {
        checkHealth();
      }, 12000);
    } else if (wasDown) {
      // Show brief connection restored notice
      setRestoredNotice(true);
      setWasDown(false);
      const timer = setTimeout(() => {
        setRestoredNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [isBackendDown, wasDown, checkHealth]);

  if (restoredNotice) {
    return (
      <View className="bg-emerald-600 text-white px-4 py-2.5 flex-row items-center justify-between shadow-sm z-50">
        <View className="flex-row items-center flex-1">
          <CheckCircle2 size={18} color="#FFFFFF" className="mr-2 flex-shrink-0" />
          <Text className="text-white font-extrabold text-xs">
            Backend Connection Restored — API servers are operational.
          </Text>
        </View>
      </View>
    );
  }

  if (!isBackendDown) return null;

  return (
    <View className="bg-amber-600 dark:bg-amber-700 text-white px-4 py-2.5 flex-row items-center justify-between shadow-md z-50 border-b border-amber-500/40">
      <View className="flex-row items-center flex-1 mr-3 min-w-0">
        <WifiOff size={18} color="#FFFFFF" className="mr-2.5 flex-shrink-0" />
        <View className="flex-1 min-w-0">
          <Text className="text-white font-extrabold text-xs leading-tight">
            Backend Server Not Responding
          </Text>
          <Text className="text-amber-100 text-[11px] font-medium leading-tight mt-0.5" numberOfLines={1}>
            {errorMessage || 'Unable to connect to Medivo API services. Features may be limited.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => checkHealth()}
        disabled={isChecking}
        className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl flex-row items-center flex-shrink-0 active:bg-white/40"
      >
        {isChecking ? (
          <ActivityIndicator size="small" color="#FFFFFF" className="mr-1.5" />
        ) : (
          <RefreshCw size={13} color="#FFFFFF" className="mr-1.5" />
        )}
        <Text className="text-white font-bold text-xs">
          {isChecking ? 'Checking...' : 'Retry ↻'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
