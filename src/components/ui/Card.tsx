import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[10px] border border-[#ebebeb] bg-white overflow-hidden',
        hover &&
          'transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:border-[#ccc]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardThumbnail({
  className,
  style,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative w-full flex items-center justify-center overflow-hidden',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardInfo({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-3 py-2.5 border-t border-[rgba(0,0,0,0.04)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
