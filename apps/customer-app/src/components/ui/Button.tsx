import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  className = '',
}) => {
  // Theme-aware button variant background and border styles
  const variantStyles = {
    primary: 'bg-brand-primary active:bg-brand-hover border border-brand-primary shadow-sm',
    secondary: 'bg-slate-100 dark:bg-[#1F2937] border border-slate-300 dark:border-[#374151] active:bg-slate-200 dark:active:bg-slate-700 shadow-sm',
    outline: 'bg-transparent border border-brand-primary active:bg-brand-primary/10',
    ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-[#1F2937]',
    danger: 'bg-red-500/10 border border-red-500/30 active:bg-red-500/20',
  };

  // High-contrast text styles for both Light and Dark modes
  const textStyles = {
    primary: 'text-white font-extrabold',
    secondary: 'text-slate-900 dark:text-white font-bold',
    outline: 'text-brand-primary font-bold',
    ghost: 'text-brand-primary font-semibold',
    danger: 'text-red-600 dark:text-red-400 font-bold',
  };

  const sizeStyles = {
    sm: 'py-2 px-3.5 rounded-xl text-xs',
    md: 'py-3.5 px-5 rounded-2xl text-sm',
    lg: 'py-4 px-6 rounded-2xl text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : '#1F7FC4'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textStyles[variant]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
