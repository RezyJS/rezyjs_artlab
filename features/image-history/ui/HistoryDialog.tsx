'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { Check, History } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { ActionHint } from '@/shared/ui/action-hint';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { historyLabel } from '../lib/history-label';

export function HistoryDialog({ file }: { file: FileElement }) {
  const { appearance, tr } = useAppearance();
  useSyncExternalStore(
    file.subscribe,
    file.getSnapshot,
    file.getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const currentButton = useRef<HTMLButtonElement>(null);
  const steps = open ? file.getHistory() : [];
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <ActionHint label={tr('Полная история', 'Full history')}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            disabled={file.isEmpty() || file.isProcessing}
            aria-label={tr('Полная история', 'Full history')}
          >
            <History />
            <span>{tr('История', 'History')}</span>
          </Button>
        </DialogTrigger>
      </ActionHint>
      <DialogContent
        className='editor-history-dialog'
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          currentButton.current?.focus();
        }}
        onKeyDownCapture={(event) => {
          if (
            (event.ctrlKey || event.metaKey) &&
            ['z', 'y', 'x', 'm', '1', '2', '3'].includes(
              event.key.toLowerCase(),
            )
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{tr('История изменений', 'Edit history')}</DialogTitle>
        </DialogHeader>
        <ol className='editor-history-steps'>
          {steps.map((step) => (
            <li key={step.id}>
              <Button
                ref={step.current ? currentButton : undefined}
                variant='outline'
                className='editor-history-step'
                data-motion='none'
                aria-current={step.current ? 'step' : undefined}
                aria-disabled={step.current || undefined}
                disabled={file.isProcessing}
                onClick={async () => {
                  if (!step.current && (await file.goTo(step.index)))
                    setOpen(false);
                }}
              >
                {/* History previews decode only the small worker-generated thumbnail. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {step.thumbnailSrc ?
                  <img
                    src={step.thumbnailSrc}
                    alt=''
                    width={72}
                    height={54}
                    loading='lazy'
                  />
                : <span
                    className='editor-history-thumbnail-empty'
                    aria-hidden='true'
                  />
                }
                <span className='editor-history-step-label'>
                  <small>{step.id}</small>
                  {historyLabel(step, appearance.locale)}
                </span>
                {step.current && (
                  <Check aria-label={tr('Текущий шаг', 'Current step')} />
                )}
              </Button>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
