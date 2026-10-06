'use client';

import type { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useAppearance } from './appearance-provider';

export function ParameterHelp({ label, children }: { label: string; children: ReactNode }) {
  const { tr } = useAppearance();
  return <Popover><PopoverTrigger asChild>
    <Button type="button" variant="ghost" size="icon" data-motion="none" className="kit-parameter-help" aria-label={tr('Подсказка: ', 'Help: ') + label}><CircleHelp /></Button>
  </PopoverTrigger><PopoverContent side="top" align="end" className="kit-parameter-popover"><p>{children}</p></PopoverContent></Popover>;
}
