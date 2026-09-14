import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Screen, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  PageHeading,
  Ring,
  Row,
  Section,
  Tile,
  s,
} from '../components/UI';
import { DeviceArt, ScanPortrait } from '../components/Illustrations';
import { useSheetStore } from '../../../store/useSheetStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useScanStore } from '../../../store/useScanStore';
import { useCareStore } from '../../../store/useCareStore';
import { useHealthSummary } from '../../../hooks/useHealthSummary';
import { formatHealthLastSync } from '../../../services/health/healthDisplay';
import { colors as c, designRoutes } from '../tokens';

type ScanPhase = 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';

type AlignmentFeedback = {
  message: string;
  color: string;
  isAligned: boolean;
};

export default function Scan() {
  const router = useRouter();
  const desktop = useDesktop();
  const { openDetail } = useSheetStore();
  const { devices, fetchDevices } = useDevicesStore();
  const { addManualReading, fetchVitals, fetchInsights } = useVitalsStore();
  const {
    performScan,
    fetchScanHistory,
    consentGiven,
    setConsentGiven,
  } = useScanStore();
  const { fetchCarePlan } = useCareStore();
  const { connection } = useHealthSummary('day');

  const [nativePermission, requestNativePermission] = useCameraPermissions();
  const nativeCameraRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isAlignedRef = useRef(false);
  const countdownIntervalRef = useRef<any>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webCameraPermission, setWebCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [alignment, setAlignment] = useState<AlignmentFeedback>({
    message: 'Center your face in the oval',
    color: '#38BDF8',
    isAligned: false,
  });

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  const stopWebCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startWebCamera = useCallback(async () => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    stopWebCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setWebCameraPermission(true);
    } catch {
      setWebCameraPermission(false);
    }
  }, [facingMode, stopWebCamera]);

  useEffect(() => {
    if (!scannerOpen || phase !== 'idle') {
      if (!scannerOpen) stopWebCamera();
      return;
    }

    if (Platform.OS === 'web') {
      void startWebCamera();
    }

    return () => {
      if (!scannerOpen) stopWebCamera();
    };
  }, [scannerOpen, phase, startWebCamera, stopWebCamera]);

  useEffect(() => {
    if (!scannerOpen || phase !== 'idle' || webCameraPermission !== true || Platform.OS !== 'web') {
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
      const data = ctx.getImageData(0, 0, 160, 160).data;
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
          totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;

          const dx = (x - cx) / rx;
          const dy = (y - cy) / ry;
          const insideOval = dx * dx + dy * dy <= 1;
          const isSkin =
            r > 60 &&
            g > 40 &&
            b > 20 &&
            r > g &&
            r > b &&
            Math.abs(r - g) > 12 &&
            r - b > 10;

          if (isSkin && insideOval) {
            skinPixels += 1;
            skinXSum += x;
            skinYSum += y;
          }
        }
      }

      const avgLuminance = totalLuminance / ((160 * 160) / 4);
      const skinCoverage = skinPixels / ((Math.PI * rx * ry) / 4);
      let next: AlignmentFeedback;

      if (avgLuminance < 40) {
        next = { message: 'Lighting too dark — face a light source', color: '#F59E0B', isAligned: false };
      } else if (avgLuminance > 230) {
        next = { message: 'Too much glare — adjust lighting', color: '#F59E0B', isAligned: false };
      } else if (skinCoverage < 0.12) {
        next = { message: 'Position your face in the oval guide', color: '#38BDF8', isAligned: false };
      } else if (skinCoverage < 0.32) {
        next = { message: 'Move closer to the camera', color: '#F59E0B', isAligned: false };
      } else if (skinCoverage > 0.88) {
        next = { message: 'Move back slightly', color: '#F59E0B', isAligned: false };
      } else {
        const centroidX = skinXSum / skinPixels / 160;
        const centroidY = skinYSum / skinPixels / 160;
        if (centroidX < 0.4) {
          next = { message: 'Shift face slightly right', color: '#38BDF8', isAligned: false };
        } else if (centroidX > 0.6) {
          next = { message: 'Shift face slightly left', color: '#38BDF8', isAligned: false };
        } else if (centroidY < 0.38) {
          next = { message: 'Tilt head down slightly', color: '#38BDF8', isAligned: false };
        } else if (centroidY > 0.62) {
          next = { message: 'Tilt head up slightly', color: '#38BDF8', isAligned: false };
        } else {
          next = { message: 'Aligned! Hold steady to capture…', color: '#10B981', isAligned: true };
        }
      }

      setAlignment(next);
      isAlignedRef.current = next.isAligned;
    }, 150);

    return () => clearInterval(interval);
  }, [scannerOpen, phase, webCameraPermission]);

  const executeAnalysis = useCallback(
    async (imageBase64: string) => {
      setPhase('analyzing');
      setErrorMessage(null);
      const result = await performScan(imageBase64);

      if (!result) {
        setPhase('error');
        setErrorMessage('AI telemetry scan failed. Please try again.');
        return;
      }

      setScanResult(result);
      const metrics = (result as any).metrics || {};
      if (metrics.heartRate) {
        await addManualReading({ metricType: 'Heart Rate', valueString: `${metrics.heartRate}` });
      }

      await Promise.allSettled([
        fetchVitals(),
        fetchInsights(),
        fetchScanHistory(),
        fetchCarePlan(),
      ]);
      setPhase('complete');
    },
    [performScan, addManualReading, fetchVitals, fetchInsights, fetchScanHistory, fetchCarePlan],
  );

  const captureFrame = useCallback(async () => {
    if (!consentGiven) {
      setErrorMessage('HIPAA consent is required before performing an AI scan.');
      return;
    }

    setPhase('capturing');
    setErrorMessage(null);

    try {
      let imageBase64 = '';

      if (Platform.OS === 'web' && videoRef.current) {
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
          imageBase64 = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImageUri(imageBase64);
        }
      } else if (Platform.OS !== 'web' && nativeCameraRef.current) {
        const photo = await nativeCameraRef.current.takePictureAsync({
          quality: 0.85,
          base64: true,
          skipProcessing: false,
        });
        if (photo?.uri) setCapturedImageUri(photo.uri);
        if (photo?.base64) imageBase64 = `data:image/jpeg;base64,${photo.base64}`;
      }

      if (!imageBase64) {
        throw new Error('No camera frame could be captured.');
      }

      await executeAnalysis(imageBase64);
    } catch (error: any) {
      setPhase('error');
      setErrorMessage(error?.message || 'Unable to capture the camera frame.');
    }
  }, [consentGiven, executeAnalysis, facingMode]);

  useEffect(() => {
    if (!scannerOpen || phase !== 'idle' || !consentGiven || Platform.OS !== 'web') return;

    if (alignment.isAligned) {
      if (!countdownIntervalRef.current) {
        let current = 3;
        setCountdown(current);
        countdownIntervalRef.current = setInterval(() => {
          if (!isAlignedRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            setCountdown(null);
            return;
          }
          current -= 1;
          if (current > 0) {
            setCountdown(current);
          } else {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
            setCountdown(null);
            void captureFrame();
          }
        }, 800);
      }
    } else if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
      setCountdown(null);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [alignment.isAligned, scannerOpen, phase, consentGiven, captureFrame]);

  const openScanner = async () => {
    setScannerOpen(true);
    setPhase('idle');
    setCapturedImageUri(null);
    setScanResult(null);
    setErrorMessage(null);
    setAlignment({ message: 'Center your face in the oval', color: '#38BDF8', isAligned: false });

    if (Platform.OS !== 'web' && !nativePermission?.granted) {
      await requestNativePermission();
    }
  };

  const closeScanner = () => {
    stopWebCamera();
    setScannerOpen(false);
    setCountdown(null);
  };

  const resetScanner = () => {
    setPhase('idle');
    setCapturedImageUri(null);
    setScanResult(null);
    setErrorMessage(null);
    setAlignment({ message: 'Center your face in the oval', color: '#38BDF8', isAligned: false });
  };

  const handleFileSelected = (event: any) => {
    const file = event.target?.files?.[0];
    if (!file || !consentGiven) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const data = loadEvent.target?.result as string;
      if (!data) return;
      setCapturedImageUri(data);
      void executeAnalysis(data);
    };
    reader.readAsDataURL(file);
  };

  const resultMetrics = (scanResult as any)?.metrics || {};
  const resultScore = typeof (scanResult as any)?.overallScore === 'number' ? (scanResult as any).overallScore : null;
  const resultGrade =
    (scanResult as any)?.grade ||
    (resultScore && resultScore >= 85
      ? 'Optimal Grade'
      : resultScore && resultScore >= 70
        ? 'Good Condition'
        : 'Attention Advised');

  return (
    <Screen>
      <PageHeading title="Start a Scan" subtitle="Capture a new scan or add supporting health data." />

      <View style={[st.scan, desktop && st.desktopScan]}>
        <ScanPortrait />
        <View style={st.label}>
          <Chip tone="blue" icon="camera">
            Face Scan
          </Chip>
        </View>
        <Action style={st.scanButton} onPress={() => void openScanner()}>
          <Icon name="camera" color={c.white} />
          <Copy bold size={15} color={c.white}>
            Begin Face Scan
          </Copy>
        </Action>
        <Copy size={10} color={c.muted} style={{ textAlign: 'center', marginVertical: 8 }}>
          Position your face in the frame
        </Copy>
      </View>

      <Section title="Other ways to add health data">
        <View style={s.grid2}>
          {[
            { title: 'Vitals Check', sub: 'Measure key vitals', icon: 'heartpulse', tone: 'green' as const },
            { title: 'Upload Photo', sub: 'Add lab results or notes', icon: 'image', tone: 'blue' as const },
            { title: 'Manual Entry', sub: 'Log data manually', icon: 'file', tone: 'orange' as const },
            { title: 'Connect Device', sub: 'Sync from your device', icon: 'watch', tone: 'purple' as const },
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
                    : item.title === 'Upload Photo' && Platform.OS === 'web'
                      ? fileInputRef.current?.click()
                      : openDetail(item.title)
                }
              />
            </View>
          ))}
        </View>
      </Section>

      {Platform.OS === 'web' ? (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />
      ) : null}

      <Section title="Recent data sources" action="Manage" onAction={() => router.push(designRoutes.devices)}>
        <Card style={{ padding: 9 }} onPress={() => router.push(designRoutes.devices)}>
          <View style={[s.row, { gap: 8 }]}>
            <Tile name="heart" tone="red" size={30} />
            <View style={s.flex}>
              <Copy size={10} bold>
                Apple Health
              </Copy>
              <Copy size={9} color={connection ? c.green : c.muted}>
                ● {connection ? 'Connected' : 'Not connected'}
              </Copy>
              <Copy size={8} color={c.muted}>
                Last sync: {formatHealthLastSync(connection?.lastSyncedAt)}
              </Copy>
            </View>
          </View>
        </Card>
        {devices.slice(0, 2).map((device) => (
          <Card
            key={device.id || device.name}
            style={{ padding: 9, marginTop: 8 }}
            onPress={() => router.push(designRoutes.devices)}
          >
            <View style={[s.row, { gap: 8 }]}>
              <DeviceArt kind={device.kind} size={30} />
              <View style={s.flex}>
                <Copy size={10} bold>
                  {device.name}
                </Copy>
                <Copy size={9} color={device.enabled ? c.green : c.muted}>
                  ● {device.enabled ? 'Connected' : 'Paused'}
                </Copy>
                <Copy size={8} color={c.muted}>
                  Last sync: {device.sync}
                </Copy>
              </View>
            </View>
          </Card>
        ))}
      </Section>

      <Section title="How it works">
        <Card style={s.grid3}>
          {[
            { title: 'Capture', sub: 'Take a quick scan', icon: 'camera' },
            { title: 'Analyze', sub: 'Analyze your capture', icon: 'chart' },
            { title: 'Review', sub: 'See your scan results', icon: 'file' },
          ].map((item, index) => (
            <View key={item.title} style={[s.third, s.center, { gap: 5 }]}>
              <View style={s.row}>
                <Copy color={c.muted}>{index + 1}</Copy>
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

      <View style={{ marginTop: 12 }}>
        <Row
          title="Your health data stays protected"
          description="You choose what to share. Your health data stays private and protected."
          icon="shield"
          tone="green"
          onPress={() => router.push(designRoutes.devices)}
        />
      </View>

      <Modal visible={scannerOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={closeScanner}>
        <View style={st.modal}>
          <View style={st.modalHeader}>
            <View style={s.flex}>
              <Heading size={20}>Face Scan</Heading>
              <Copy size={10} color={c.muted}>
                Optical skin attributes & rPPG vital telemetry
              </Copy>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close scanner" onPress={closeScanner} style={st.closeButton}>
              <Icon name="close" size={20} color={c.navy} />
            </Pressable>
          </View>

          <View style={st.modalBody}>
            {phase !== 'complete' ? (
              <View style={st.viewport}>
                {Platform.OS === 'web' ? (
                  webCameraPermission !== false ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                  ) : null
                ) : nativePermission?.granted ? (
                  <CameraView
                    ref={nativeCameraRef}
                    style={StyleSheet.absoluteFill}
                    facing={facingMode === 'user' ? 'front' : 'back'}
                  />
                ) : (
                  <View style={[StyleSheet.absoluteFill, s.center]}>
                    <Icon name="camera" size={44} color={c.muted} />
                    <Copy size={11} color={c.muted} style={{ marginTop: 8, textAlign: 'center' }}>
                      Camera permission is required to start a face scan.
                    </Copy>
                    <Action secondary style={{ marginTop: 12 }} onPress={() => void requestNativePermission()}>
                      Allow Camera
                    </Action>
                  </View>
                )}

                {capturedImageUri ? <Image source={{ uri: capturedImageUri }} style={StyleSheet.absoluteFill} /> : null}

                <View style={[st.oval, alignment.isAligned && st.ovalAligned]}>
                  {countdown !== null ? (
                    <View style={st.countdown}>
                      <Copy size={32} bold color={c.white}>
                        {countdown}
                      </Copy>
                    </View>
                  ) : null}
                </View>

                <View style={st.hud}>
                  <Chip tone="green">HIPAA AES-256</Chip>
                  <Chip tone="blue">rPPG Vitals</Chip>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Switch camera"
                  style={st.switchCamera}
                  onPress={() => setFacingMode((value) => (value === 'user' ? 'environment' : 'user'))}
                >
                  <Icon name="settings" size={17} color={c.white} />
                </Pressable>

                {phase === 'analyzing' || phase === 'capturing' ? (
                  <View style={st.processing}>
                    <ActivityIndicator size="large" color={c.white} />
                    <Copy bold color={c.white} style={{ marginTop: 10, textAlign: 'center' }}>
                      {phase === 'capturing' ? 'Capturing frame…' : 'Analyzing health telemetry…'}
                    </Copy>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <Card style={[s.center, { backgroundColor: c.greenSoft, paddingVertical: 20 }]}>
                  <Ring value={resultScore} size={70} />
                  <Heading size={22} style={{ color: c.green, marginTop: 10 }}>
                    {resultGrade}
                  </Heading>
                  <Copy size={10} color={c.muted} style={{ marginTop: 6 }}>
                    Scan complete. Your vitals, scan history and care plan have been refreshed.
                  </Copy>
                </Card>
                <Card>
                  <View style={s.grid3}>
                    {[
                      ['Heart Rate', resultMetrics.heartRate ? `${resultMetrics.heartRate} bpm` : '—'],
                      ['Barrier Health', resultMetrics.barrierHealth ? `${resultMetrics.barrierHealth}%` : '—'],
                      ['Skin Age', resultMetrics.skinAge ? `${resultMetrics.skinAge} yrs` : '—'],
                    ].map(([label, value]) => (
                      <View key={label} style={[s.third, s.center]}>
                        <Copy size={9} color={c.muted}>
                          {label}
                        </Copy>
                        <Copy bold size={14} style={s.top4}>
                          {value}
                        </Copy>
                      </View>
                    ))}
                  </View>
                </Card>
              </View>
            )}

            {phase === 'idle' ? (
              <View style={[st.guidance, alignment.isAligned && { backgroundColor: c.greenSoft }]}>
                <Icon
                  name={alignment.isAligned ? 'done' : 'camera'}
                  color={Platform.OS === 'web' ? alignment.color : c.blue}
                  size={16}
                />
                <Copy
                  size={11}
                  bold
                  color={Platform.OS === 'web' ? alignment.color : c.blue}
                  style={{ marginLeft: 6 }}
                >
                  {Platform.OS === 'web' ? alignment.message : 'Center your face in the oval, then capture'}
                </Copy>
              </View>
            ) : null}

            {errorMessage ? (
              <Card style={{ marginTop: 10, backgroundColor: c.redSoft, borderColor: c.red }}>
                <Copy size={10} color={c.red}>
                  {errorMessage}
                </Copy>
              </Card>
            ) : null}

            {phase === 'idle' ? (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: consentGiven }}
                onPress={() => setConsentGiven(!consentGiven)}
                style={[s.row, { marginTop: 12 }]}
              >
                <Icon name={consentGiven ? 'done' : 'shield'} color={consentGiven ? c.green : c.muted} />
                <Copy size={11} color={c.muted} style={s.flex}>
                  I consent to optical vital telemetry processing under HIPAA Privacy Rules.
                </Copy>
              </Pressable>
            ) : null}

            <View style={{ gap: 8, marginTop: 12 }}>
              {phase === 'idle' ? (
                <Action disabled={!consentGiven} onPress={() => void captureFrame()}>
                  <Icon name="camera" color={c.white} />
                  <Copy bold color={c.white}>
                    Capture Frame
                  </Copy>
                </Action>
              ) : null}
              {phase === 'error' ? <Action onPress={resetScanner}>Retry Scan</Action> : null}
              {phase === 'complete' ? (
                <>
                  {(scanResult as any)?.id ? (
                    <Action onPress={() => router.push({ pathname: `/scan-report/${(scanResult as any).id}` as any })}>
                      View Full Scan Report
                    </Action>
                  ) : null}
                  <Action secondary onPress={resetScanner}>
                    Take Another Scan
                  </Action>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const st = StyleSheet.create({
  scan: {
    backgroundColor: '#e8f2ff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d3e5fc',
    overflow: 'hidden',
  },
  desktopScan: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  label: { position: 'absolute', top: 10, right: 10 },
  scanButton: {
    marginHorizontal: 16,
    borderRadius: 50,
    backgroundColor: '#102957',
    marginTop: -4,
  },
  modal: { flex: 1, backgroundColor: c.background },
  modalHeader: {
    backgroundColor: c.white,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f5f9',
  },
  modalBody: { flex: 1, padding: 18 },
  viewport: {
    minHeight: 430,
    flex: 1,
    maxHeight: 560,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0c162a',
    position: 'relative',
  },
  oval: {
    position: 'absolute',
    width: '52%',
    height: '68%',
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#38BDF8',
    alignSelf: 'center',
    top: '16%',
    left: '24%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalAligned: { borderColor: c.green, borderStyle: 'solid' },
  countdown: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hud: { position: 'absolute', left: 12, top: 12, flexDirection: 'row', gap: 6 },
  switchCamera: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(5,12,28,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processing: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,15,32,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  guidance: {
    marginTop: 10,
    padding: 11,
    borderRadius: 12,
    backgroundColor: c.blueSoft,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
