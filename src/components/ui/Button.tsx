import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'pill' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-[family-name:var(--font-syne)] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[#0a0a0a] text-white border-none hover:bg-[#333] active:scale-[0.97]':
              variant === 'primary',
            'bg-white text-[#0a0a0a] border-[1.5px] border-[#e8e8e8] hover:border-[#0a0a0a]':
              variant === 'outline',
            'bg-transparent text-[#0a0a0a] border-none hover:bg-[#f5f5f5]':
              variant === 'ghost',
            'rounded-full': variant === 'pill',
            'bg-[#ff4625] text-white border-none hover:bg-[#e03b1e]':
              variant === 'danger',
          },
          {
            'text-[9px] tracking-[0.06em] px-4 py-1.5 rounded-full': size === 'sm',
            'text-[11px] tracking-[0.06em] px-5 py-3 rounded-[13px]': size === 'md',
            'text-[12px] tracking-[0.06em] px-7 py-4 rounded-[13px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
