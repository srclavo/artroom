import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  textColor?: string;
  variant?: 'default' | 'outline' | 'status';
}

export function Badge({
  className,
  color,
  textColor,
  variant = 'default',
  children,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-[family-name:var(--font-syne)] text-[8px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full whitespace-nowrap',
        {
          'border border-[#e5e5e5]': variant === 'outline',
        },
        className
      )}
      style={{
        backgroundColor: variant === 'default' ? (color ?? '#f5f5f5') : undefined,
        color: textColor ?? '#0a0a0a',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
