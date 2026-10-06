'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useInteractionLock } from './interaction-lock';

export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const locked = useInteractionLock();
    return (
      <div className="relative w-full">
        <select ref={ref} data-slot="native-select" className={cn('h-9 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)} {...props} disabled={locked || props.disabled}>
          {children}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  },
);
NativeSelect.displayName = 'NativeSelect';
