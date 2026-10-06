import type React from 'react';
import { useImperativeHandle, useRef } from 'react';
export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);
  useImperativeHandle(ref, () => innerRef.current!);
  return innerRef;
}
