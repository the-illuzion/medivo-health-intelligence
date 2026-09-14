import React, { useRef, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import {
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
  User,
  Users,
  Utensils,
  Watch,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors as c, tones, radius } from '../tokens';
import type { Tone } from '../data/mock';
const icons: Record<string, LucideIcon> = {
  back: ArrowLeft,
  arrow: ArrowRight,
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
  activity: PersonStanding,
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
  user: User,
  users: Users,
  food: Utensils,
  watch: Watch,
  close: X,
  zap: Zap,
};
export function Icon({
  name,
  size = 20,
  color = c.blue,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  if (name === 'lungs')
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M10 4v8m4-8v8M9 8C6 5 2 12 2 18c0 3 6 2 8-1V9m5-1c3-3 7 4 7 10 0 3-6 2-8-1V9M12 2v8l-4 4m4-4 4 4"
          stroke={color}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    );
  const Component = icons[name] || FileText;
  return <Component size={size} color={color} strokeWidth={1.9} />;
}
export function Copy({
  children,
  size = 12,
  bold = false,
  color = c.navy,
  style,
}: {
  children: ReactNode;
  size?: number;
  bold?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        { fontSize: size, lineHeight: size * 1.4, color, fontWeight: bold ? '600' : '400' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Heading({
  children,
  size = 18,
  style,
}: {
  children: ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[
        {
          fontSize: size,
          lineHeight: size * 1.25,
          fontWeight: '700',
          letterSpacing: -0.35,
          color: c.navy,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Card({
  children,
  style,
  onPress,
  label,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  label?: string;
}) {
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.card, style, pressed && s.pressed]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={[s.card, style]}>{children}</View>
  );
}
export function Action({
  children,
  onPress,
  secondary = false,
  disabled = false,
  style,
  label,
}: {
  children: ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        style,
        (pressed || disabled) && s.pressed,
      ]}
    >
      {typeof children === 'string' ? (
        <Copy size={14} bold color={secondary ? c.blue : c.white}>
          {children}
        </Copy>
      ) : (
        children
      )}
    </Pressable>
  );
}
export function TextAction({
  children,
  onPress,
  label,
}: {
  children: ReactNode;
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={s.textAction}
    >
      <Copy size={11} color={c.blue}>
        {children}
      </Copy>
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
}: {
  name: string;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={s.iconButton}
    >
      <Icon name={name} color={c.navy} />
    </Pressable>
  );
}
export function Tile({
  name,
  tone = 'blue',
  size = 36,
}: {
  name: string;
  tone?: Tone;
  size?: number;
}) {
  return (
    <View style={[s.tile, { width: size, height: size, backgroundColor: tones[tone].background }]}>
      <Icon name={name} size={size * 0.58} color={tones[tone].foreground} />
    </View>
  );
}
export function Chip({
  children,
  tone = 'green',
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: string;
}) {
  return (
    <View style={[s.chip, { backgroundColor: tones[tone].background }]}>
      {icon && <Icon name={icon} size={11} color={tones[tone].foreground} />}
      <Copy size={9} color={tones[tone].foreground}>
        {children}
      </Copy>
    </View>
  );
}
export function Section({
  title,
  action,
  onAction,
  children,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.section, style]}>
      <View style={s.sectionHeading}>
        <Heading size={16}>{title}</Heading>
        {action && onAction && <TextAction onPress={onAction}>{action} ›</TextAction>}
      </View>
      {children}
    </View>
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
    <View style={s.pageHeading}>
      <View style={s.row}>
        {back && <IconButton name="back" label="Back" onPress={back} />}
        {!!title && (
          <Heading size={25} style={s.flex}>
            {title}
          </Heading>
        )}
      </View>
      {subtitle && (
        <Copy size={13} color={c.muted} style={s.top4}>
          {subtitle}
        </Copy>
      )}
    </View>
  );
}
export function Ring({
  value = 85,
  size = 90,
  percent = false,
}: {
  value?: number;
  size?: number;
  percent?: boolean;
}) {
  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel={`Health score ${value}${percent ? ' percent' : ' out of 100'}`}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={42} fill="none" stroke="#dcefe6" strokeWidth={8} />
        <Circle
          cx={50}
          cy={50}
          r={42}
          fill="none"
          stroke="#26b46e"
          strokeWidth={8}
          strokeDasharray={`${Math.min(value, 100) * 2.64} 264`}
          strokeLinecap="round"
          rotation={-90}
          origin="50,50"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, s.center]}>
        <Copy size={size > 60 ? 30 : 14} bold>
          {value}
          {percent ? '%' : ''}
        </Copy>
        {size > 60 && !percent && (
          <Copy size={12} color={c.muted}>
            / 100
          </Copy>
        )}
      </View>
    </View>
  );
}
export function Trend({
  tone = 'blue',
  variant = 0,
  large = false,
}: {
  tone?: Tone;
  variant?: number;
  large?: boolean;
}) {
  const paths = [
    'M2 38 Q8 25 15 28 T27 24 T40 16 T53 20 T66 29 T80 27 T96 20 L108 8',
    'M2 32 Q10 22 17 27 T31 25 T42 31 T54 23 T65 24 T78 26 L95 21 L108 9',
    'M2 37 Q12 29 18 32 T32 24 T46 26 T58 20 T70 15 T85 21 T98 12 L108 10',
  ];
  return (
    <Svg
      width={large ? '100%' : 60}
      height={large ? 110 : 34}
      viewBox="0 0 112 48"
      accessibilityLabel="Illustrative trend"
    >
      <Path d={paths[variant % 3]} fill="none" stroke={tones[tone].foreground} strokeWidth={2} />
      <Circle cx={108} cy={variant % 3 === 0 ? 8 : 10} r={2.5} fill={tones[tone].foreground} />
    </Svg>
  );
}
export function Row({
  title,
  description,
  icon,
  tone = 'blue',
  onPress,
  children,
  compact = false,
}: {
  title: string;
  description?: string;
  icon: string;
  tone?: Tone;
  onPress: () => void;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <Card
      onPress={onPress}
      label={title}
      style={[s.row, s.settingsRow, compact && { padding: 8, gap: 7 }]}
    >
      <Tile name={icon} tone={tone} size={compact ? 29 : 36} />
      <View style={s.flex}>
        <Copy bold size={compact ? 10 : 12}>
          {title}
        </Copy>
        {description && (
          <Copy color={c.muted} size={compact ? 9 : 10} style={s.top4}>
            {description}
          </Copy>
        )}
      </View>
      {children || <Icon name="chevron" size={14} color={c.muted} />}
    </Card>
  );
}
export function DemoNote({
  text = 'Demo data only · Not your personal health readings.',
}: {
  text?: string;
}) {
  return (
    <Copy size={10} color={c.muted} style={s.demo}>
      {text}
    </Copy>
  );
}
export function Dots({
  count,
  index,
  onChange,
}: {
  count: number;
  index: number;
  onChange: (i: number) => void;
}) {
  return (
    <View style={s.dots} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, i) => (
        <Pressable
          key={i}
          accessibilityRole="tab"
          accessibilityLabel={`Go to slide ${i + 1}`}
          accessibilityState={{ selected: i === index }}
          aria-selected={i === index}
          onPress={() => onChange(i)}
          style={s.dotTouch}
        >
          <View style={[s.dot, { backgroundColor: i === index ? c.blue : '#d6deea' }]} />
        </Pressable>
      ))}
    </View>
  );
}
export function Carousel({
  children,
  fraction = 0.79,
  label = 'Carousel',
}: {
  children: ReactNode[];
  fraction?: number;
  label?: string;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [width, setWidth] = useState(Math.min(windowWidth, 430) - 36);
  const [index, setIndex] = useState(0);
  const ref = useRef<ScrollView>(null);
  const cardWidth = width * fraction;
  const step = cardWidth + 12;
  const update = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(
      Math.max(0, Math.min(children.length - 1, Math.round(e.nativeEvent.contentOffset.x / step))),
    );
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        ref={ref}
        accessibilityLabel={label}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        onScroll={update}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingRight: Math.max(0, width - cardWidth) }}
      >
        {children.map((child, i) => (
          <View
            key={i}
            style={{ width: cardWidth, marginRight: i === children.length - 1 ? 0 : 12 }}
          >
            {child}
          </View>
        ))}
      </ScrollView>
      <Dots
        count={children.length}
        index={index}
        onChange={(i) => {
          setIndex(i);
          ref.current?.scrollTo({ x: i * step, animated: true });
        }}
      />
    </View>
  );
}
export const s = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  center: { alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: radius.card,
    padding: 12,
  },
  pressed: { opacity: 0.65 },
  button: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: c.blue,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondary: { backgroundColor: c.white, borderWidth: 1, borderColor: c.blue },
  textAction: { minHeight: 32, justifyContent: 'center' },
  iconButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  tile: { borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chip: {
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },
  section: { marginTop: 15 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },
  pageHeading: { marginBottom: 14 },
  top4: { marginTop: 4 },
  settingsRow: { marginBottom: 7 },
  demo: { textAlign: 'center', marginTop: 12, lineHeight: 15 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  dotTouch: { width: 25, height: 28, alignItems: 'center', justifyContent: 'center' },
  dot: { height: 8, width: 8, borderRadius: 4 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  half: { width: '48.7%' },
  grid3: { flexDirection: 'row', gap: 7 },
  third: { flex: 1, minWidth: 0 },
  input: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 9,
    padding: 12,
    fontSize: 14,
    color: c.navy,
    backgroundColor: '#fbfdff',
  },
  panel: { backgroundColor: c.blueSoft, borderRadius: 14, padding: 12, marginTop: 10 },
});
