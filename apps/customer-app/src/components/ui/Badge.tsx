import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'success',
  size = 'sm',
  icon,
  className = '',
}) => {
  const containerStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    warning: 'bg-amber-500/10 border-amber-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    accent: 'bg-sky-500/10 border-sky-500/30',
    neutral: 'bg-slate-100 dark:bg-[#1F2937] border-slate-200 dark:border-[#374151]',
  };

  const textStyles = {
    success: 'text-emerald-700 dark:text-emerald-400 font-bold',
    warning: 'text-amber-700 dark:text-amber-400 font-bold',
    error: 'text-red-700 dark:text-red-400 font-bold',
    accent: 'text-sky-700 dark:text-sky-400 font-bold',
    neutral: 'text-slate-700 dark:text-slate-300 font-bold',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm',
  };

  return (
    <View className={`flex-row items-center rounded-full border ${containerStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <View className="mr-1">{icon}</View>}
      <Text className={textStyles[variant]}>{label}</Text>
    </View>
  );
};
