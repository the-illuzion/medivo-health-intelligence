import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface AreaChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  color?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  height = 220,
  color = '#1F7FC4',
}) => {
  const { isDark } = useTheme();

  const paddingLeft = 35;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;
  const width = 340;

  const yValues = data.map((d) => d.y);
  const minY = Math.min(...yValues) - 5;
  const maxY = Math.max(...yValues) + 5;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((item, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y = height - paddingBottom - ((item.y - minY) / (maxY - minY || 1)) * chartHeight;
    return { x, y, raw: item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]?.x || width} ${height - paddingBottom} L ${paddingLeft} ${height - paddingBottom} Z`;

  // Theme-aware colors
  const gridStroke = isDark ? '#374151' : '#CBD5E1';
  const dashedGridStroke = isDark ? '#1F2937' : '#E2E8F0';
  const labelColor = isDark ? '#94A3B8' : '#334155';
  const circleStroke = isDark ? '#111827' : '#FFFFFF';

  return (
    <View className="bg-slate-50 dark:bg-[#111827] rounded-3xl p-5 border border-slate-200 dark:border-[#374151] shadow-sm my-2">
      {title && (
        <Text className="text-slate-900 dark:text-white font-extrabold text-base mb-3">{title}</Text>
      )}
      <View className="items-center">
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.35 : 0.25} />
              <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke={gridStroke} strokeWidth="1.5" />
          <Line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} stroke={dashedGridStroke} strokeDasharray="4 4" strokeWidth="1" />

          {/* Area fill */}
          <Path d={areaD} fill="url(#areaGradient)" />

          {/* Stroke path */}
          <Path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points & Value Tooltips */}
          {points.map((pt, i) => (
            <React.Fragment key={i}>
              <Circle cx={pt.x} cy={pt.y} r="5" fill={color} stroke={circleStroke} strokeWidth="2.5" />
              <SvgText
                x={pt.x}
                y={height - 8}
                fill={labelColor}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                {String(pt.raw.x)}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </View>
    </View>
  );
};
