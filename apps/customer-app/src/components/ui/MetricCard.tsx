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
      className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-[#374151] flex-1 min-w-[150px] justify-between shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold">{title}</Text>
        </View>
        <Text
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {change}
        </Text>
      </View>

      <View className="flex-row items-end justify-between mt-1">
        <Text className="text-slate-900 dark:text-white text-2xl font-extrabold">
          {value}
          <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal">{unit}</Text>
        </Text>

        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={pathD}
            fill="none"
            stroke={isPositive ? '#1F7FC4' : '#EF4444'}
            strokeWidth="2.5"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};
