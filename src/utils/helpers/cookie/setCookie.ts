import type { UseCookieOptions } from './stringifyCookieOptions';
import { stringifyCookieOptions } from './stringifyCookieOptions';

const DEFAULT_OPTIONS = {
  days: 7,
  path: '/'
};

export const setCookie = (name: string, value: string, options?: UseCookieOptions) => {
  const optionsWithDefaults = { ...DEFAULT_OPTIONS, ...options };

  const expires = new Date(Date.now() + optionsWithDefaults.days * 864e5).toUTCString();

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}${stringifyCookieOptions(optionsWithDefaults)}`;
};
