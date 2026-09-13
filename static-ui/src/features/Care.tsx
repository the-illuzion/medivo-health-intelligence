import { useState } from 'react';
import { Avatar, Button, Chip, Icon, IconTile, PageHeading, Ring, Section } from '../components/UI';
import { initialTasks } from '../data/mock';
export function Care({ openSheet }: { openSheet: (s: string) => void }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [date, setDate] = useState('2025-04-28');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const next = tasks.find((t) => t.status !== 'Completed');
  return (
    <>
      <div className="care-title">
        <PageHeading title="Care Plan" subtitle="Your plan for today and what’s coming next." />
        <label className="date-control">
          <Icon name="calendar" size={15} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Care plan date"
          />
        </label>
      </div>
      <div className="care-summary card">
        <div>
          <Ring value={Math.round((completed / tasks.length) * 100)} small percentage />
          <span>
            <b>Adherence</b>
            <small>
              {completed} of {tasks.length} tasks completed
            </small>
          </span>
        </div>
        <div>
          <IconTile name="clock" />
          <span>
            <b>Next task</b>
            <strong className="blue-text">{next?.time || 'All done'}</strong>
            <small>{next?.name || 'Great work today!'}</small>
          </span>
        </div>
        <div>
          <IconTile name="smile" tone="green" />
          <span>
            <b>Overall status</b>
            <strong className="positive">On track</strong>
            <small>Keep it up!</small>
          </span>
        </div>
      </div>
      {['Morning', 'Afternoon', 'Evening'].map((period, i) => {
        const list = tasks.filter((t) => t.period === period);
        const hidden = collapsed.includes(period);
        return (
          <section className="timeline-section" key={period}>
            <button
              className="timeline-heading"
              aria-expanded={!hidden}
              onClick={() =>
                setCollapsed(
                  hidden ? collapsed.filter((p) => p !== period) : [...collapsed, period],
                )
              }
            >
              <IconTile
                name={i === 2 ? 'moon' : 'sun'}
                tone={i === 0 ? 'blue' : i === 1 ? 'orange' : 'purple'}
              />
              <span>
                <h2>{period}</h2>
                <small>
                  {
                    ['Start your day well', 'Keep your momentum', 'Wind down for better tomorrows'][
                      i
                    ]
                  }
                </small>
              </span>
              <small>
                {list.filter((t) => t.status === 'Completed').length} of {list.length} completed
              </small>
              <Icon name="down" size={16} className={hidden ? '' : 'rotated'} />
            </button>
            {!hidden && (
              <div className="timeline">
                {list.map((task) => (
                  <div className="timeline-item" key={task.id}>
                    <time>{task.time}</time>
                    <span
                      className={`timeline-marker ${task.status === 'Completed' ? 'done' : ''}`}
                    >
                      {task.status === 'Completed' && <Icon name="check" size={11} />}
                    </span>
                    <button
                      className="card task-card"
                      aria-label={`${task.status === 'Completed' ? 'Undo completion of' : 'Complete'} ${task.name}`}
                      onClick={() =>
                        setTasks(
                          tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
                              : t,
                          ),
                        )
                      }
                    >
                      <IconTile name={task.icon} tone={task.tone} />
                      <span className="task-copy">
                        <b>{task.name}</b>
                        <small>{task.description}</small>
                      </span>
                      <Chip
                        tone={
                          task.status === 'Completed'
                            ? 'green'
                            : task.status === 'Pending'
                              ? 'orange'
                              : 'blue'
                        }
                      >
                        <Icon name={task.status === 'Completed' ? 'check' : 'clock'} size={11} />
                        {task.status}
                      </Chip>
                      <Icon name="chevron" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
      <Section
        title="Care team notes"
        action="See all"
        onAction={() => openSheet('Care team notes')}
        className="card team-notes"
      >
        <div className="team-note">
          <span className="avatar-stack">
            <Avatar />
            <Avatar male />
            <Avatar />
          </span>
          <p>
            You’re doing great! Your blood pressure has been steady this week. Keep up the good
            work.<small>— Sarah Kim, NP · Apr 28, 2025</small>
          </p>
        </div>
      </Section>
      <button className="why-banner" onClick={() => openSheet('Why this matters')}>
        <IconTile name="bulb" />
        <div>
          <h2>Why this matters</h2>
          <p>
            Today’s plan is based on your hypertension care plan and recent readings. These
            activities help keep your blood pressure stable, support your heart health, and track
            your progress.
          </p>
        </div>
        <Icon name="chevron" />
      </button>
      <div className="two-columns care-actions">
        <Button
          onClick={() => setTasks(tasks.map((t) => ({ ...t, status: 'Completed' })))}
          disabled={completed === tasks.length}
        >
          <Icon name="check" />
          {completed === tasks.length ? 'All tasks completed' : 'Mark all done'}
        </Button>
        <Button secondary onClick={() => openSheet('Full care plan')}>
          <Icon name="list" />
          View full care plan
        </Button>
      </div>
      <p className="demo-caption">Tap a task to mark it complete or undo. Demo care plan only.</p>
    </>
  );
}
