import { useRef, useState } from 'react';
import { Button, Dots, Icon, IconTile } from '../components/UI';
import { WellnessIllustration } from '../components/Illustrations';
import { statusSlides } from '../data/mock';
export function Status({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  return (
    <div className="status-page">
      <div className="status-page-heading">
        <button className="icon-button" aria-label="Back to home" onClick={onDone}>
          <Icon name="back" size={25} />
        </button>
        <h1>Your Health Status</h1>
      </div>
      <div
        className="status-track"
        ref={track}
        onScroll={(e) =>
          setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
        }
      >
        {statusSlides.map((s, i) => (
          <article className="status-slide" key={s.title}>
            <span className="slide-number">{i + 1} / 4</span>
            <WellnessIllustration kind={s.art} />
            <h2>{s.title}</h2>
            <p className="status-description">{s.description}</p>
            {i < 3 ? (
              <div className="status-quote">
                <span>“</span>
                <p>{s.quote}</p>
              </div>
            ) : (
              <div className="status-habits">
                {[
                  ['moon', 'Keep your bedtime consistent'],
                  ['activity', 'Take a short walk today'],
                  ['calendar', 'Check in again tomorrow'],
                ].map(([icon, t]) => (
                  <div key={t}>
                    <IconTile name={icon} tone="green" />
                    <p>{t}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      <Dots count={4} index={index} onChange={go} />
      <Button onClick={() => (index === 3 ? onDone() : go(index + 1))}>
        {index === 3 ? 'Done' : 'Next'}
        <Icon name="arrow" size={24} />
      </Button>
      <div className="status-home-indicator" />
    </div>
  );
}
