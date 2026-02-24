import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function Avatar({ src, name, size = 'md', color = '#0a0a0a', className }: AvatarProps) {
  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-[13px]',
    lg: 'w-12 h-12 text-[18px]',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center flex-shrink-0',
        'font-[family-name:var(--font-syne)] font-extrabold text-white',
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
