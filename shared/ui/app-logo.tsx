import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" width="48" height="48" fill="none" aria-hidden="true" {...props}>
    <circle cx="18" cy="18" r="15" fill="currentColor" opacity=".35" />
    <circle cx="31" cy="31" r="15" fill="currentColor" opacity=".9" />
  </svg>;
}
