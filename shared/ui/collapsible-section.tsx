'use client';

import { useId, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Kbd } from './kbd';

export function CollapsibleSection({ title, open, onToggle, disabled, shortcut, children, className = '' }: {
  title: string; open: boolean; onToggle: () => void; disabled?: boolean; shortcut?: string; children: ReactNode; className?: string;
}) {
  const id = useId();
  return <section className={'kit-collapsible ' + className} data-open={open}>
    <button type="button" className="kit-collapsible-trigger" aria-expanded={open} aria-controls={id} disabled={disabled} onClick={onToggle}>
      <span>{title}</span><div>{shortcut && <Kbd>{shortcut}</Kbd>}<ChevronDown size={14} /></div>
    </button>
    <div id={id} className="kit-collapsible-content" inert={!open}><div>{children}</div></div>
  </section>;
}
