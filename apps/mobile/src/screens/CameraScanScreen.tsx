import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface CameraScanScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function CameraScanScreen({ onNavigate }: CameraScanScreenProps) {
  const [stage, setStage] = useState<'positioning' | 'scanning' | 'complete'>('positioning');

  function handleStartScan() {
    setStage('scanning');
    setTimeout(() => {
      setStage('complete');
    }, 2500);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {stage === 'positioning' && 'Position Your Face'}
        {stage === 'scanning' && 'Analyzing Skin Telemetry...'}
        {stage === 'complete' && 'AI Scan Complete!'}
      </Text>

      {/* Simulated Native Camera Frame */}
      <View style={styles.cameraBox}>
        <View style={styles.cameraPlaceholder}>
          <Feather name="camera" size={44} color="#818CF8" />
          <Text style={styles.cameraText}>Live Mobile Camera Stream</Text>
        </View>

        {/* Bounding Oval Overlay */}
        <View style={[styles.boundingOval, stage === 'scanning' && styles.boundingOvalScanning]} />
      </View>

      {/* Controls & Actions */}
      <View style={styles.controlsCard}>
        {stage === 'positioning' && (
          <TouchableOpacity style={styles.scanBtn} onPress={handleStartScan}>
            <Feather name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Start AI Skin Scan</Text>
          </TouchableOpacity>
        )}

        {stage === 'scanning' && (
          <View style={styles.scanningBox}>
            <Text style={styles.scanningText}>Analyzing hydration & texture...</Text>
          </View>
        )}

        {stage === 'complete' && (
          <View style={styles.resultBox}>
            <Feather name="check-circle" size={32} color="#059669" />
            <Text style={styles.resultTitle}>Skin Score: 87 (+4)</Text>
            <TouchableOpacity style={styles.reportBtn} onPress={() => onNavigate('dashboard')}>
              <Text style={styles.reportBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#F8FAFC', marginVertical: 16 },
  cameraBox: { width: 300, height: 380, borderRadius: 32, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cameraPlaceholder: { alignItems: 'center' },
  cameraText: { color: '#94A3B8', fontSize: 12, marginTop: 10, fontWeight: '600' },
  boundingOval: { position: 'absolute', width: 200, height: 260, borderRadius: 130, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed' },
  boundingOvalScanning: { borderColor: '#10B981', borderStyle: 'solid' },
  controlsCard: { width: '100%', marginTop: 24 },
  scanBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  scanBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, marginLeft: 8 },
  scanningBox: { alignItems: 'center', padding: 16 },
  scanningText: { color: '#10B981', fontWeight: '700', fontSize: 14 },
  resultBox: { alignItems: 'center', backgroundColor: '#1E293B', padding: 20, borderRadius: 20 },
  resultTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginVertical: 10 },
  reportBtn: { backgroundColor: '#0EA5E9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
  reportBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
