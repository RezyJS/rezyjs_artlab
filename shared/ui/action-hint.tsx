'use client';

import { cloneElement, useId, type ReactElement } from 'react';
import { Kbd } from './kbd';

/** Labels stay available on hover and keyboard focus, including icon controls. */
export function ActionHint({ label, shortcut, children }: { label: string; shortcut?: string; children: ReactElement<{ 'aria-describedby'?: string }> }) {
  const id = useId();
  return <div className="kit-action-hint">
    {cloneElement(children, { 'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' ') })}
    {shortcut && <Kbd className="kit-action-shortcut">{shortcut}</Kbd>}
    <div id={id} role="tooltip" className="kit-action-tooltip">{label}{shortcut && <span className="sr-only"> · {shortcut}</span>}</div>
  </div>;
}
