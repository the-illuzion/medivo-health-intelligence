import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform, Pressable, Image, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  PageHeading,
  Ring,
  Row,
  Section,
  Tile,
  s,
} from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import { useSheetStore } from '../../../store/useSheetStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useScanStore } from '../../../store/useScanStore';
import { useCareStore } from '../../../store/useCareStore';
import { apiClient } from '@medivo/api-client';
import { colors as c, designRoutes } from '../tokens';

type ScanPhase = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

interface AlignmentFeedback {
  message: string;
  color: string;
  isAligned: boolean;
}

export default function Scan() {
  const router = useRouter();
  const desktop = useDesktop();
  const { openDetail } = useSheetStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { profile, fetchProfile } = useHealthProfileStore();
  const { addManualReading, fetchVitals, fetchInsights } = useVitalsStore();
  const { fetchScanHistory, setActiveScan } = useScanStore();
  const { fetchCarePlan } = useCareStore();

  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [consentGiven, setConsentGiven] = useState(true);
  const [progressMsg, setProgressMsg] = useState('Position your face inside the oval guide');
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);

  const [alignment, setAlignment] = useState<AlignmentFeedback>({
    message: 'Center your face in the oval',
    color: '#38BDF8',
    isAligned: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownIntervalRef = useRef<any>(null);
  const isAlignedRef = useRef(false);

  useEffect(() => {
    fetchDevices();
    fetchProfile();
  }, []);

  // Initialize WebRTC camera on mount (Web)
  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
          if (active) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(() => {});
            }
            setHasCameraPermission(true);
          }
        } catch (err) {
          console.warn('[CameraScan] Camera permission denied or unavailable:', err);
          if (active) setHasCameraPermission(false);
        }
      }
    }

    if (phase === 'idle') {
      startCamera();
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, phase]);

  // Real-time video frame face positioning analyzer
  useEffect(() => {
    if (phase !== 'idle' || !hasCameraPermission || Platform.OS !== 'web') {
      return;
    }

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      if (!analysisCanvasRef.current) {
        analysisCanvasRef.current = document.createElement('canvas');
        analysisCanvasRef.current.width = 160;
        analysisCanvasRef.current.height = 160;
      }

      const canvas = analysisCanvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 160, 160);
      const imgData = ctx.getImageData(0, 0, 160, 160);
      const data = imgData.data;

      let totalLuminance = 0;
      let skinPixels = 0;
      let skinXSum = 0;
      let skinYSum = 0;

      const cx = 80;
      const cy = 80;
      const rx = 48;
      const ry = 64;

      for (let y = 0; y < 160; y += 2) {
        for (let x = 0; x < 160; x += 2) {
          const idx = (y * 160 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;

          const dx = (x - cx) / rx;
          const dy = (y - cy) / ry;
          const insideOval = dx * dx + dy * dy <= 1.0;

          const isSkin =
            r > 60 &&
            g > 40 &&
            b > 20 &&
            r > g &&
            r > b &&
            Math.abs(r - g) > 12 &&
            r - b > 10;

          if (isSkin && insideOval) {
            skinPixels++;
            skinXSum += x;
            skinYSum += y;
          }
        }
      }

      const sampleCount = (160 * 160) / 4;
      const avgLuminance = totalLuminance / sampleCount;
      const ovalSampleCount = (Math.PI * rx * ry) / 4;
      const skinCoverage = skinPixels / ovalSampleCount;

      let nextFeedback: AlignmentFeedback;

      if (avgLuminance < 40) {
        nextFeedback = {
          message: 'Lighting too dark — face a light source',
          color: '#F59E0B',
          isAligned: false,
        };
      } else if (avgLuminance > 230) {
        nextFeedback = {
          message: 'Too much glare — adjust lighting',
          color: '#F59E0B',
          isAligned: false,
        };
      } else if (skinCoverage < 0.12) {
        nextFeedback = {
          message: 'Position your face in the oval guide',
          color: '#38BDF8',
          isAligned: false,
        };
      } else if (skinCoverage < 0.32) {
        nextFeedback = {
          message: 'Move closer to the camera',
          color: '#F59E0B',
          isAligned: false,
        };
      } else if (skinCoverage > 0.88) {
        nextFeedback = {
          message: 'Move back slightly',
          color: '#F59E0B',
          isAligned: false,
        };
      } else {
        const centroidX = skinXSum / skinPixels / 160;
        const centroidY = skinYSum / skinPixels / 160;

        if (centroidX < 0.40) {
          nextFeedback = {
            message: 'Shift face slightly right ➡️',
            color: '#38BDF8',
            isAligned: false,
          };
        } else if (centroidX > 0.60) {
          nextFeedback = {
            message: 'Shift face slightly left ⬅️',
            color: '#38BDF8',
            isAligned: false,
          };
        } else if (centroidY < 0.38) {
          nextFeedback = {
            message: 'Tilt head down slightly ⬇️',
            color: '#38BDF8',
            isAligned: false,
          };
        } else if (centroidY > 0.62) {
          nextFeedback = {
            message: 'Tilt head up slightly ⬆️',
            color: '#38BDF8',
            isAligned: false,
          };
        } else {
          nextFeedback = {
            message: 'Aligned! Hold steady to capture…',
            color: '#10B981',
            isAligned: true,
          };
        }
      }

      setAlignment(nextFeedback);
      isAlignedRef.current = nextFeedback.isAligned;
    }, 120);

    return () => clearInterval(interval);
  }, [phase, hasCameraPermission]);

  // Handle Auto-Capture Countdown
  useEffect(() => {
    if (phase !== 'idle' || !consentGiven) {
      if (countdown !== null) setCountdown(null);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      return;
    }

    if (alignment.isAligned) {
      if (countdown === null && !countdownIntervalRef.current) {
        let currentCount = 3;
        setCountdown(currentCount);

        countdownIntervalRef.current = setInterval(() => {
          if (!isAlignedRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            setCountdown(null);
            return;
          }

          currentCount -= 1;
          if (currentCount > 0) {
            setCountdown(currentCount);
          } else {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            setCountdown(null);
            triggerShutterAndCapture();
          }
        }, 800);
      }
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (countdown !== null) {
        setCountdown(null);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [alignment.isAligned, phase, consentGiven]);

  const triggerShutterAndCapture = useCallback(() => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);
    handleCaptureLiveFrame();
  }, [consentGiven]);

  async function handleCaptureLiveFrame() {
    if (!consentGiven) {
      setErrorMessage('User consent is mandatory before processing biometric telemetry.');
      return;
    }

    setErrorMessage(null);
    setPhase('capturing');
    setProgressMsg('Acquiring high-resolution facial telemetry frame...');

    let imageBase64Data = '';

    if (Platform.OS === 'web' && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageBase64Data = canvas.toDataURL('image/jpeg', 0.90);
          setCapturedImageUri(imageBase64Data);
        }
      } catch (e) {
        console.warn('Canvas capture error');
      }
    }

    if (!imageBase64Data) {
      imageBase64Data = `data:image/jpeg;base64,MEDIVO_SCAN_${Date.now()}`;
    }

    executeAiAnalysisPipeline(imageBase64Data);
  }

  function handleFileSelected(event: any) {
    if (!consentGiven) {
      setErrorMessage('User consent is mandatory before processing biometric telemetry.');
      return;
    }

    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setCapturedImageUri(base64);
        setPhase('capturing');
        executeAiAnalysisPipeline(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  async function executeAiAnalysisPipeline(imageBase64: string) {
    setPhase('analyzing');
    setErrorMessage(null);

    setProgressMsg('Analyzing 15 optical skin attributes & rPPG vital signs…');

    try {
      const res = await apiClient.scans.analyze(imageBase64, consentGiven, 'v1.0');
      if (res) {
        setScanResult(res);
        setActiveScan(res);
        if (res.metrics?.heartRate) {
          await addManualReading({ metricType: 'Heart Rate', valueString: `${res.metrics.heartRate}` });
        }
        await Promise.allSettled([
          fetchVitals(),
          fetchInsights(),
          fetchScanHistory(),
          fetchCarePlan(),
        ]);
        setPhase('complete');
      } else {
        setPhase('error');
        setErrorMessage('Failed to receive telemetry response from AI service.');
      }
    } catch (err: any) {
      setPhase('error');
      setErrorMessage(err?.message || 'AI Telemetry scan failed. Please try again.');
    }
  }

  function handleResetScan() {
    setPhase('idle');
    setCapturedImageUri(null);
    setScanResult(null);
    setErrorMessage(null);
    setCountdown(null);
    setProgressMsg('Position your face inside the oval guide');
  }

  const m = scanResult?.metrics || {};
  const score = typeof scanResult?.overallScore === 'number' ? scanResult.overallScore : null;
  const grade = scanResult?.grade || (score && score >= 85 ? 'Optimal Grade' : score && score >= 70 ? 'Good Condition' : 'Attention Advised');
  const recentDoc = profile.healthRecords?.[0]?.title || 'Uploaded Lab Report';

  const biomarkerList = [
    { label: 'Hydration', val: `${m.hydration ?? 88}%`, tone: 'blue' as const, icon: 'drop' },
    { label: 'Barrier Health', val: `${m.barrierHealth ?? 92}%`, tone: 'green' as const, icon: 'shield' },
    { label: 'Micro-Texture', val: `${m.texture ?? 85}/100`, tone: 'purple' as const, icon: 'zap' },
    { label: 'Pore Clarity', val: `${m.poreClarity ?? 84}%`, tone: 'blue' as const, icon: 'bulb' },
    { label: 'Melanin Balance', val: `${m.pigmentation ?? 89}/100`, tone: 'orange' as const, icon: 'bulb' },
    { label: 'Erythema', val: `${m.rednessScore ?? 12}%`, tone: 'red' as const, icon: 'heart' },
    { label: 'Radiance & Glow', val: `${m.radiance ?? 87}/100`, tone: 'orange' as const, icon: 'zap' },
    { label: 'Elasticity & Firmness', val: `${m.firmness ?? 85}/100`, tone: 'purple' as const, icon: 'shield' },
    { label: 'Biological Skin Age', val: `${m.skinAge ?? 26} yrs`, tone: 'blue' as const, icon: 'moon' },
    { label: 'Dark Circles', val: `${m.darkCircles ?? 74}/100`, tone: 'purple' as const, icon: 'moon' },
    { label: 'Under-Eye Bags', val: `${m.eyeBags ?? 78}/100`, tone: 'purple' as const, icon: 'moon' },
    { label: 'Acne Defense', val: `${m.acneScore ?? 92}/100`, tone: 'green' as const, icon: 'done' },
    { label: 'Diagnostic Skin Type', val: `${m.skinType || 'Combination'}`, tone: 'blue' as const, icon: 'file' },
    { label: 'Photoprotection', val: `${m.photoprotection || 'SPF 50 Active'}`, tone: 'green' as const, icon: 'shield' },
  ];

  return (
    <Screen>
      <PageHeading
        title="Start a Scan"
        subtitle="Live optical face scan for 15 clinical skin attributes & rPPG vitals."
      />

      <View style={desktop ? st.desktopHeroGrid : undefined}>
        {/* Main Camera Viewfinder or Completed Result Card */}
        <View style={[st.cameraSection, desktop && st.desktopScanCard]}>
          {phase !== 'complete' ? (
            <View style={st.viewportBox}>
              {/* WebRTC Video Stream */}
              {Platform.OS === 'web' && hasCameraPermission !== false && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                  }}
                />
              )}

              {/* Captured Image Preview */}
              {capturedImageUri && (
                <Image source={{ uri: capturedImageUri }} style={st.capturedPreview} />
              )}

              {/* Flash overlay */}
              {shutterFlash && <View style={st.shutterFlash} />}

              {/* Bounding Oval Guide */}
              <View
                style={[
                  st.boundingOval,
                  alignment.isAligned && st.boundingOvalAligned,
                  phase === 'analyzing' && st.boundingOvalAnalyzing,
                ]}
              >
                {countdown !== null && (
                  <View style={st.countdownBadge}>
                    <Copy bold size={32} color="white">
                      {countdown}
                    </Copy>
                    <Copy size={9} color="white" bold>
                      HOLD STEADY
                    </Copy>
                  </View>
                )}
              </View>

              {/* Telemetry Badge HUD */}
              <View style={st.hudBar}>
                <Chip tone="green">HIPAA AES-256</Chip>
                <Chip tone="blue">rPPG Vitals Active</Chip>
              </View>

              {/* Camera Switch button */}
              <Pressable
                accessibilityLabel="Switch Camera"
                style={st.switchCamBtn}
                onPress={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
              >
                <Icon name="settings" size={16} color="white" />
              </Pressable>
            </View>
          ) : (
            /* Completed Result Dossier */
            <View style={{ gap: 12 }}>
              <Card style={[s.center, { backgroundColor: c.greenSoft, paddingVertical: 18 }]}>
                <Ring value={score} size={64} />
                <Heading size={22} style={{ color: c.green, marginTop: 10 }}>
                  {grade}
                </Heading>
                <View style={[s.row, { gap: 6, marginTop: 4 }]}>
                  <Chip tone="green">Score: {score}/100</Chip>
                  <Chip tone="blue">{m.skinType || 'Combination'}</Chip>
                  <Chip tone="purple">{m.photoprotection || 'SPF 50 Active'}</Chip>
                </View>
              </Card>

              {/* 4 Quick Vitals */}
              <Card style={{ padding: 12, backgroundColor: '#f8fafc' }}>
                <Copy bold size={11} color={c.navy} style={{ marginBottom: 8, letterSpacing: 0.5 }}>
                  rPPG FACIAL VITALS & BIOMARKERS
                </Copy>
                <View style={[s.row, { justifyContent: 'space-between', paddingVertical: 4 }]}>
                  <View style={[s.center, { flex: 1 }]}>
                    <Copy bold size={15} color={c.navy}>{m.heartRate ?? 72} <Copy size={10} color={c.muted}>BPM</Copy></Copy>
                    <Copy size={9} color={c.muted}>Vital Pulse</Copy>
                  </View>
                  <View style={{ width: 1, height: 28, backgroundColor: '#e2e8f0' }} />
                  <View style={[s.center, { flex: 1 }]}>
                    <Copy bold size={15} color={c.navy}>{m.stressIndex ?? 18}<Copy size={10} color={c.muted}>/100</Copy></Copy>
                    <Copy size={9} color={c.muted}>Stress Index</Copy>
                  </View>
                  <View style={{ width: 1, height: 28, backgroundColor: '#e2e8f0' }} />
                  <View style={[s.center, { flex: 1 }]}>
                    <Copy bold size={15} color={c.navy}>{m.barrierHealth ?? 92}<Copy size={10} color={c.muted}>%</Copy></Copy>
                    <Copy size={9} color={c.muted}>Barrier Health</Copy>
                  </View>
                  <View style={{ width: 1, height: 28, backgroundColor: '#e2e8f0' }} />
                  <View style={[s.center, { flex: 1 }]}>
                    <Copy bold size={15} color={c.navy}>{m.skinAge ?? 26} <Copy size={10} color={c.muted}>yrs</Copy></Copy>
                    <Copy size={9} color={c.muted}>Dermal Age</Copy>
                  </View>
                </View>
              </Card>

              {/* 15 Attributes */}
              <Card style={{ padding: 12 }}>
                <Copy bold size={11} color={c.navy} style={{ marginBottom: 8, letterSpacing: 0.5 }}>
                  15 CLINICAL SKIN & CELLULAR ATTRIBUTES
                </Copy>
                <View style={[s.row, { flexWrap: 'wrap', gap: 6 }]}>
                  {biomarkerList.map((item) => (
                    <View
                      key={item.label}
                      style={[
                        s.row,
                        {
                          width: '48.5%',
                          backgroundColor: '#f8fafc',
                          borderRadius: 10,
                          padding: 8,
                          gap: 6,
                          borderWidth: 1,
                          borderColor: '#edf2f7',
                        },
                      ]}
                    >
                      <Tile name={item.icon} tone={item.tone} size={24} />
                      <View style={s.flex}>
                        <Copy size={9} color={c.muted}>
                          {item.label}
                        </Copy>
                        <Copy bold size={11} color={c.navy}>
                          {item.val}
                        </Copy>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>

              {/* Recommendations */}
              {scanResult?.recommendations && scanResult.recommendations.length > 0 && (
                <Card style={{ padding: 12 }}>
                  <Copy bold size={11} color={c.navy} style={{ marginBottom: 6, letterSpacing: 0.5 }}>
                    TARGETED CLINICAL PROTOCOL
                  </Copy>
                  {scanResult.recommendations.map((rec: string, idx: number) => (
                    <View key={idx} style={[s.row, { alignItems: 'flex-start', gap: 6, marginVertical: 4 }]}>
                      <View style={{ marginTop: 2 }}>
                        <Icon name="done" color={c.green} size={14} />
                      </View>
                      <Copy size={11} color={c.navy} style={s.flex}>
                        {rec}
                      </Copy>
                    </View>
                  ))}
                </Card>
              )}
            </View>
          )}

          {/* Real-time Guidance Banner */}
          {phase === 'idle' && (
            <View style={[st.guidanceBanner, alignment.isAligned && st.guidanceBannerAligned]}>
              <Icon
                name={alignment.isAligned ? 'done' : 'camera'}
                color={alignment.color}
                size={16}
              />
              <Copy size={11} bold color={alignment.color} style={{ marginLeft: 6 }}>
                {alignment.message}
              </Copy>
            </View>
          )}

          {/* Progress / Status / Error message */}
          {phase !== 'idle' && phase !== 'complete' && (
            <View style={[s.row, s.center, { marginVertical: 8 }]}>
              {phase === 'analyzing' && (
                <ActivityIndicator size="small" color={c.blue} style={{ marginRight: 8 }} />
              )}
              <Copy size={12} color={phase === 'error' ? c.red : c.blue} bold>
                {phase === 'error' ? errorMessage : progressMsg}
              </Copy>
            </View>
          )}

          {/* Consent Checkbox */}
          {phase === 'idle' && (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel="Biometric consent"
              accessibilityState={{ checked: consentGiven }}
              onPress={() => setConsentGiven(!consentGiven)}
              style={[s.row, { marginTop: 8 }]}
            >
              <Icon name={consentGiven ? 'done' : 'shield'} color={consentGiven ? c.green : c.muted} />
              <Copy size={11} color={c.muted} style={s.flex}>
                I consent to optical vital telemetry processing under HIPAA Privacy Rules.
              </Copy>
            </Pressable>
          )}

          {/* Action Buttons */}
          <View style={{ gap: 8, marginTop: 12 }}>
            {phase === 'idle' && (
              <>
                <Action
                  disabled={!consentGiven}
                  style={[st.scanButton, alignment.isAligned && { backgroundColor: c.green }]}
                  onPress={triggerShutterAndCapture}
                >
                  <Icon name="camera" color="white" />
                  <Copy bold size={15} color="white">
                    {alignment.isAligned ? 'Capture Frame Now' : 'Manual Capture'}
                  </Copy>
                </Action>

                {Platform.OS === 'web' && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileSelected}
                    />
                    <Action
                      secondary
                      onPress={() => fileInputRef.current?.click()}
                    >
                      <Icon name="file" size={16} />
                      <Copy size={13} bold color={c.navy}>
                        Upload Photo from Device
                      </Copy>
                    </Action>
                  </>
                )}
              </>
            )}

            {phase === 'complete' && (
              <>
                {scanResult?.id && (
                  <Action
                    style={{ backgroundColor: c.blue }}
                    onPress={() => router.push({ pathname: `/scan-report/${scanResult.id}` as any })}
                  >
                    Inspect Full Clinical Dossier
                  </Action>
                )}
                <Action secondary onPress={handleResetScan}>
                  <Icon name="camera" size={16} />
                  <Copy size={13} bold color={c.navy}>
                    Take Another Scan
                  </Copy>
                </Action>
              </>
            )}

            {phase === 'error' && (
              <Action onPress={handleResetScan}>
                Retry Camera Scan
              </Action>
            )}
          </View>
        </View>

        {/* Supporting methods */}
        <Section
          title="Other ways to add health data"
          style={desktop ? st.desktopMethodsCard : undefined}
        >
          <View style={s.grid2}>
            {[
              {
                title: 'Vitals Check',
                sub: 'Measure key vitals',
                icon: 'heartpulse',
                tone: 'green' as const,
              },
              {
                title: 'Upload Photo',
                sub: 'Add lab results or notes',
                icon: 'image',
                tone: 'blue' as const,
              },
              {
                title: 'Manual Entry',
                sub: 'Log data manually',
                icon: 'file',
                tone: 'orange' as const,
              },
              {
                title: 'Connect Device',
                sub: 'Sync from your device',
                icon: 'watch',
                tone: 'purple' as const,
              },
            ].map((item) => (
              <View key={item.title} style={s.half}>
                <Row
                  compact
                  title={item.title}
                  description={item.sub}
                  icon={item.icon}
                  tone={item.tone}
                  onPress={() =>
                    item.title === 'Connect Device'
                      ? router.push(designRoutes.devices)
                      : openDetail(item.title)
                  }
                />
              </View>
            ))}
          </View>
        </Section>
      </View>

      <View style={desktop ? st.desktopLowerGrid : undefined}>
        <Section
          title="Recent data sources"
          action="See all"
          onAction={() => openDetail('Recent data sources')}
          style={desktop ? st.desktopLowerCard : undefined}
        >
          <View style={s.grid3}>
            {devices.slice(0, 2).map((device) => (
              <Card
                key={device.id || device.name}
                style={[s.third, { padding: 8 }]}
                onPress={() => router.push(designRoutes.devices)}
              >
                <View style={[s.row, { gap: 5 }]}>
                  <DeviceArt kind={device.kind} size={25} />
                  <View style={s.flex}>
                    <Copy size={9} bold>
                      {device.name}
                    </Copy>
                    <Copy size={8} color={c.muted}>
                      Last sync: {device.sync}
                    </Copy>
                  </View>
                </View>
              </Card>
            ))}
            <Card
              style={[s.third, { padding: 8 }]}
              onPress={() => openDetail('Recent data sources')}
            >
              <View style={[s.row, { gap: 5 }]}>
                <Icon name="file" color={c.red} />
                <View style={s.flex}>
                  <Copy size={9} bold>
                    {recentDoc}
                  </Copy>
                  <Copy size={8} color={c.muted}>
                    Recently added
                  </Copy>
                </View>
              </View>
            </Card>
          </View>
        </Section>

        <Section
          title="How it works"
          style={desktop ? st.desktopLowerCard : undefined}
        >
          <Card style={s.grid3}>
            {[
              { title: 'Capture', sub: 'Live camera scan', icon: 'camera' },
              { title: 'Analyze', sub: 'Multi-modal AI inference', icon: 'chart' },
              { title: 'Review', sub: '15-biomarker dossier', icon: 'file' },
            ].map((item, i) => (
              <View key={item.title} style={[s.third, s.center, { gap: 5 }]}>
                <View style={s.row}>
                  <Copy color={c.muted}>{i + 1}</Copy>
                  <Icon name={item.icon} />
                </View>
                <Copy size={12} bold>
                  {item.title}
                </Copy>
                <Copy size={10} color={c.muted} style={{ textAlign: 'center' }}>
                  {item.sub}
                </Copy>
              </View>
            ))}
          </Card>
        </Section>
      </View>

      <View style={{ marginTop: 12 }}>
        <Row
          title="Your health data stays protected"
          description="Encrypted, private, and never shared without your consent."
          icon="shield"
          tone="green"
          onPress={() => openDetail('Privacy & Permissions')}
        />
      </View>

      {/* Interactive Error Popup Dialog */}
      <Modal
        visible={phase === 'error' && !!errorMessage}
        transparent
        animationType="fade"
        onRequestClose={handleResetScan}
      >
        <View style={st.modalOverlay}>
          <View style={st.modalCard}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Tile name="alert" tone="red" size={44} />
            </View>
            <Heading size={18} style={{ textAlign: 'center', color: c.navy, marginBottom: 8 }}>
              Biometric Scan Failed
            </Heading>
            <Copy size={13} color={c.navy} style={{ textAlign: 'center', lineHeight: 19, marginBottom: 16 }}>
              {errorMessage}
            </Copy>

            <View style={st.errorTipsCard}>
              <Copy bold size={11} color={c.navy} style={{ marginBottom: 4 }}>
                Tips for a successful scan:
              </Copy>
              <Copy size={10} color={c.muted}>
                • Ensure your face is evenly illuminated with natural or bright ambient light.
              </Copy>
              <Copy size={10} color={c.muted}>
                • Avoid dark environments, direct glare, or strong backlighting.
              </Copy>
              <Copy size={10} color={c.muted}>
                • Align your face steadily inside the oval reticle guide.
              </Copy>
            </View>

            <View style={{ marginTop: 16, width: '100%' }}>
              <Action onPress={handleResetScan}>
                Try Again
              </Action>
            </View>
          </View>
        </View>
      </Modal>

      <DemoNote text="Live optical vital scan and biomarker analysis with real-time biometric consent." />
    </Screen>
  );
}

const st = StyleSheet.create({
  cameraSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    overflow: 'hidden',
  },
  viewportBox: {
    width: '100%',
    height: 330,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  shutterFlash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  boundingOval: {
    width: 170,
    height: 230,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  boundingOvalAligned: {
    borderColor: '#10b981',
    borderStyle: 'solid',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  boundingOvalAnalyzing: {
    borderColor: '#6366f1',
    borderStyle: 'solid',
  },
  countdownBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  hudBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
    zIndex: 6,
  },
  switchCamBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
  },
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  guidanceBannerAligned: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  scanButton: {
    borderRadius: 50,
    backgroundColor: '#102957',
  },
  desktopHeroGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopScanCard: {
    flex: 1.2,
  },
  desktopMethodsCard: {
    flex: 1,
    marginTop: 0,
  },
  desktopLowerGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  desktopLowerCard: {
    flex: 1,
    marginTop: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  errorTipsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
});
