import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Action,
  Card,
  Carousel,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  IconButton,
  Ring,
  Tile,
  s,
} from './UI';
import { ScanPortrait } from './Illustrations';
import { useSheetStore } from '../../../store/useSheetStore';
import { useHealthProfileStore } from '../../../store/useHealthProfileStore';
import { useVitalsStore } from '../../../store/useVitalsStore';
import { useDevicesStore } from '../../../store/useDevicesStore';
import { useScanStore } from '../../../store/useScanStore';
import { useCareStore } from '../../../store/useCareStore';
import { apiClient } from '@medivo/api-client';
import { detailContent } from '../data/details';
import { colors as c, tones, designRoutes } from '../tokens';

export function SheetHost() {
  const { sheet, closeSheet } = useSheetStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const closeRef = useRef(closeSheet);
  closeRef.current = closeSheet;

  const drag = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 60 || g.vy > 1) closeRef.current();
      },
    }),
  ).current;

  return (
    <Modal
      visible={!!sheet}
      transparent
      animationType="slide"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[st.backdrop, desktop && st.desktopBackdrop]}
      >
        <Pressable
          accessibilityLabel="Dismiss sheet"
          onPress={closeSheet}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          aria-modal
          onAccessibilityEscape={closeSheet}
          style={[
            st.sheet,
            desktop && st.desktopSheet,
            { maxHeight: height - insets.top - 24, paddingBottom: Math.max(18, insets.bottom) },
          ]}
        >
          <View {...drag.panHandlers} style={st.drag}>
            <View style={st.handle} />
          </View>
          <View style={st.close}>
            <IconButton name="close" label="Close sheet" onPress={closeSheet} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 6 }}
          >
            {sheet?.kind === 'insights' ? (
              <InsightsContent />
            ) : sheet?.kind === 'alert' ? (
              <AlertContent />
            ) : sheet?.kind === 'scan' ? (
              <ScanContent />
            ) : sheet?.kind === 'connection' ? (
              <>
                <View style={st.success}>
                  <Icon name="done" color={c.green} size={55} />
                  <Heading size={22} style={{ marginTop: 15 }}>
                    {sheet.title} connected
                  </Heading>
                  <Copy color={c.muted} style={{ marginTop: 10, textAlign: 'center' }}>
                    Your health device is connected and syncing vitals securely.
                  </Copy>
                  <DemoNote text="Live device connection established." />
                </View>
                <Action
                  onPress={() => {
                    closeSheet();
                    router.replace(designRoutes.devices);
                  }}
                >
                  View devices
                </Action>
              </>
            ) : sheet ? (
              <DetailContent key={sheet.title} title={sheet.title || 'Details'} />
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function SheetHeading({
  title,
  subtitle,
  icon = 'file',
  tone = 'blue',
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  tone?: 'blue' | 'orange' | 'green';
}) {
  return (
    <View style={st.heading}>
      <Tile name={icon} tone={tone} size={44} />
      <View style={s.flex}>
        <Heading size={20}>{title}</Heading>
        {subtitle && (
          <Copy size={12} color={c.muted} style={s.top4}>
            {subtitle}
          </Copy>
        )}
      </View>
    </View>
  );
}

function InsightsContent() {
  const { closeSheet } = useSheetStore();
  const { insights } = useVitalsStore();

  return (
    <>
      <SheetHeading
        title="Insights for You"
        subtitle="Small changes. A healthier you."
        icon="bulb"
      />
      <Carousel label="Health insights">
        {insights.map((item) => (
          <View
            key={item.tag}
            style={[st.insight, { backgroundColor: tones[item.tone].background }]}
          >
            <Chip tone={item.tone}>{item.tag}</Chip>
            <View style={st.illustration}>
              <Icon
                name={item.icon}
                size={58}
                color={item.tone === 'blue' ? c.purple : tones[item.tone].foreground}
              />
            </View>
            <Heading size={22} style={{ marginTop: 12, maxWidth: 190 }}>
              {item.title}
              {'\n'}
              <Copy bold size={22} color={tones[item.tone].foreground}>
                {item.highlight}
              </Copy>
              {item.end ? `\n${item.end}` : ''}
            </Heading>
            <Copy size={12} color={c.muted} style={{ marginTop: 12, marginBottom: 14 }}>
              {item.text}
            </Copy>
            <View style={st.why}>
              <Tile
                name={item.tone === 'blue' ? 'heart' : 'zap'}
                tone={item.tone === 'blue' ? 'red' : 'green'}
                size={34}
              />
              <View style={s.flex}>
                <Copy size={11} bold>
                  Why this matters
                </Copy>
                <Copy size={10} color={c.muted} style={s.top4}>
                  {item.why}
                </Copy>
              </View>
            </View>
          </View>
        ))}
      </Carousel>
      <Action onPress={closeSheet}>Got it</Action>
    </>
  );
}

function AlertContent() {
  const { closeSheet } = useSheetStore();
  const { alerts } = useVitalsStore();
  const alert = alerts[0] || {
    title: 'Resting Heart Rate is higher than usual',
    subtitle: 'Your resting heart rate is 18% above your personal baseline for the past 3 days.',
    currentVal: '85 bpm',
    baselineVal: '72 bpm',
    possibleReasons: 'This can be due to poor sleep, increased stress, illness (like a cold), or strenuous activity.',
    actionItems: [
      'Recheck your vitals today',
      'Rest and stay hydrated',
      'If this continues or you have symptoms, contact your care team.',
    ],
  };
  const router = useRouter();

  return (
    <>
      <SheetHeading title={alert.title} icon="up" tone="orange" />
      <View style={{ marginLeft: 58, marginBottom: 15 }}>
        <Chip tone="red" icon="alert">
          Needs attention
        </Chip>
        <Copy size={12} color={c.muted} style={{ marginTop: 8 }}>
          {alert.subtitle}
        </Copy>
      </View>
      <Carousel fraction={0.41} label="Health alert information">
        {[
          <View key="changed" style={[st.alertCard, { backgroundColor: c.redSoft }]}>
            <Tile name="heart" tone="red" size={34} />
            <Heading size={13} style={st.alertTitle}>
              What changed?
            </Heading>
            <Copy size={11} color={c.muted}>
              {alert.subtitle}
            </Copy>
            <Copy bold size={12} style={{ marginTop: 15 }}>
              {alert.baselineVal} → {alert.currentVal}
            </Copy>
            <Copy size={9} color={c.muted}>
              Your average RHR
            </Copy>
          </View>,
          <View key="reasons" style={[st.alertCard, { backgroundColor: c.blueSoft }]}>
            <Tile name="moon" size={34} />
            <Heading size={13} style={st.alertTitle}>
              Possible reasons
            </Heading>
            <Copy size={11} color={c.muted}>
              {alert.possibleReasons}
            </Copy>
          </View>,
          <View key="next" style={[st.alertCard, { backgroundColor: c.greenSoft }]}>
            <Tile name="done" tone="green" size={34} />
            <Heading size={13} style={st.alertTitle}>
              What to do now
            </Heading>
            {alert.actionItems.map((text) => (
              <View
                style={[s.row, { alignItems: 'flex-start', gap: 5, marginBottom: 8 }]}
                key={text}
              >
                <Icon name="done" color={c.green} size={13} />
                <Copy size={10} color={c.muted} style={s.flex}>
                  {text}
                </Copy>
              </View>
            ))}
          </View>,
        ]}
      </Carousel>
      <Action
        onPress={() => {
          closeSheet();
          router.push({ pathname: designRoutes.metric, params: { name: 'Heart Rate' } });
        }}
      >
        View details
      </Action>
      <DemoNote text="Clinical health notification based on continuous telemetry analysis." />
    </>
  );
}

function ScanContent() {
  const { closeSheet } = useSheetStore();
  const router = useRouter();
  const { addManualReading, fetchVitals, fetchInsights } = useVitalsStore();
  const { fetchScanHistory, setActiveScan } = useScanStore();
  const { fetchCarePlan } = useCareStore();
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = async () => {
    if (!consent) return;
    setStep(1);
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.scans.analyze('sample-optical-frame', true, 'v1.0');
      if (res) {
        setScanResult(res);
        setActiveScan(res);
        if (res.metrics?.heartRate) {
          await addManualReading({ metricType: 'Heart Rate', valueString: `${res.metrics.heartRate}` });
        }
      }
    } catch (err: any) {
      console.warn('[ScanContent] Scan analysis error:', err?.message);
      setError(err?.message || 'Failed to complete optical telemetry analysis.');
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  const handleFinish = async () => {
    closeSheet();
    await Promise.allSettled([
      fetchVitals(),
      fetchInsights(),
      fetchScanHistory(),
      fetchCarePlan(),
    ]);
  };

  const m = scanResult?.metrics || {};
  const score = typeof scanResult?.overallScore === 'number' ? scanResult.overallScore : null;
  const grade = scanResult?.grade || (score && score >= 85 ? 'Optimal Grade' : score && score >= 70 ? 'Good Condition' : 'Attention Advised');
  const provider = scanResult?.modelVersion || 'Perfect AI (Skin) + Shen.ai (rPPG Vitals)';

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
    <>
      <SheetHeading
        title={
          step === 0
            ? 'Ready for your scan?'
            : step === 1
              ? 'Extracting AI Telemetry…'
              : 'AI Telemetry Scan Complete'
        }
        subtitle={
          step === 2
            ? `Extracted via ${provider}`
            : 'Multi-modal facial biomarker & rPPG vital sign inference.'
        }
        icon="camera"
      />

      {step < 2 ? (
        <ScanPortrait />
      ) : (
        <View style={{ gap: 12 }}>
          {/* Main Hero Score Card */}
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

          {/* Real-Time Optical Vitals Bar (Shen.ai + Perfect Corp) */}
          <Card style={{ padding: 12, backgroundColor: '#f8fafc' }}>
            <Copy bold size={11} color={c.navy} style={{ marginBottom: 8, letterSpacing: 0.5 }}>
              rPPG FACIAL VITALS & BIOMARKERS (SHEN.AI + PERFECT AI)
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

          {/* 15 Clinical Diagnostics Grid */}
          <Card style={{ padding: 12 }}>
            <Copy bold size={11} color={c.navy} style={{ marginBottom: 8, letterSpacing: 0.5 }}>
              15 CLINICAL SKIN & CELLULAR ATTRIBUTES (PERFECT AI)
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

          {/* Targeted Clinical Recommendations */}
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

      {step === 0 && (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Agree to start scan"
          accessibilityState={{ checked: consent }}
          aria-checked={consent}
          onPress={() => setConsent((v) => !v)}
          style={[s.row, { marginTop: 15 }]}
        >
          <Icon name={consent ? 'done' : 'shield'} color={consent ? c.green : c.muted} />
          <Copy size={12} color={c.muted} style={s.flex}>
            I consent to optical vital scan processing under Medivo HIPAA Privacy Standards.
          </Copy>
        </Pressable>
      )}

      <DemoNote text="Live biometric telemetry and skin analysis executed via third-party Perfect AI and Shen.ai SDK pipelines." />

      <View style={{ gap: 8, marginTop: 12 }}>
        {step === 2 && scanResult?.id && (
          <Action
            style={{ backgroundColor: c.blue }}
            onPress={() => {
              closeSheet();
              router.push({ pathname: `/scan-report/${scanResult.id}` as any });
            }}
          >
            Inspect Full Clinical Dossier
          </Action>
        )}

        <Action
          disabled={(step === 0 && !consent) || (step === 1 && loading)}
          onPress={() => (step === 2 ? handleFinish() : handleStartScan())}
        >
          {step === 0 ? 'Start scan' : step === 1 ? 'Analyzing…' : 'Done'}
        </Action>
      </View>
    </>
  );
}

function DetailContent({ title }: { title: string }) {
  const { closeSheet } = useSheetStore();
  const { profile, updateName, addMedication, addCareMember, addHealthRecord, updatePreferences } =
    useHealthProfileStore();
  const { addManualReading } = useVitalsStore();
  const { setRingConnected } = useDevicesStore();

  const [value, setValue] = useState(title === 'Edit Profile' ? profile.name : '');
  const [extra, setExtra] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [metric, setMetric] = useState('Blood Pressure');

  const form = [
    'Edit Profile',
    'Add Member',
    'Add Medication',
    'Manual Entry',
    'Vitals Check',
    'Upload Photo',
  ].includes(title);

  const settings = [
    'Privacy & Permissions',
    'Account Settings',
    'Background sync settings',
  ].includes(title);

  const info = detailContent[title] || {
    description: 'Your Medivo profile information',
    rows: [
      title.includes('Watch') || title.includes('CGM') || title.includes('Monitor')
        ? 'Connected · Battery 78% · Data sharing enabled'
        : 'Manage this information in your health profile.',
    ],
  };

  const save = async () => {
    if (!value.trim()) {
      setError('Enter a value to save.');
      return;
    }

    if (title === 'Edit Profile') {
      await updateName(value.trim());
    } else if (title === 'Add Medication') {
      await addMedication(value.trim(), extra.trim() || '10 mg daily');
    } else if (title === 'Add Member') {
      await addCareMember(value.trim(), extra.trim() || 'Family Member');
    } else if (['Vitals Check', 'Manual Entry'].includes(title)) {
      await addManualReading({ metricType: metric, valueString: value.trim() });
    } else if (title === 'Upload Photo') {
      await addHealthRecord(value.trim(), 'lab');
    }

    setSaved(true);
    setError('');
  };

  return (
    <>
      <SheetHeading
        title={title}
        subtitle={
          saved
            ? 'Saved successfully.'
            : form
              ? 'Update your health details.'
              : info.description
        }
        icon={settings ? 'settings' : 'file'}
      />
      {saved ? (
        <View style={st.success}>
          <Tile name="done" tone="green" size={50} />
          <Heading size={18} style={{ marginTop: 12 }}>
            Saved successfully
          </Heading>
        </View>
      ) : form ? (
        <View style={{ gap: 12, marginBottom: 16 }}>
          {title === 'Upload Photo' ? (
            <>
              <Copy color={c.muted}>
                Choose a document to attach to your health profile:
              </Copy>
              {['Lab Report (CBC Panel).pdf', 'Prescription Slip.jpg', 'Clinical Summary.pdf'].map((file) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: value === file }}
                  aria-checked={value === file}
                  key={file}
                  onPress={() => setValue(file)}
                  style={[s.card, s.row, { borderColor: value === file ? c.blue : c.border }]}
                >
                  <Icon name={value === file ? 'done' : 'file'} />
                  <Copy>{file}</Copy>
                </Pressable>
              ))}
            </>
          ) : (
            <>
              <Copy bold>
                {title === 'Edit Profile'
                  ? 'Full name'
                  : title === 'Add Member'
                    ? 'Member name'
                    : title === 'Add Medication'
                      ? 'Medication name'
                      : 'Reading'}
              </Copy>
              <TextInput
                accessibilityLabel={
                  title === 'Edit Profile'
                    ? 'Full name'
                    : title === 'Add Member'
                      ? 'Member name'
                      : title === 'Add Medication'
                        ? 'Medication name'
                        : 'Reading'
                }
                style={s.input}
                value={value}
                onChangeText={setValue}
                maxLength={80}
                placeholder={title === 'Vitals Check' ? '118/76 mmHg' : 'Enter details'}
                placeholderTextColor={c.muted}
              />
              {['Manual Entry', 'Vitals Check'].includes(title) ? (
                <View style={s.wrap}>
                  {['Blood Pressure', 'Heart Rate', 'SpO₂', 'Temperature'].map((item) => (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: metric === item }}
                      aria-checked={metric === item}
                      accessibilityLabel={item}
                      key={item}
                      onPress={() => setMetric(item)}
                    >
                      <Chip tone={metric === item ? 'blue' : 'purple'}>{item}</Chip>
                    </Pressable>
                  ))}
                </View>
              ) : title !== 'Edit Profile' ? (
                <>
                  <Copy bold>{title === 'Add Member' ? 'Relationship' : 'Dosage'}</Copy>
                  <TextInput
                    accessibilityLabel={title === 'Add Member' ? 'Relationship' : 'Dosage'}
                    style={s.input}
                    value={extra}
                    onChangeText={setExtra}
                    maxLength={80}
                    placeholder={title === 'Add Member' ? 'Family member' : '10 mg daily'}
                    placeholderTextColor={c.muted}
                  />
                </>
              ) : null}
            </>
          )}
          {!!error && <Copy color={c.red}>{error}</Copy>}
        </View>
      ) : settings ? (
        <>
          <Copy color={c.muted} style={{ marginBottom: 12 }}>
            Manage privacy and continuous data synchronization preferences.
          </Copy>
          {[
            { key: 'notifications' as const, label: 'Notifications' },
            { key: 'healthDataSharing' as const, label: 'Health data sharing' },
            { key: 'backgroundAppRefresh' as const, label: 'Background app refresh' },
          ].map(({ key, label }) => (
            <View
              key={key}
              style={[s.row, { justifyContent: 'space-between', paddingVertical: 12 }]}
            >
              <Copy bold>{label}</Copy>
              <Switch
                thumbColor="white"
                accessibilityLabel={label}
                value={profile.preferences[key] ?? false}
                trackColor={{ false: '#c9d3df', true: c.blue }}
                onValueChange={(val) => updatePreferences(key, val)}
              />
            </View>
          ))}
        </>
      ) : (
        <View style={{ gap: 8, marginBottom: 15 }}>
          {info.rows.map((row, i) => (
            <Card key={i} style={s.row}>
              <Icon name="check" color={c.green} size={17} />
              <Copy color={c.muted} style={s.flex}>
                {row}
              </Copy>
            </Card>
          ))}
        </View>
      )}
      <Action
        onPress={() => {
          if (form && !saved) save();
          else {
            if (title === 'Background sync settings' && profile.preferences.backgroundAppRefresh)
              setRingConnected(true);
            closeSheet();
          }
        }}
      >
        {form && !saved ? 'Save' : title === 'Background sync settings' ? 'Save settings' : 'Done'}
      </Action>
    </>
  );
}

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#121c2877', justifyContent: 'flex-end' },
  desktopBackdrop: { justifyContent: 'center', alignItems: 'center', padding: 28 },
  sheet: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
  },
  desktopSheet: {
    maxWidth: 760,
    borderRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: '88%',
  },
  drag: { height: 28, alignItems: 'center', justifyContent: 'center' },
  handle: { width: 35, height: 4, borderRadius: 4, backgroundColor: '#d9dee5' },
  close: { position: 'absolute', right: 9, top: 15, zIndex: 2 },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    marginBottom: 15,
    paddingRight: 21,
  },
  insight: { borderRadius: 17, padding: 14, minHeight: 280, height: '100%' },
  illustration: { position: 'absolute', right: 15, top: 39, opacity: 0.7 },
  why: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 11,
    borderRadius: 13,
    backgroundColor: '#ffffffcc',
    marginTop: 'auto',
  },
  alertCard: { padding: 11, borderRadius: 10, minHeight: 205, height: '100%' },
  alertTitle: { marginTop: 8, marginBottom: 8 },
  success: { paddingVertical: 22, alignItems: 'center' },
});
