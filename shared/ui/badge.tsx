import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium', {
  variants: { variant: {
    default: 'border-transparent bg-primary/15 text-primary',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'border-border text-foreground',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
  } },
  defaultVariants: { variant: 'default' },
});

export function Badge({ variant = 'default', className, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />;
}
