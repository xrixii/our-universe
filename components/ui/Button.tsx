'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantBase: Record<ButtonVariant, string> = {
  primary:
    'bg-violet text-white border border-violet/40 shadow-[0_0_16px_2px_rgba(118,86,201,0.35)]',
  ghost:
    'bg-transparent text-white border border-white/20',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={
        disabled
          ? {}
          : variant === 'primary'
          ? { scale: 1.04, boxShadow: '0 0 28px 6px rgba(118,86,201,0.55)' }
          : { scale: 1.03, borderColor: 'rgba(248,247,255,0.5)' }
      }
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      disabled={disabled}
      onClick={onClick}
      className={[
        'rounded-full font-body font-medium tracking-wide cursor-pointer transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantBase[variant],
        className,
      ].join(' ')}
      {...(rest as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
