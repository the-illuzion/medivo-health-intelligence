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
import { usePreview } from '../PreviewContext';
import { insights } from '../data/mock';
import { detailContent } from '../data/details';
import { colors as c, tones, designRoutes } from '../tokens';
export function SheetHost() {
  const p = usePreview();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;
  const close = () => p.setSheet(null);
  const closeRef = useRef(close);
  closeRef.current = close;
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
      visible={!!p.sheet}
      transparent
      animationType="slide"
      onRequestClose={close}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[st.backdrop, desktop && st.desktopBackdrop]}
      >
        <Pressable
          accessibilityLabel="Dismiss sheet"
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          aria-modal
          onAccessibilityEscape={close}
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
            <IconButton name="close" label="Close sheet" onPress={close} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 6 }}
          >
            {p.sheet?.kind === 'insights' ? (
              <InsightsContent />
            ) : p.sheet?.kind === 'alert' ? (
              <AlertContent />
            ) : p.sheet?.kind === 'scan' ? (
              <ScanContent />
            ) : p.sheet?.kind === 'connection' ? (
              <>
                <View style={st.success}>
                  <Icon name="done" color={c.green} size={55} />
                  <Heading size={22} style={{ marginTop: 15 }}>
                    {p.sheet.title} connected
                  </Heading>
                  <Copy color={c.muted} style={{ marginTop: 10, textAlign: 'center' }}>
                    Your demo device is ready to sync heart rate, sleep and activity.
                  </Copy>
                  <DemoNote text="Simulated confirmation. No external service was contacted." />
                </View>
                <Action
                  onPress={() => {
                    close();
                    router.replace(designRoutes.devices);
                  }}
                >
                  View devices
                </Action>
              </>
            ) : p.sheet ? (
              <DetailContent key={p.sheet.title} title={p.sheet.title || 'Details'} />
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
  const p = usePreview();
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
      <Action onPress={() => p.setSheet(null)}>Got it</Action>
    </>
  );
}
function AlertContent() {
  const p = usePreview();
  const router = useRouter();
  return (
    <>
      <SheetHeading title="Resting Heart Rate is higher than usual" icon="up" tone="orange" />
      <View style={{ marginLeft: 58, marginBottom: 15 }}>
        <Chip tone="red" icon="alert">
          Needs attention
        </Chip>
        <Copy size={12} color={c.muted} style={{ marginTop: 8 }}>
          Your resting heart rate is 18% above your personal baseline for the past 3 days.
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
              Your resting heart rate is 18% above your baseline for the past 3 days.
            </Copy>
            <Copy bold size={12} style={{ marginTop: 15 }}>
              72 → 85 bpm
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
              This can be due to poor sleep, increased stress, illness (like a cold), or strenuous
              activity.
            </Copy>
          </View>,
          <View key="next" style={[st.alertCard, { backgroundColor: c.greenSoft }]}>
            <Tile name="done" tone="green" size={34} />
            <Heading size={13} style={st.alertTitle}>
              What to do now
            </Heading>
            {[
              'Recheck your vitals today',
              'Rest and stay hydrated',
              'If this continues or you have symptoms, contact your care team.',
            ].map((text) => (
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
          p.setSheet(null);
          router.push({ pathname: designRoutes.metric, params: { name: 'Heart Rate' } });
        }}
      >
        View details
      </Action>
      <DemoNote text="Illustrative alert only. This is not medical advice." />
    </>
  );
}
function ScanContent() {
  const p = usePreview();
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);
  return (
    <>
      <SheetHeading
        title={
          step === 0
            ? 'Ready for your scan?'
            : step === 1
              ? 'Analyzing your scan…'
              : 'Your scan is complete'
        }
        subtitle={
          step === 2 ? 'Your demo readings are ready.' : 'A quick check-in with your health.'
        }
        icon="camera"
      />
      {step < 2 ? (
        <ScanPortrait />
      ) : (
        <Card style={[s.center, { backgroundColor: c.greenSoft }]}>
          <Ring />
          <Heading size={24} style={{ color: c.green, marginTop: 8 }}>
            All good
          </Heading>
          <Copy style={s.top4}>Heart Rate 72 bpm · SpO₂ 98%</Copy>
        </Card>
      )}
      {step === 0 && (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Agree to simulated scan"
          accessibilityState={{ checked: consent }}
          aria-checked={consent}
          onPress={() => setConsent((v) => !v)}
          style={[s.row, { marginTop: 15 }]}
        >
          <Icon name={consent ? 'done' : 'shield'} color={consent ? c.green : c.muted} />
          <Copy size={12} color={c.muted} style={s.flex}>
            I agree to start a simulated scan. No camera or personal health data will be used.
          </Copy>
        </Pressable>
      )}
      <DemoNote text="Simulation only. This is not medical advice." />
      <Action
        style={{ marginTop: 12 }}
        disabled={(step === 0 && !consent) || step === 1}
        onPress={() => (step === 2 ? p.setSheet(null) : setStep(1))}
      >
        {step === 0 ? 'Start simulated scan' : step === 1 ? 'Analyzing…' : 'Done'}
      </Action>
    </>
  );
}
function DetailContent({ title }: { title: string }) {
  const p = usePreview();
  const [value, setValue] = useState(title === 'Edit Profile' ? p.profileName : '');
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
    description: 'Your Medivo demo information',
    rows: [
      title.includes('Watch') || title.includes('CGM') || title.includes('Monitor')
        ? 'Connected · Battery 78% · Data sharing enabled'
        : 'Manage this information in your demo profile.',
    ],
  };
  const save = () => {
    if (!value.trim()) {
      setError('Enter a value to save.');
      return;
    }
    p.saveEntry(
      title,
      form && ['Vitals Check', 'Manual Entry'].includes(title)
        ? `${metric}: ${value.trim()}`
        : extra.trim() && title !== 'Edit Profile'
          ? `${value.trim()} · ${extra.trim()}`
          : value.trim(),
    );
    setSaved(true);
    setError('');
  };
  return (
    <>
      <SheetHeading
        title={title}
        subtitle={
          saved
            ? 'Saved for this demo session.'
            : form
              ? 'Update your demo information.'
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
                Choose a sample file. No device files are accessed or uploaded.
              </Copy>
              {['Sample lab report.pdf', 'Sample health photo.jpg'].map((file) => (
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
                placeholder={title === 'Vitals Check' ? '118/76 mmHg' : 'Enter demo information'}
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
            These switches change demo preferences only. No device permissions or account settings
            are changed.
          </Copy>
          {(title === 'Background sync settings'
            ? ['Background app refresh']
            : ['Notifications', 'Health data sharing']
          ).map((key) => (
            <View
              key={key}
              style={[s.row, { justifyContent: 'space-between', paddingVertical: 12 }]}
            >
              <Copy bold>{key}</Copy>
              <Switch
                thumbColor="white"
                accessibilityLabel={key}
                value={p.preferences[key] ?? false}
                trackColor={{ false: '#c9d3df', true: c.blue }}
                onValueChange={(value) =>
                  p.setPreferences((current) => ({ ...current, [key]: value }))
                }
              />
            </View>
          ))}
        </>
      ) : (
        <View style={{ gap: 8, marginBottom: 15 }}>
          {[
            ...info.rows,
            ...(p.entries[title] || []),
            ...(title === 'Recent data sources' && p.recentSource !== 'Uploaded PDF'
              ? [p.recentSource]
              : []),
          ].map((row, i) => (
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
            if (title === 'Background sync settings' && p.preferences['Background app refresh'])
              p.setRingConnected(true);
            p.setSheet(null);
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
