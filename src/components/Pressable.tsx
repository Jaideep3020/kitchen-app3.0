import React, { forwardRef } from 'react';
import { triggerHaptic } from '../lib/haptics';

export interface PressableProps extends React.HTMLAttributes<HTMLElement> {
  glowColor?: 'emerald' | 'rose' | 'amber' | 'blue' | 'teal' | 'gray' | 'indigo' | 'white' | 'none';
  as?: 'button' | 'div';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Pressable = forwardRef<HTMLElement, PressableProps>(
  ({ children, className = '', glowColor = 'emerald', onPointerDown, as = 'button', type = 'button', disabled = false, ...props }, ref) => {
    const glowClasses = {
      emerald: 'active:shadow-[0_0_20px_4px_rgba(16,185,129,0.4)]',
      rose: 'active:shadow-[0_0_20px_4px_rgba(244,63,94,0.4)]',
      amber: 'active:shadow-[0_0_20px_4px_rgba(245,158,11,0.4)]',
      blue: 'active:shadow-[0_0_20px_4px_rgba(59,130,246,0.4)]',
      teal: 'active:shadow-[0_0_20px_4px_rgba(20,184,166,0.4)]',
      indigo: 'active:shadow-[0_0_20px_4px_rgba(99,102,241,0.4)]',
      gray: 'active:shadow-[0_0_20px_4px_rgba(156,163,175,0.4)]',
      white: 'active:shadow-[0_0_20px_4px_rgba(255,255,255,0.4)]',
      none: ''
    };

    const Component = as as any;

    const finalClassName = `${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.95] cursor-pointer'} transition-all duration-150 ease-out touch-manipulation ${disabled ? '' : (glowClasses[glowColor] || glowClasses.emerald)} ${className}`;

    return (
      <Component
        ref={ref}
        type={as === 'button' ? type : undefined}
        disabled={as === 'button' ? disabled : undefined}
        onPointerDown={(e: any) => {
          if (!disabled) triggerHaptic('light');
          if (onPointerDown) onPointerDown(e);
        }}
        className={finalClassName}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Pressable.displayName = 'Pressable';
