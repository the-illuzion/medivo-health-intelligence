import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/useAuthStore';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  Section,
  Tile,
  s,
} from '../src/features/design-preview/components/UI';
import { colors as c } from '../src/features/design-preview/tokens';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, isLoading } = useAuthStore();
  const [selectedFocus, setSelectedFocus] = useState('Cardiovascular & Vitals');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Heart & Vitality',
    'Sleep Optimization',
    'Blood Pressure Control',
  ]);

  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 900;

  const focusAreas = [
    { title: 'Cardiovascular & Vitals', icon: 'heartpulse', tone: 'red' as const },
    { title: 'Sleep & Recovery', icon: 'moon', tone: 'blue' as const },
    { title: 'Activity & Movement', icon: 'activity', tone: 'green' as const },
    { title: 'Stress & Mental Health', icon: 'brain', tone: 'purple' as const },
  ];

  const goalsList = [
    'Heart & Vitality',
    'Sleep Optimization',
    'Blood Pressure Control',
    'Activity & Fitness',
    'Stress Reduction',
    'Daily Medication Adherence',
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = async () => {
    await completeOnboarding(selectedFocus, selectedGoals);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={st.safe}>
      <ScrollView
        contentContainerStyle={[st.scrollContent, desktop && st.desktopScroll]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[st.cardContainer, desktop && st.desktopCard]}>
          {/* Brand Header */}
          <View style={st.brandSection}>
            <View style={st.logoRow}>
              <Text style={st.logo}>medivo</Text>
              <Chip tone="green" icon="shield">
                AI Health Engine
              </Chip>
            </View>
            <Copy size={11} color={c.muted} style={s.top4}>
              Health Intelligence for a Better You
            </Copy>
          </View>

          {/* Intro */}
          <View style={st.headerSection}>
            <Heading size={24}>Personalize your health engine</Heading>
            <Copy size={13} color={c.muted} style={s.top4}>
              Tell us your health priorities so Medivo can calibrate your baseline biomarkers, telemetry thresholds, and care plan.
            </Copy>
          </View>

          {/* Section 1: Primary Focus Area */}
          <Section title="1. Primary Clinical Focus">
            <View style={st.grid2}>
              {focusAreas.map((area) => {
                const selected = selectedFocus === area.title;
                return (
                  <Pressable
                    key={area.title}
                    onPress={() => setSelectedFocus(area.title)}
                    style={[
                      st.focusCard,
                      selected && st.focusCardActive,
                    ]}
                  >
                    <Tile name={area.icon} tone={area.tone} size={30} />
                    <Copy bold size={11} color={selected ? c.blue : c.navy} style={{ marginTop: 6 }}>
                      {area.title}
                    </Copy>
                    {selected ? (
                      <View style={st.checkedIcon}>
                        <Icon name="done" size={16} color={c.blue} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Section>

          {/* Section 2: Health Goals */}
          <Section title="2. Select Personalized Health Goals" style={{ marginTop: 18 }}>
            <View style={{ gap: 8 }}>
              {goalsList.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <Pressable
                    key={goal}
                    onPress={() => toggleGoal(goal)}
                    style={[
                      st.goalRow,
                      isSelected && st.goalRowActive,
                    ]}
                  >
                    <Icon
                      name={isSelected ? 'done' : 'check'}
                      size={18}
                      color={isSelected ? c.blue : c.muted}
                    />
                    <Copy bold size={12} color={isSelected ? c.blue : c.navy} style={s.flex}>
                      {goal}
                    </Copy>
                    <Chip tone={isSelected ? 'blue' : 'green'}>
                      {isSelected ? 'Active' : 'Optional'}
                    </Chip>
                  </Pressable>
                );
              })}
            </View>
          </Section>

          {/* Submit Action */}
          <Action
            onPress={handleFinish}
            disabled={isLoading}
            style={st.finishButton}
          >
            {isLoading ? (
              <ActivityIndicator color={c.white} size="small" />
            ) : (
              <>
                <Copy size={14} bold color={c.white}>
                  Complete Profile & Enter Dashboard
                </Copy>
                <Icon name="arrow" size={18} color={c.white} />
              </>
            )}
          </Action>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#e9eef4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 28,
  },
  desktopScroll: {
    paddingVertical: 48,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: c.background,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: c.border,
  },
  desktopCard: {
    maxWidth: 520,
    padding: 32,
    backgroundColor: 'white',
    shadowColor: '#0c1935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  brandSection: {
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1.9,
    color: '#0d3447',
  },
  headerSection: {
    marginBottom: 16,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  focusCard: {
    width: '48.5%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    padding: 10,
    position: 'relative',
  },
  focusCardActive: {
    backgroundColor: c.blueSoft,
    borderColor: c.blue,
  },
  checkedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    padding: 10,
  },
  goalRowActive: {
    backgroundColor: c.blueSoft,
    borderColor: c.blue,
  },
  finishButton: {
    marginTop: 24,
    borderRadius: 12,
    minHeight: 46,
    backgroundColor: c.blue,
  },
});
