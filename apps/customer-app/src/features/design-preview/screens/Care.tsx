import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Screen, useCompact } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  Heading,
  Icon,
  IconButton,
  Ring,
  Tile,
  s,
} from '../components/UI';
import { colors as c } from '../tokens';
import { useCareStore, type CareTask } from '../../../store/useCareStore';

const PERIODS = ['Morning', 'Afternoon', 'Evening'] as const;

export default function Care() {
  const {
    carePlan,
    selectedDate,
    shiftDate,
    toggleTask,
    markAllCompleted,
    collapsedPeriods,
    togglePeriodCollapse,
    fetchCarePlan,
    isLoading,
    error,
  } = useCareStore();

  const compact = useCompact();
  const narrow = useWindowDimensions().width < 370 || compact;
  const [dateExpanded, setDateExpanded] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    void fetchCarePlan(selectedDate);
  }, [selectedDate, fetchCarePlan]);

  const groups = useMemo(
    () =>
      PERIODS.map((period) => ({
        period,
        tasks: carePlan.tasks.filter((task) => task.period === period),
      })),
    [carePlan.tasks],
  );

  const total = carePlan.totalTasksCount || carePlan.tasks.length;
  const completed =
    carePlan.completedTasksCount || carePlan.tasks.filter((task) => task.status === 'Completed').length;
  const next = carePlan.nextTask || carePlan.tasks.find((task) => task.status !== 'Completed') || null;
  const adherence = total ? Math.round((completed / total) * 100) : 0;
  const selectedDateLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const handleToggleTask = async (task: CareTask) => {
    setUpdatingTaskId(task.id);
    try {
      await toggleTask(task.id);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleMarkAll = async () => {
    if (!total || completed === total) return;
    setMarkingAll(true);
    try {
      await markAllCompleted();
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <Screen>
      <View style={[s.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
        <Heading size={25}>Care Plan</Heading>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change care plan date"
          accessibilityState={{ expanded: dateExpanded }}
          onPress={() => setDateExpanded((value) => !value)}
        >
          <Copy size={10} color={c.muted}>
            {selectedDateLabel}
          </Copy>
        </Pressable>
      </View>
      <Copy color={c.muted} style={{ marginVertical: 5 }}>
        Your plan for today and what’s coming next.
      </Copy>

      {dateExpanded ? (
        <Card style={[s.row, { marginTop: 8, paddingVertical: 8 }]}>
          <IconButton label="Previous day" name="back" onPress={() => shiftDate(-1)} />
          <Copy bold size={10} style={[s.flex, { textAlign: 'center' }]}>
            {selectedDateLabel}
          </Copy>
          <IconButton label="Next day" name="arrow" onPress={() => shiftDate(1)} />
        </Card>
      ) : null}

      {error ? (
        <Card style={{ backgroundColor: c.redSoft, borderColor: c.red, marginTop: 8 }}>
          <Copy bold size={11} color={c.red}>
            Care plan update failed
          </Copy>
          <Copy size={10} color={c.muted} style={s.top4}>
            {error}
          </Copy>
          <Action secondary style={{ marginTop: 8 }} onPress={() => void fetchCarePlan(selectedDate)}>
            Retry
          </Action>
        </Card>
      ) : null}

      {isLoading && carePlan.tasks.length === 0 ? (
        <View style={{ paddingVertical: 36, alignItems: 'center' }}>
          <ActivityIndicator />
          <Copy size={10} color={c.muted} style={s.top4}>
            Loading your care plan…
          </Copy>
        </View>
      ) : (
        <>
          <Card style={[st.summary, { marginVertical: 18 }]}>
            <View style={[st.summaryCompletion, narrow && st.summaryFull]}>
              <Ring value={adherence} percent size={narrow ? 54 : 40} />
              <View style={s.flex}>
                <Copy size={9} bold>
                  Adherence
                </Copy>
                <Copy size={9} color={c.muted}>
                  {completed} of {total} tasks completed
                </Copy>
              </View>
            </View>
            <View style={st.summaryItem}>
              <Copy size={9} bold>
                Next task
              </Copy>
              <Copy bold size={11} color={next ? c.blue : c.green}>
                {next?.name || (total ? 'All done' : 'No tasks')}
              </Copy>
              <Copy size={9} color={c.muted}>
                {next?.time || ' '}
              </Copy>
            </View>
            <View style={st.summaryItem}>
              <Copy size={9} bold>
                Routine source
              </Copy>
              <Copy bold size={11} color={c.green}>
                Medivo
              </Copy>
              <Copy size={9} color={c.muted}>
                {carePlan.planTitle || 'Active care plan'}
              </Copy>
            </View>
          </Card>

          {groups.map(({ period, tasks }) => {
            const hidden = collapsedPeriods.includes(period);
            const periodCompleted = tasks.filter((task) => task.status === 'Completed').length;
            const isEvening = period === 'Evening';
            const title =
              period === 'Morning'
                ? 'Morning Care Plan'
                : period === 'Afternoon'
                  ? 'Afternoon Care Plan'
                  : 'Evening Care Plan';

            return (
              <View key={period} style={{ marginBottom: 14 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${period} tasks`}
                  accessibilityState={{ expanded: !hidden }}
                  aria-expanded={!hidden}
                  onPress={() => togglePeriodCollapse(period)}
                  style={[s.row, { marginBottom: 8 }]}
                >
                  <Tile
                    name={isEvening ? 'moon' : 'sun'}
                    tone={isEvening ? 'purple' : period === 'Afternoon' ? 'orange' : 'blue'}
                    size={39}
                  />
                  <View style={s.flex}>
                    <Heading size={16}>{title}</Heading>
                    <Copy size={10} color={c.muted}>
                      {period} · {tasks.length ? `${tasks.length} tasks` : 'No tasks scheduled'}
                    </Copy>
                  </View>
                  <Copy size={9} color={c.muted}>
                    {periodCompleted} of {tasks.length} completed
                  </Copy>
                  <Icon name="down" size={15} />
                </Pressable>

                {!hidden && tasks.length === 0 ? (
                  <Card style={{ padding: 12 }}>
                    <Copy size={10} color={c.muted}>
                      No {period.toLowerCase()} tasks scheduled. Your plan adapts automatically as health readings are logged.
                    </Copy>
                  </Card>
                ) : null}

                {!hidden &&
                  tasks.map((task, index) => (
                    <View key={task.id} style={st.timelineRow}>
                      <Copy size={9} style={{ width: 26, textAlign: 'center' }}>
                        {index + 1}
                      </Copy>
                      <View style={st.markerColumn}>
                        {index < tasks.length - 1 && <View style={st.line} />}
                        <View
                          style={[
                            st.marker,
                            task.status === 'Completed' && {
                              backgroundColor: c.green,
                              borderColor: c.green,
                            },
                          ]}
                        >
                          {task.status === 'Completed' && <Icon name="check" size={9} color={c.white} />}
                        </View>
                      </View>
                      <Card
                        label={`${task.status === 'Completed' ? 'Undo completion of' : 'Complete'} ${task.name}`}
                        onPress={() => void handleToggleTask(task)}
                        style={[st.task, compact && { flexWrap: 'wrap' }]}
                      >
                        {updatingTaskId === task.id ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Tile
                            name={task.icon || (task.status === 'Completed' ? 'done' : 'clock')}
                            tone={task.status === 'Completed' ? 'green' : task.tone}
                            size={29}
                          />
                        )}
                        <View style={s.flex}>
                          <Copy size={11} bold>
                            {task.name}
                          </Copy>
                          <Copy size={9} color={c.muted}>
                            {task.description}
                          </Copy>
                          <Copy size={8} color={c.muted} style={s.top4}>
                            {task.time}
                          </Copy>
                        </View>
                        <Chip
                          tone={task.status === 'Completed' ? 'green' : task.status === 'Upcoming' ? 'orange' : 'blue'}
                          icon={task.status === 'Completed' ? 'check' : 'clock'}
                        >
                          {task.status}
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
              onPress={() => void handleMarkAll()}
              style={{ marginTop: 4 }}
            >
              {markingAll ? 'Updating…' : completed === total ? 'All tasks completed' : 'Mark all done'}
            </Action>
          ) : null}

          {carePlan.careTeamNotes.length > 0 ? (
            <Card style={{ marginTop: 12 }}>
              <View style={[s.row, { justifyContent: 'space-between' }]}>
                <Heading size={15}>Care team notes</Heading>
                <Copy size={9} color={c.blue}>
                  {carePlan.careTeamNotes.length} notes
                </Copy>
              </View>
              {carePlan.careTeamNotes.slice(0, 2).map((note, index) => (
                <View key={`${note.doctor}-${index}`} style={{ marginTop: 10 }}>
                  <Copy size={10} color={c.muted}>
                    {note.note}
                  </Copy>
                  <Copy size={9} color={c.muted} style={s.top4}>
                    — {note.doctor} · {note.date}
                  </Copy>
                </View>
              ))}
            </Card>
          ) : null}

          <Card style={[s.panel, s.row, { marginTop: 12 }]}> 
            <Tile name="info" tone="blue" />
            <View style={s.flex}>
              <Heading size={13}>{carePlan.whyItMatters.title || 'About this care plan'}</Heading>
              <Copy size={10} color={c.muted} style={s.top4}>
                {carePlan.whyItMatters.description ||
                  'Small daily steps make your plan easier to follow. Check off each task as you complete it to keep track of your progress.'}
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
  summaryCompletion: {
    flex: 1.4,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  summaryFull: {
    flexBasis: '100%',
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingBottom: 14,
  },
  summaryItem: { flex: 1, minWidth: 0, gap: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  markerColumn: {
    width: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
