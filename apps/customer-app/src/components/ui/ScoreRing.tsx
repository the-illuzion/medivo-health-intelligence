import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  maxScore = 100,
  size = 140,
  strokeWidth = 12,
  label = 'Skin Index',
  sublabel = 'Optimal',
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center my-2">
      <View style={{ width: size, height: size }} className="items-center justify-center relative">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#34D399" />
              <Stop offset="100%" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          {/* Track Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#162E29"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        {/* Center Content */}
        <View className="absolute items-center justify-center">
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            {score}
          </Text>
          <Text className="text-success-light text-xs font-bold uppercase tracking-wider mt-0.5">
            {sublabel}
          </Text>
        </View>
      </View>
      {label && <Text className="text-ink-soft text-xs font-semibold mt-2">{label}</Text>}
    </View>
  );
};
