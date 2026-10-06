import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return <kbd data-slot="kbd" className={cn('kit-kbd', className)} {...props} />;
}
