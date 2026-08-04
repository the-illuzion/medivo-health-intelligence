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
  const variantStyles = {
    primary: 'bg-brand-primary active:bg-emerald-600',
    secondary: 'bg-surface-elevated border border-[#2A4A43] active:bg-[#1C3833]',
    outline: 'bg-transparent border border-brand-primary active:bg-brand-primary/10',
    ghost: 'bg-transparent active:bg-surface-elevated',
    danger: 'bg-red-500/20 border border-red-500/30 active:bg-red-500/30',
  };

  const textStyles = {
    primary: 'text-surface font-extrabold',
    secondary: 'text-white font-bold',
    outline: 'text-brand-primary font-bold',
    ghost: 'text-brand-primary font-medium',
    danger: 'text-red-400 font-bold',
  };

  const sizeStyles = {
    sm: 'py-2 px-3 rounded-xl text-xs',
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
        <ActivityIndicator size="small" color={variant === 'primary' ? '#0D1F1C' : '#10B981'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textStyles[variant]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
