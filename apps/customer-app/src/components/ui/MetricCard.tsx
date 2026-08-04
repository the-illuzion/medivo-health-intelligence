import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositive?: boolean;
  sparklineData?: number[];
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '%',
  change = '+3%',
  isPositive = true,
  sparklineData = [70, 75, 72, 80, 85, 87],
  icon,
  onPress,
}) => {
  // Sparkline path generator
  const width = 80;
  const height = 28;
  const minY = Math.min(...sparklineData);
  const maxY = Math.max(...sparklineData);
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * width;
    const y = height - ((val - minY) / (maxY - minY || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="bg-surface-elevated p-4 rounded-2xl border border-[#2A4A43] flex-1 min-w-[150px] justify-between"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="text-ink-soft text-xs font-semibold">{title}</Text>
        </View>
        <Text
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-success/10 text-success-light' : 'bg-error/10 text-error-light'
          }`}
        >
          {change}
        </Text>
      </View>

      <View className="flex-row items-end justify-between mt-1">
        <Text className="text-white text-2xl font-extrabold">
          {value}
          <Text className="text-ink-soft text-sm font-normal">{unit}</Text>
        </Text>

        {/* Mini Sparkline Chart */}
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={pathD}
            fill="none"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth="2.5"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};
