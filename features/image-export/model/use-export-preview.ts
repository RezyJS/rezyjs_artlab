'use client';

import { useEffect, useRef, useState } from 'react';
import { exportImage, type ImageFormat } from '@/shared/lib/image-processing';

type Prepared = { image: HTMLImageElement; format: ImageFormat; quality: number; attempt: number; blob?: Blob; error?: string };

/** Coalesce slider changes and keep at most one encoding request in flight. */
export function useExportPreview(image: HTMLImageElement | null, enabled: boolean, format: ImageFormat, quality: number) {
  const [result, setResult] = useState<Prepared | null>(null);
  const [attempt, setAttempt] = useState(0);
  const pending = useRef<Promise<Blob> | null>(null);
  useEffect(() => {
    if (!enabled || !image) return;
    let active = true;
    const prepare = async () => {
      if (pending.current) await pending.current.catch(() => {});
      if (!active) return;
      const task = exportImage(image, format, quality);
      pending.current = task;
      try {
        const blob = await task;
        if (active) setResult({ image, format, quality, attempt, blob });
      } catch (error) {
        if (active) setResult({ image, format, quality, attempt, error: String(error) });
      } finally { if (pending.current === task) pending.current = null; }
    };
    const timer = window.setTimeout(() => { void prepare(); }, 350);
    return () => { active = false; window.clearTimeout(timer); };
  }, [image, enabled, format, quality, attempt]);
  const current = enabled && result?.image === image && result.format === format && result.quality === quality && result.attempt === attempt ? result : null;
  return { blob: current?.blob ?? null, error: current?.error, retry: () => setAttempt(value => value + 1) };
}
