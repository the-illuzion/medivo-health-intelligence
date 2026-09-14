import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, useCompact, useDesktop } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  IconButton,
  Ring,
  Section,
  TextAction,
  Tile,
  s,
} from '../components/UI';
import { Avatar } from '../components/Illustrations';
import { useCareStore } from '../../../store/useCareStore';
import { useSheetStore } from '../../../store/useSheetStore';
import { colors as c } from '../tokens';

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
  } = useCareStore();
  const { openDetail } = useSheetStore();

  const [dateExpanded, setDateExpanded] = useState(false);
  const large = useCompact();
  const desktop = useDesktop();

  useEffect(() => {
    fetchCarePlan(selectedDate);
  }, [selectedDate]);

  const completed = carePlan.tasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = carePlan.tasks.length;
  const next = carePlan.tasks.find((t) => t.status !== 'Completed');

  const isToday = selectedDate === new Date().toISOString().slice(0, 10);
  const formattedDateLabel = isToday
    ? 'Today'
    : new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

  return (
    <Screen>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <Heading size={25}>Care Plan</Heading>
        <TextAction onPress={() => setDateExpanded((v) => !v)} label="Choose care plan date">
          ▣ {formattedDateLabel} ⌄
        </TextAction>
      </View>
      <Copy color={c.muted} style={{ marginVertical: 5 }}>
        Your personalized clinical plan for {formattedDateLabel.toLowerCase()} and upcoming activities.
      </Copy>
      {dateExpanded && (
        <Card style={[s.row, { marginVertical: 6 }]}>
          <IconButton label="Previous day" name="back" onPress={() => shiftDate(-1)} />
          <Copy bold style={[s.flex, { textAlign: 'center' }]}>
            {formattedDateLabel} ({selectedDate})
          </Copy>
          <IconButton label="Next day" name="arrow" onPress={() => shiftDate(1)} />
          <TextAction onPress={() => setDateExpanded(false)}>Done</TextAction>
        </Card>
      )}
      <Card style={[s.grid3, { marginVertical: 12 }]}>
        <View style={[s.third, s.row, { gap: 5 }]}>
          <Ring value={totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0} percent size={43} />
          <View style={s.flex}>
            <Copy size={9} bold>
              Adherence
            </Copy>
            <Copy size={9} color={c.muted}>
              {completed} of {totalTasks} tasks completed
            </Copy>
          </View>
        </View>
        <View style={[s.third, { gap: 4 }]}>
          <Copy size={9} bold>
            Next task
          </Copy>
          <Copy bold size={11} color={c.blue}>
            {next?.time || 'All done'}
          </Copy>
          <Copy size={9} color={c.muted}>
            {next?.name || 'Great work today!'}
          </Copy>
        </View>
        <View style={[s.third, { gap: 4 }]}>
          <Copy size={9} bold>
            Overall status
          </Copy>
          <Copy bold size={12} color={c.green}>
            ☺ {carePlan.overallStatus || 'On track'}
          </Copy>
          <Copy size={9} color={c.muted}>
            Keep it up!
          </Copy>
        </View>
      </Card>
      {(['Morning', 'Afternoon', 'Evening'] as const).map((period, i) => {
        const items = carePlan.tasks.filter((t) => t.period === period);
        const hidden = collapsedPeriods.includes(period);
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
                name={i === 2 ? 'moon' : 'sun'}
                tone={i === 0 ? 'blue' : i === 1 ? 'orange' : 'purple'}
                size={39}
              />
              <View style={s.flex}>
                <Heading size={16}>{period}</Heading>
                <Copy size={10} color={c.muted}>
                  {
                    ['Start your day well', 'Keep your momentum', 'Wind down for better tomorrows'][
                      i
                    ]
                  }
                </Copy>
              </View>
              <Copy size={9} color={c.muted}>
                {items.filter((t) => t.status === 'Completed').length} of {items.length} completed
              </Copy>
              <Icon name="down" size={15} />
            </Pressable>
            {!hidden &&
              items.map((t, j) => (
                <View key={t.id} style={st.timelineRow}>
                  <Copy size={9} style={{ width: 44, textAlign: 'center' }}>
                    {t.time}
                  </Copy>
                  <View style={st.markerColumn}>
                    {j < items.length - 1 && <View style={st.line} />}
                    <View
                      style={[
                        st.marker,
                        t.status === 'Completed' && {
                          backgroundColor: c.green,
                          borderColor: c.green,
                        },
                      ]}
                    >
                      {t.status === 'Completed' && <Icon name="check" size={9} color="white" />}
                    </View>
                  </View>
                  <Card
                    label={`${t.status === 'Completed' ? 'Undo completion of' : 'Complete'} ${t.name}`}
                    onPress={() => toggleTask(t.id)}
                    style={[st.task, large && { flexWrap: 'wrap' }]}
                  >
                    <Tile name={t.icon} tone={t.tone} size={29} />
                    <View style={s.flex}>
                      <Copy size={11} bold>
                        {t.name}
                      </Copy>
                      <Copy size={9} color={c.muted}>
                        {t.description}
                      </Copy>
                    </View>
                    <Chip
                      tone={
                        t.status === 'Completed'
                          ? 'green'
                          : t.status === 'Pending'
                            ? 'orange'
                            : 'blue'
                      }
                      icon={t.status === 'Completed' ? 'check' : 'clock'}
                    >
                      {t.status}
                    </Chip>
                  </Card>
                </View>
              ))}
          </View>
        );
      })}
      <View style={desktop ? st.desktopBottomGrid : undefined}>
        <Section
          title="Care team notes"
          action="See all"
          onAction={() => openDetail('Care team notes')}
          style={[s.card, desktop && st.desktopBottomCard]}
        >
          <View style={s.row}>
            <View style={[s.row, { gap: 0 }]}>
              <Avatar size={24} />
              <Avatar male size={24} />
              <Avatar size={24} />
            </View>
            <View style={s.flex}>
              <Copy size={10} color={c.muted}>
                {carePlan.careTeamNotes[0]?.note ||
                  'You’re doing great! Your blood pressure has been steady this week. Keep up the good work.'}
              </Copy>
              <Copy size={9} color={c.muted} style={s.top4}>
                — {carePlan.careTeamNotes[0]?.doctor || 'Sarah Kim, NP'} · {carePlan.careTeamNotes[0]?.date || 'Today'}
              </Copy>
            </View>
          </View>
        </Section>
        <Card
          onPress={() => openDetail('Why this matters')}
          style={[s.panel, s.row, desktop && st.desktopBottomCard]}
        >
          <Tile name="bulb" />
          <View style={s.flex}>
            <Heading size={15}>{carePlan.whyItMatters?.title || 'Why this matters'}</Heading>
            <Copy size={11} color={c.muted} style={s.top4}>
              {carePlan.whyItMatters?.description ||
                'Today’s plan is based on your hypertension care plan and recent readings. These activities help keep your blood pressure stable, support your heart health, and track your progress.'}
            </Copy>
          </View>
          <Icon name="chevron" />
        </Card>
      </View>
      <View style={[s.grid3, { marginTop: 12 }]}>
        <Action
          style={s.third}
          disabled={completed === totalTasks && totalTasks > 0}
          onPress={markAllCompleted}
        >
          {completed === totalTasks && totalTasks > 0 ? 'All tasks completed' : 'Mark all done'}
        </Action>
        <Action style={s.third} secondary onPress={() => openDetail('Full care plan')}>
          View full care plan
        </Action>
      </View>
      <DemoNote text="Interactive care plan. Tap a task to toggle completion. Synchronized with live health schedule." />
    </Screen>
  );
}

const st = StyleSheet.create({
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  markerColumn: { width: 12, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  line: { position: 'absolute', top: '50%', bottom: -30, width: 1, backgroundColor: '#d4dfeb' },
  marker: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: c.blue,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 7,
    borderRadius: 10,
  },
  desktopBottomGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  desktopBottomCard: {
    flex: 1,
    marginTop: 0,
  },
});
