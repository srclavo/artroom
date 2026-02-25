import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: 'default' | 'search';
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, variant = 'default', error, leftIcon, rightIcon, ...props }, ref) => {
    const isSearch = variant === 'search';

    return (
      <div className="mb-3.5">
        {label && (
          <label
            htmlFor={id}
            className="block mb-1.5 font-[family-name:var(--font-syne)] text-[9px] font-bold uppercase tracking-[0.12em] text-[#bbb]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {(isSearch || leftIcon) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none">
              {leftIcon || <Search size={15} />}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full px-3.5 py-[11px] border-[1.5px] rounded-[10px]',
              'font-[family-name:var(--font-dm-sans)] text-sm text-[#111]',
              'outline-none placeholder:text-[#ccc]',
              'transition-all duration-200',
              error
                ? 'border-[#ff4625] focus:border-[#ff4625] focus:shadow-[0_0_0_3px_rgba(255,70,37,0.08)]'
                : 'border-[#e8e8e8] focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]',
              (isSearch || leftIcon) && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccc]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[11px] text-[#ff4625]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
