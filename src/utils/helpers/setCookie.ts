import type { UseCookieOptions } from '@/hooks/useCookie/useCookie';

import { isClient } from './isClient';
import { stringifyCookieOptions } from './stringifyCookieOptions';

export const setCookie = (name: string, value: string, options?: UseCookieOptions) => {
  if (!isClient) return;

  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options
  };

  const expires = new Date(Date.now() + optionsWithDefaults.days * 864e5).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}${stringifyCookieOptions(optionsWithDefaults)}`;
};
