import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface VideoCallScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function VideoCallScreen({ onNavigate }: VideoCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);

  return (
    <View style={styles.container}>
      {/* Clinician Video Feed */}
      <View style={styles.doctorVideoFeed}>
        <View style={styles.placeholderAvatar}>
          <Text style={styles.docInitials}>AT</Text>
          <Text style={styles.docStatusText}>Dr. Aris Thorne, MD (Dermatology)</Text>
        </View>

        {/* Live Call Duration Banner */}
        <View style={styles.timerBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.timerText}>12:45 · Encrypted HIPAA Stream</Text>
        </View>

        {/* PIP Self Camera Preview */}
        <View style={styles.pipWindow}>
          {isCameraOff ? (
            <View style={styles.pipOff}>
              <Feather name="camera-off" size={16} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.pipOn}>
              <Text style={styles.pipText}>You</Text>
            </View>
          )}
        </View>
      </View>

      {/* Digital Prescription Drawer Modal */}
      {showPrescription && (
        <View style={styles.rxDrawer}>
          <View style={styles.rxHeader}>
            <Text style={styles.rxTitle}>Digital Prescription Issued</Text>
            <TouchableOpacity onPress={() => setShowPrescription(false)}>
              <Feather name="x" size={18} color="#1E1B4B" />
            </TouchableOpacity>
          </View>
          <Text style={styles.rxBody}>
            • Tretinoin 0.025% Cream — Apply thin layer at night.{'\n'}
            • Barrier Restoration Emulsion — Apply morning and night.
          </Text>
          <TouchableOpacity style={styles.rxBtn} onPress={() => onNavigate('products')}>
            <Text style={styles.rxBtnText}>Add Rx Formulations to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Floating Control Bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Feather name={isMuted ? "mic-off" : "mic"} size={22} color={isMuted ? '#DC2626' : '#FFFFFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <Feather name={isCameraOff ? "camera-off" : "camera"} size={22} color={isCameraOff ? '#DC2626' : '#FFFFFF'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setShowPrescription(!showPrescription)}
        >
          <Feather name="file-text" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallBtn}
          onPress={() => onNavigate('consultations')}
        >
          <Feather name="phone-off" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  doctorVideoFeed: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  placeholderAvatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  docInitials: { fontSize: 42, fontWeight: '800', color: '#FFFFFF' },
  docStatusText: { color: '#E2E8F0', fontSize: 16, fontWeight: '700', marginTop: 12 },
  timerBadge: { position: 'absolute', top: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.75)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 },
  timerText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  pipWindow: { position: 'absolute', top: 50, right: 20, width: 90, height: 130, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: '#1E293B' },
  pipOn: { flex: 1, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  pipOff: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  pipText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  rxDrawer: { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, elevation: 10 },
  rxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rxTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B' },
  rxBody: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 14 },
  rxBtn: { backgroundColor: '#4338CA', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  rxBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  controlsBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#1E293B', paddingVertical: 16, paddingHorizontal: 24, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  controlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  controlBtnActive: { backgroundColor: '#FEE2E2' },
  endCallBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
});
