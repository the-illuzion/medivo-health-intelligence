import { useState } from 'react';
import { Chip, Icon, IconTile, PageHeading, Ring, Section, Trend } from '../components/UI';
import { metrics } from '../data/mock';
export function Metrics({ openSheet }: { openSheet: (s: string) => void }) {
  const [period, setPeriod] = useState('Day');
  const n = period === 'Day' ? 0 : period === 'Week' ? 1 : 2;
  const values = [
    ['76', '118/76', '98', '7h 24m', '8,421', '36.8', 'Low'],
    ['74', '119/77', '98', '7h 12m', '8,320', '36.6', 'Low'],
    ['72', '120/78', '97', '7h 02m', '7,984', '36.7', 'Moderate'],
  ];
  return (
    <>
      <PageHeading title="Key Metrics" subtitle="Track vital signs, trends, and what changed." />
      <div className="segmented" role="tablist" aria-label="Metric period">
        {['Day', 'Week', 'Month'].map((p) => (
          <button
            role="tab"
            aria-selected={p === period}
            key={p}
            className={p === period ? 'selected' : ''}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="metric-summary card">
        <Ring value={[78, 82, 85][n]} small />
        <div>
          <b>Health Score</b>
          <small className="muted">
            <span className="positive">▲</span> Up {6 + n} pts from{' '}
            {n === 0 ? 'yesterday' : n === 1 ? 'last week' : 'last month'}
          </small>
        </div>
        <button onClick={() => openSheet('alert')}>
          <IconTile name="alert" tone="orange" />
          <span>
            <b>2 items to watch</b>
            <small>See details</small>
          </span>
          <Icon name="chevron" size={14} />
        </button>
      </div>
      <div className="metric-list">
        {metrics.map((m, i) => (
          <button
            className="metric-row card"
            key={m.name}
            onClick={() => openSheet(`metric:${m.name}`)}
          >
            <IconTile name={m.icon} tone={m.tone} />
            <span className="metric-main">
              <b>{m.name}</b>
              <strong>
                {values[n][i]} <span>{m.unit}</span>
              </strong>
            </span>
            <span className="metric-comparison">
              <b className={i === 0 ? 'negative' : 'positive'}>
                {i === 0 ? ['+8% above', '+5% above', 'Within'][n] : m.change}
              </b>
              <small>your usual range</small>
            </span>
            <Trend tone={m.tone} variant={i + n} />
            <Icon name="chevron" size={15} />
          </button>
        ))}
      </div>
      <Section
        title={`What changed this ${period === 'Day' ? 'month' : period.toLowerCase()}`}
        className="card change-summary"
      >
        <div className="two-columns">
          <div>
            <IconTile name="up" tone="green" />
            <div>
              <small>Biggest improvement</small>
              <h3>Activity</h3>
              <p>
                28% higher than your baseline. You took an average of 1,841 more steps per day this
                month.
              </p>
            </div>
          </div>
          <div>
            <IconTile name="down" tone="red" />
            <div>
              <small>Biggest decline</small>
              <h3>Heart Rate</h3>
              <p>
                8% lower than your baseline. Your average resting heart rate decreased from 74 to 68
                bpm.
              </p>
            </div>
          </div>
        </div>
      </Section>
      <div className="demo-caption">Illustrative trends · Not medical advice</div>
    </>
  );
}
