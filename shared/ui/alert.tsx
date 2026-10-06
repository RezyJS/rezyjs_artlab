import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export function Alert({ className, variant = 'default', ...props }: HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }) {
  return <div data-slot="alert" data-variant={variant} role="alert" className={cn('relative rounded-lg border p-4 text-sm leading-relaxed', variant === 'destructive' && 'border-destructive/40 text-destructive', className)} {...props} />;
}
