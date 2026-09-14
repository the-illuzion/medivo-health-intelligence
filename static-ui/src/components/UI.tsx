import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Battery,
  BedDouble,
  Bell,
  Brain,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Droplet,
  FileText,
  FlaskConical,
  Folder,
  Heart,
  HeartPulse,
  HelpCircle,
  Home,
  Image,
  Lightbulb,
  Link,
  List,
  LockKeyhole,
  MapPin,
  Moon,
  Pencil,
  Pill,
  Plus,
  PersonStanding,
  RefreshCw,
  Settings,
  ShieldCheck,
  Smartphone,
  Smile,
  Stethoscope,
  Sun,
  Target,
  Thermometer,
  TriangleAlert,
  Upload,
  User,
  Users,
  Utensils,
  Watch,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Page, Tone } from '../data/mock';
const icons: Record<string, LucideIcon> = {
  activity: PersonStanding,
  arrow: ArrowRight,
  back: ArrowLeft,
  up: ArrowUpRight,
  chart: BarChart3,
  battery: Battery,
  bed: BedDouble,
  bell: Bell,
  brain: Brain,
  calendar: CalendarDays,
  camera: Camera,
  check: Check,
  done: CheckCircle2,
  down: ChevronDown,
  chevron: ChevronRight,
  clock: Clock3,
  drop: Droplet,
  file: FileText,
  lab: FlaskConical,
  folder: Folder,
  heart: Heart,
  heartpulse: HeartPulse,
  help: HelpCircle,
  home: Home,
  image: Image,
  bulb: Lightbulb,
  link: Link,
  list: List,
  lock: LockKeyhole,
  pin: MapPin,
  moon: Moon,
  edit: Pencil,
  pill: Pill,
  plus: Plus,
  sync: RefreshCw,
  settings: Settings,
  shield: ShieldCheck,
  phone: Smartphone,
  smile: Smile,
  pressure: Stethoscope,
  sun: Sun,
  target: Target,
  temperature: Thermometer,
  alert: TriangleAlert,
  upload: Upload,
  user: User,
  users: Users,
  food: Utensils,
  watch: Watch,
  wifi: Wifi,
  close: X,
  zap: Zap,
};
export function Icon({
  name,
  size = 20,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  if (name === 'lungs')
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        {...props}
      >
        <path
          d="M10 4v8m4-8v8M9 8C6 5 2 12 2 18c0 3 6 2 8-1V9m5-1c3-3 7 4 7 10 0 3-6 2-8-1V9M12 2v8l-4 4m4-4 4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  const Component = icons[name] || FileText;
  return <Component size={size} strokeWidth={1.9} aria-hidden="true" {...props} />;
}
export function IconTile({
  name,
  tone = 'blue',
  small = false,
}: {
  name: string;
  tone?: Tone;
  small?: boolean;
}) {
  return (
    <span className={`icon-tile ${tone} ${small ? 'small' : ''}`}>
      <Icon name={name} />
    </span>
  );
}
export function Button({
  children,
  onClick,
  secondary = false,
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      className={`button ${secondary ? 'secondary' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Section({
  title,
  action,
  onAction,
  children,
  className = '',
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`section ${className}`}>
      <div className="section-heading">
        <h2>{title}</h2>
        {action && (
          <button className="text-button" onClick={onAction}>
            {action}
            <Icon name="chevron" size={15} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
export function PageHeading({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: () => void;
}) {
  return (
    <div className="page-heading">
      <div>
        {back && (
          <button className="icon-button" aria-label="Back" onClick={back}>
            <Icon name="back" />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
export function Chip({ children, tone = 'green' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`chip ${tone}`}>{children}</span>;
}
export function Ring({
  value = 85,
  small = false,
  percentage = false,
}: {
  value?: number;
  small?: boolean;
  percentage?: boolean;
}) {
  return (
    <div className={`score-ring ${small ? 'compact' : ''}`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" className="ring-track" />
        <circle
          cx="50"
          cy="50"
          r="42"
          className="ring-progress"
          strokeDasharray={`${value * 2.64} 264`}
        />
      </svg>
      <span>
        <b>
          {value}
          {percentage ? '%' : ''}
        </b>
        {!small && <small>/ 100</small>}
      </span>
    </div>
  );
}
export function Trend({ tone = 'blue', variant = 0 }: { tone?: Tone; variant?: number }) {
  const paths = [
    'M2 38 Q8 25 15 28 T27 24 T40 16 T53 20 T66 29 T80 27 T96 20 L108 8',
    'M2 32 Q10 22 17 27 T31 25 T42 31 T54 23 T65 24 T78 26 L95 21 L108 9',
    'M2 37 Q12 29 18 32 T32 24 T46 26 T58 20 T70 15 T85 21 T98 12 L108 10',
  ];
  return (
    <svg className={`trend ${tone}`} viewBox="0 0 112 48" aria-label="Recent trend">
      <path d={paths[variant % 3]} fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="108" cy={variant % 3 === 0 ? 8 : 10} r="2.5" fill="currentColor" />
    </svg>
  );
}
export function Avatar({ male = false }: { male?: boolean }) {
  return (
    <svg
      className="avatar"
      viewBox="0 0 80 80"
      role="img"
      aria-label={male ? 'Profile illustration' : 'Aanya profile illustration'}
    >
      <defs>
        <clipPath id={male ? 'male-clip' : 'female-clip'}>
          <circle cx="40" cy="40" r="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${male ? 'male-clip' : 'female-clip'})`}>
        <rect width="80" height="80" fill="#d9dce0" />
        <path
          d={male ? 'M20 42 Q11 7 40 6 Q70 5 60 45' : 'M15 72 L14 33 Q13 3 40 5 Q69 3 67 37 L70 78'}
          fill="#152d39"
        />
        <path d="M5 83 Q8 57 32 55 L48 55 Q73 57 76 83" fill="#172c34" />
        <path d="M32 49 L32 60 Q40 68 49 59 L48 47" fill="#e9ac86" />
        <ellipse cx="40" cy="33" rx="18" ry="23" fill="#f1bb97" />
        <path d="M21 29 Q19 8 40 9 Q60 8 60 28 Q46 27 39 17 Q34 26 21 29" fill="#142b37" />
        <path d="M29 35h4m14 0h4" stroke="#283844" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 44 Q40 49 46 44" fill="none" stroke="#bc705e" strokeWidth="2" />
        {male && (
          <path d="M23 40 Q24 57 40 57 Q56 54 58 40 Q51 49 40 49 Q29 47 23 40" fill="#243340" />
        )}
      </g>
    </svg>
  );
}
export function Header({ navigate, notify }: { navigate: (p: Page) => void; notify: () => void }) {
  return (
    <>
      <header className="app-header">
        <div className="brand">
          <span>medivo</span>
          <small>Health Intelligence for a Better You</small>
        </div>
        <button className="icon-button notification" aria-label="Notifications" onClick={notify}>
          <Icon name="bell" size={25} />
          <i>3</i>
        </button>
        <button
          className="avatar-button"
          aria-label="Open profile"
          onClick={() => navigate('profile')}
        >
          <Avatar />
        </button>
      </header>
    </>
  );
}
export function Navigation({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {(
        [
          { label: 'Home', page: 'home', icon: 'home' },
          { label: 'Insights', page: 'metrics', icon: 'chart' },
          { label: 'Scan', page: 'scan', icon: 'plus' },
          { label: 'Care', page: 'care', icon: 'heart' },
          { label: 'Profile', page: 'profile', icon: 'user' },
        ] as const
      ).map((item) => (
        <button
          key={item.page}
          className={`${page === item.page ? 'active' : ''} ${item.page === 'scan' ? 'scan-nav' : ''}`}
          aria-current={page === item.page ? 'page' : undefined}
          onClick={() => navigate(item.page)}
        >
          <span>
            <Icon name={item.icon} size={25} />
          </span>
          {item.label}
        </button>
      ))}
      <div className="home-indicator" />
    </nav>
  );
}
export function Row({
  icon,
  title,
  description,
  onClick,
  tone = 'blue',
  children,
}: {
  icon: string;
  title: string;
  description?: string;
  onClick?: () => void;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <button className="settings-row card" onClick={onClick}>
      <IconTile name={icon} tone={tone} />
      <span className="row-copy">
        <b>{title}</b>
        {description && <small>{description}</small>}
      </span>
      {children || <Icon name="chevron" size={16} />}
    </button>
  );
}
export function Carousel({
  children,
  index,
  onChange,
  label = 'Cards',
}: {
  children: ReactNode[];
  index: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const jump = (n: number) => {
    const el = ref.current;
    if (el)
      el.scrollTo({
        left: n * (el.children[0].getBoundingClientRect().width + 12),
        behavior: 'smooth',
      });
  };
  return (
    <>
      <div
        className="carousel"
        ref={ref}
        aria-label={label}
        onScroll={(e) => {
          const el = e.currentTarget;
          const width = el.children[0]?.getBoundingClientRect().width + 12;
          if (width) onChange(Math.round(el.scrollLeft / width));
        }}
      >
        {children.map((child, i) => (
          <div className="carousel-slide" key={i}>
            {child}
          </div>
        ))}
      </div>
      <Dots count={children.length} index={index} onChange={jump} />
    </>
  );
}
export function Dots({
  count,
  index,
  onChange,
}: {
  count: number;
  index: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="dots">
      {Array.from({ length: count }, (_, i) => (
        <button
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index ? 'step' : undefined}
          className={i === index ? 'selected' : ''}
          key={i}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}
export function Sheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button,input,select,textarea,[tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', handler);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sheet-drag"
          onTouchStart={(e) => setStart(e.touches[0].clientY)}
          onTouchEnd={(e) => {
            if (e.changedTouches[0].clientY - start > 65) onClose();
          }}
        >
          <span />
        </div>
        <button className="sheet-close icon-button" aria-label="Close" onClick={onClose}>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  );
}
