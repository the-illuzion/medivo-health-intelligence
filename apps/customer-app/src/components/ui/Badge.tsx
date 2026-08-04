import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'success',
  size = 'sm',
  icon,
}) => {
  const variantStyles = {
    success: 'bg-success/10 text-success-light border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    error: 'bg-error/10 text-error-light border-error/30',
    accent: 'bg-accent/10 text-accent-light border-accent/30',
    neutral: 'bg-surface-elevated text-ink-soft border-[#2A4A43]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <View className={`flex-row items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {icon && <View className="mr-1">{icon}</View>}
      <Text className={`font-semibold ${variantStyles[variant].split(' ')[1]}`}>{label}</Text>
    </View>
  );
};
