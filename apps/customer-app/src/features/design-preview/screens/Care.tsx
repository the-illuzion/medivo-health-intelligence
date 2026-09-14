import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Screen, useCompact } from '../components/Shell';
import {
  Action,
  Card,
  Chip,
  Copy,
  DemoNote,
  Heading,
  Icon,
  IconButton,
  PageHeading,
  Ring,
  Section,
  TextAction,
  Tile,
  s,
} from '../components/UI';
import { Avatar } from '../components/Illustrations';
import { usePreview } from '../PreviewContext';
import { colors as c } from '../tokens';
export default function Care() {
  const p = usePreview();
  const [dateExpanded, setDateExpanded] = useState(false);
  const completed = p.tasks.filter((t) => t.status === 'Completed').length;
  const next = p.tasks.find((t) => t.status !== 'Completed');
  const large = useCompact();
  const shiftDate = (delta: number) => {
    const d = new Date(`${p.careDate}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + delta);
    p.setCareDate(d.toISOString().slice(0, 10));
  };
  return (
    <Screen>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <Heading size={25}>Care Plan</Heading>
        <TextAction onPress={() => setDateExpanded((v) => !v)} label="Choose care plan date">
          ▣ {p.careDate} ⌄
        </TextAction>
      </View>
      <Copy color={c.muted} style={{ marginVertical: 5 }}>
        Your plan for today and what’s coming next.
      </Copy>
      {dateExpanded && (
        <Card style={s.row}>
          <IconButton label="Previous day" name="back" onPress={() => shiftDate(-1)} />
          <Copy style={s.flex}>{p.careDate}</Copy>
          <IconButton label="Next day" name="arrow" onPress={() => shiftDate(1)} />
          <TextAction onPress={() => setDateExpanded(false)}>Done</TextAction>
        </Card>
      )}
      <Card style={[s.grid3, { marginVertical: 12 }]}>
        <View style={[s.third, s.row, { gap: 5 }]}>
          <Ring value={Math.round((completed / p.tasks.length) * 100)} percent size={43} />
          <View style={s.flex}>
            <Copy size={9} bold>
              Adherence
            </Copy>
            <Copy size={9} color={c.muted}>
              {completed} of {p.tasks.length} tasks completed
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
            ☺ On track
          </Copy>
          <Copy size={9} color={c.muted}>
            Keep it up!
          </Copy>
        </View>
      </Card>
      {['Morning', 'Afternoon', 'Evening'].map((period, i) => {
        const items = p.tasks.filter((t) => t.period === period);
        const hidden = p.collapsed.includes(period);
        return (
          <View key={period} style={{ marginBottom: 14 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${period} tasks`}
              accessibilityState={{ expanded: !hidden }}
              aria-expanded={!hidden}
              onPress={() =>
                p.setCollapsed(
                  hidden ? p.collapsed.filter((t) => t !== period) : [...p.collapsed, period],
                )
              }
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
                    onPress={() => p.toggleTask(t.id)}
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
      <Section
        title="Care team notes"
        action="See all"
        onAction={() => p.openDetail('Care team notes')}
        style={s.card}
      >
        <View style={s.row}>
          <View style={[s.row, { gap: 0 }]}>
            <Avatar size={24} />
            <Avatar male size={24} />
            <Avatar size={24} />
          </View>
          <View style={s.flex}>
            <Copy size={10} color={c.muted}>
              You’re doing great! Your blood pressure has been steady this week. Keep up the good
              work.
            </Copy>
            <Copy size={9} color={c.muted} style={s.top4}>
              — Sarah Kim, NP · Apr 28, 2025
            </Copy>
          </View>
        </View>
      </Section>
      <Card onPress={() => p.openDetail('Why this matters')} style={[s.panel, s.row]}>
        <Tile name="bulb" />
        <View style={s.flex}>
          <Heading size={15}>Why this matters</Heading>
          <Copy size={11} color={c.muted} style={s.top4}>
            Today’s plan is based on your hypertension care plan and recent readings. These
            activities help keep your blood pressure stable, support your heart health, and track
            your progress.
          </Copy>
        </View>
        <Icon name="chevron" />
      </Card>
      <View style={[s.grid3, { marginTop: 12 }]}>
        <Action
          style={s.third}
          disabled={completed === p.tasks.length}
          onPress={() => p.setTasks(p.tasks.map((t) => ({ ...t, status: 'Completed' })))}
        >
          {completed === p.tasks.length ? 'All tasks completed' : 'Mark all done'}
        </Action>
        <Action style={s.third} secondary onPress={() => p.openDetail('Full care plan')}>
          View full care plan
        </Action>
      </View>
      <DemoNote text="Demo care plan. Tap a task to complete or undo. Dates use the same sample plan." />
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
});
