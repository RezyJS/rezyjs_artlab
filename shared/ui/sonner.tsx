'use client';

import { Toaster, toast, type ExternalToast } from 'sonner';
const toasterId = undefined;
export const notify = {
  success: (message: string, options?: ExternalToast) => toast.success(message, { ...options, toasterId }),
  error: (message: string, options?: ExternalToast) => toast.error(message, { ...options, toasterId }),
  info: (message: string, options?: ExternalToast) => toast.info(message, { ...options, toasterId }),
  loading: (message: string, options?: ExternalToast) => toast.loading(message, { ...options, toasterId }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};
export function ArtlabToaster({ theme, locale }: { theme: 'light' | 'dark'; locale: 'ru' | 'en' }) {
  return <Toaster theme={theme} position="bottom-right" mobileOffset={{ bottom: 'max(16px, env(safe-area-inset-bottom))', left: 12, right: 12 }} closeButton visibleToasts={3} toastOptions={{ className: 'kit-toast', closeButtonAriaLabel: locale === 'ru' ? 'Закрыть уведомление' : 'Dismiss notification' }} containerAriaLabel={locale === 'ru' ? 'Уведомления' : 'Notifications'} />;
}
