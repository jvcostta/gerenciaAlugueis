import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const badgeColors: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-gray-100 text-gray-800'
};

const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const colorClasses = badgeColors[variant];
  
  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;