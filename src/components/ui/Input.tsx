import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3.5 py-[11px] border-[1.5px] border-[#e8e8e8] rounded-[10px]',
            'font-[family-name:var(--font-dm-sans)] text-sm text-[#111]',
            'outline-none placeholder:text-[#ccc]',
            'focus:border-[#0a0a0a] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]',
            'transition-all duration-200',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
