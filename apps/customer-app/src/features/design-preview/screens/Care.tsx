import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { apiClient } from '@medivo/api-client';
import { Screen, useCompact } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  Ring,
  Tile,
  s,
} from '../components/UI';
import { colors as c } from '../tokens';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCareStore } from '../../../store/useCareStore';

interface RoutineStep {
  id: string;
  step?: number;
  title: string;
  desc: string;
  duration?: string;
  completed?: boolean;
}

interface Routine {
  id: string;
  name: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | string;
  duration?: string;
  completedCount?: number;
  totalSteps?: number;
  steps: RoutineStep[];
}

const PERIODS = ['Morning', 'Afternoon', 'Evening'] as const;

export default function Care() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const compact = useCompact();
  const narrow = useWindowDimensions().width < 370 || compact;
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const carePlan = useCareStore((state) => state.carePlan);
  const fetchCarePlan = useCareStore((state) => state.fetchCarePlan);
  const toggleCareTask = useCareStore((state) => state.toggleTask);
  const markAllCareCompleted = useCareStore((state) => state.markAllCompleted);

  const fetchRoutines = useCallback(async () => {
    if (!token) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    apiClient.setAuthToken(token);
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.routines.list();
      setRoutines((data || []) as Routine[]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to load your care routines.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isHydrated) return;
    void fetchRoutines();
    void fetchCarePlan();
  }, [fetchRoutines, fetchCarePlan, isHydrated]);

  const fallbackRoutines = useMemo<Routine[]>(
    () =>
      PERIODS.map((period) => {
        const tasks = carePlan.tasks.filter((task) => task.period === period);
        return {
          id: `care-${period.toLowerCase()}`,
          name: `${period} Care Plan`,
          timing: period,
          completedCount: tasks.filter((task) => task.status === 'Completed').length,
          totalSteps: tasks.length,
          steps: tasks.map((task, index) => ({
            id: task.id,
            step: index + 1,
            title: task.name,
            desc: task.description,
            duration: task.time,
            completed: task.status === 'Completed',
          })),
        };
      }).filter((routine) => routine.steps.length > 0),
    [carePlan.tasks],
  );

  const displayRoutines = routines.length > 0 ? routines : fallbackRoutines;
  const usingCarePlanFallback = routines.length === 0 && fallbackRoutines.length > 0;

  const allSteps = useMemo(
    () =>
      displayRoutines.flatMap((routine) =>
        routine.steps.map((step) => ({ ...step, routineId: routine.id })),
      ),
    [displayRoutines],
  );
  const completed = allSteps.filter((step) => step.completed).length;
  const total = allSteps.length;
  const next = allSteps.find((step) => !step.completed);

  const toggleStep = async (routineId: string, stepId: string, completedNow: boolean) => {
    setTogglingStepId(stepId);
    setError(null);

    if (routineId.startsWith('care-')) {
      try {
        await toggleCareTask(stepId);
      } finally {
        setTogglingStepId(null);
      }
      return;
    }

    if (!token) {
      setTogglingStepId(null);
      return;
    }

    const nextCompleted = !completedNow;
    setRoutines((current) =>
      current.map((routine) => {
        if (routine.id !== routineId) return routine;
        const steps = routine.steps.map((step) =>
          step.id === stepId ? { ...step, completed: nextCompleted } : step,
        );
        return {
          ...routine,
          steps,
          completedCount: steps.filter((step) => step.completed).length,
          totalSteps: steps.length,
        };
      }),
    );

    try {
      const updated = await apiClient.routines.toggleStep(routineId, stepId, nextCompleted);
      if (updated) {
        setRoutines((current) =>
          current.map((routine) => (routine.id === routineId ? (updated as Routine) : routine)),
        );
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to update this task.');
      await fetchRoutines();
    } finally {
      setTogglingStepId(null);
    }
  };

  const markAllDone = async () => {
    if (total === 0 || completed === total) return;
    setMarkingAll(true);
    setError(null);

    try {
      if (usingCarePlanFallback) {
        await markAllCareCompleted();
        return;
      }

      if (!token) return;
      for (const routine of routines) {
        for (const step of routine.steps) {
          if (!step.completed) {
            await apiClient.routines.toggleStep(routine.id, step.id, true);
          }
        }
      }
      await fetchRoutines();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to complete all tasks.');
      if (!usingCarePlanFallback) await fetchRoutines();
    } finally {
      setMarkingAll(false);
    }
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <Screen>
      <View style={[s.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
        <Heading size={25}>Care Plan</Heading>
        <Copy size={10} color={c.muted}>{today}</Copy>
      </View>
      <Copy color={c.muted} style={{ marginVertical: 5 }}>
        Your plan for today and what’s coming next.
      </Copy>

      {error && displayRoutines.length === 0 ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginTop: 8 }}>
          <Copy bold size={11} color={c.red}>Care plan update failed</Copy>
          <Copy size={10} color={c.muted} style={s.top4}>{error}</Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void fetchRoutines()}>Retry</Action>
        </Card>
      ) : null}

      {loading && displayRoutines.length === 0 ? (
        <View style={{ paddingVertical: 36, alignItems: 'center' }}>
          <ActivityIndicator />
          <Copy size={10} color={c.muted} style={s.top4}>Loading your routines…</Copy>
        </View>
      ) : (
        <>
          <Card style={[st.summary, { marginVertical: 18 }]}>
            <View style={[st.summaryCompletion, narrow && st.summaryFull]}>
              <Ring value={total ? Math.round((completed / total) * 100) : 0} percent size={narrow ? 54 : 40} />
              <View style={s.flex}>
                <Copy size={9} bold>Adherence</Copy>
                <Copy size={9} color={c.muted}>{completed} of {total} tasks completed</Copy>
              </View>
            </View>
            <View style={st.summaryItem}>
              <Copy size={9} bold>Next task</Copy>
              <Copy bold size={11} color={next ? c.blue : c.green}>
                {next?.title || (total ? 'All done' : 'No tasks')}
              </Copy>
              <Copy size={9} color={c.muted}>{next?.duration || ' '}</Copy>
            </View>
            <View style={st.summaryItem}>
              <Copy size={9} bold>Routine source</Copy>
              <Copy bold size={11} color={c.green}>Medivo</Copy>
              <Copy size={9} color={c.muted}>{displayRoutines.length} active {displayRoutines.length === 1 ? 'routine' : 'routines'}</Copy>
            </View>
          </Card>

          {displayRoutines.length === 0 ? (
            <Card>
              <Copy color={c.muted}>No care routines are currently available for your account.</Copy>
            </Card>
          ) : null}

          {displayRoutines.map((routine) => {
            const hidden = collapsed.includes(routine.id);
            const routineCompleted = routine.steps.filter((step) => step.completed).length;
            const isEvening = routine.timing === 'Evening';
            return (
              <View key={routine.id} style={{ marginBottom: 14 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${routine.name} tasks`}
                  accessibilityState={{ expanded: !hidden }}
                  aria-expanded={!hidden}
                  onPress={() =>
                    setCollapsed((current) =>
                      hidden ? current.filter((id) => id !== routine.id) : [...current, routine.id],
                    )
                  }
                  style={[s.row, { marginBottom: 8 }]}
                >
                  <Tile name={isEvening ? 'moon' : 'sun'} tone={isEvening ? 'purple' : 'blue'} size={39} />
                  <View style={s.flex}>
                    <Heading size={16}>{routine.name}</Heading>
                    <Copy size={10} color={c.muted}>
                      {routine.timing}{routine.duration ? ` · ${routine.duration}` : ''}
                    </Copy>
                  </View>
                  <Copy size={9} color={c.muted}>{routineCompleted} of {routine.steps.length} completed</Copy>
                  <Icon name="down" size={15} />
                </Pressable>

                {!hidden && routine.steps.map((step, index) => (
                  <View key={step.id} style={st.timelineRow}>
                    <Copy size={9} style={{ width: 26, textAlign: 'center' }}>{step.step ?? index + 1}</Copy>
                    <View style={st.markerColumn}>
                      {index < routine.steps.length - 1 && <View style={st.line} />}
                      <View
                        style={[
                          st.marker,
                          step.completed && { backgroundColor: c.green, borderColor: c.green },
                        ]}
                      >
                        {step.completed && <Icon name="check" size={9} color={c.white} />}
                      </View>
                    </View>
                    <Card
                      label={`${step.completed ? 'Undo completion of' : 'Complete'} ${step.title}`}
                      onPress={() => void toggleStep(routine.id, step.id, Boolean(step.completed))}
                      style={[st.task, compact && { flexWrap: 'wrap' }]}
                    >
                      {togglingStepId === step.id ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <Tile name={step.completed ? 'done' : 'clock'} tone={step.completed ? 'green' : 'blue'} size={29} />
                      )}
                      <View style={s.flex}>
                        <Copy size={11} bold>{step.title}</Copy>
                        <Copy size={9} color={c.muted}>{step.desc}</Copy>
                        {step.duration ? <Copy size={8} color={c.muted} style={s.top4}>{step.duration}</Copy> : null}
                      </View>
                      <Chip tone={step.completed ? 'green' : 'blue'} icon={step.completed ? 'check' : 'clock'}>
                        {step.completed ? 'Completed' : 'Pending'}
                      </Chip>
                    </Card>
                  </View>
                ))}
              </View>
            );
          })}

          {total > 0 ? (
            <Action
              disabled={completed === total || markingAll}
              onPress={() => void markAllDone()}
              style={{ marginTop: 4 }}
            >
              {markingAll ? 'Updating…' : completed === total ? 'All tasks completed' : 'Mark all done'}
            </Action>
          ) : null}

          <Card style={[s.panel, s.row, { marginTop: 12 }]}> 
            <Tile name="info" tone="blue" />
            <View style={s.flex}>
              <Heading size={13}>About this care plan</Heading>
              <Copy size={10} color={c.muted} style={s.top4}>
                Small daily steps make your plan easier to follow. Check off each task as you complete it to keep track of your progress.
              </Copy>
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCompletion: { flex: 1.4, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 7 },
  summaryFull: { flexBasis: '100%', borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 14 },
  summaryItem: { flex: 1, minWidth: 0, gap: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  markerColumn: { width: 12, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  line: { position: 'absolute', top: '50%', bottom: -30, width: 1, backgroundColor: '#d4dfeb' },
  marker: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: c.blue,
    backgroundColor: c.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    minHeight: 64,
    borderRadius: 16,
  },
});