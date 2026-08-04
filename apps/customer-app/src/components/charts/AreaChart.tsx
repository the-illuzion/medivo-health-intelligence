import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';

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
  height = 200,
  color = '#10B981',
}) => {
  const paddingLeft = 35;
  const paddingBottom = 25;
  const paddingTop = 15;
  const paddingRight = 15;
  const width = 320;

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

  return (
    <View className="bg-surface-elevated rounded-2xl p-4 my-2 border border-[#2A4A43]">
      {title && (
        <Text className="text-white font-semibold text-base mb-2">{title}</Text>
      )}
      <View className="items-center">
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#2A4A43" strokeWidth="1" />
          <Line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} stroke="#1C3833" strokeDasharray="4 4" strokeWidth="1" />

          {/* Area fill */}
          <Path d={areaD} fill="url(#areaGradient)" />

          {/* Stroke path */}
          <Path d={pathD} fill="none" stroke={color} strokeWidth="3" />

          {/* Data Points */}
          {points.map((pt, i) => (
            <React.Fragment key={i}>
              <Circle cx={pt.x} cy={pt.y} r="4" fill={color} stroke="#0D1F1C" strokeWidth="2" />
              <SvgText
                x={pt.x}
                y={height - 5}
                fill="#64748B"
                fontSize="10"
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
