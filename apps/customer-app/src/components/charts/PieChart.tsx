import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

export interface PieChartDataPoint {
  x: string;
  y: number;
}

export interface PieChartProps {
  data: PieChartDataPoint[];
  title?: string;
  height?: number;
  colorScale?: string[];
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 200,
  colorScale = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#818CF8'],
}) => {
  const width = 200;
  const radius = Math.min(width, height) / 2 - 10;
  const cx = width / 2;
  const cy = height / 2;

  const total = data.reduce((acc, d) => acc + d.y, 0) || 1;
  let accumulatedAngle = 0;

  const slices = data.map((item, index) => {
    const angle = (item.y / total) * 2 * Math.PI;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    return { d, color: colorScale[index % colorScale.length], label: item.x };
  });

  return (
    <View className="bg-surface-elevated rounded-2xl p-4 my-2 border border-[#2A4A43] items-center">
      {title && (
        <Text className="text-white font-semibold text-base mb-2 self-start">{title}</Text>
      )}
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G>
          {slices.map((slice, i) => (
            <Path key={i} d={slice.d} fill={slice.color} />
          ))}
        </G>
      </Svg>
    </View>
  );
};
