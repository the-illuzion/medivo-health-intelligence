import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { ChartDataPoint } from './AreaChart';

export interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
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
  const maxY = Math.max(...yValues, 10);

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barWidth = Math.min(24, chartWidth / (data.length * 1.5 || 1));

  return (
    <View className="bg-surface-elevated rounded-2xl p-4 my-2 border border-[#2A4A43]">
      {title && (
        <Text className="text-white font-semibold text-base mb-2">{title}</Text>
      )}
      <View className="items-center">
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#2A4A43" strokeWidth="1" />

          {data.map((item, index) => {
            const x = paddingLeft + (index + 0.5) * (chartWidth / data.length) - barWidth / 2;
            const barH = (item.y / maxY) * chartHeight;
            const y = height - paddingBottom - barH;

            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={color}
                  rx="4"
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 5}
                  fill="#64748B"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {String(item.x)}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};
