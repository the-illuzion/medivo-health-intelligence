import React from 'react';

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
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    error: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
    accent: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="mr-1 inline-flex items-center">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};

export default Badge;
