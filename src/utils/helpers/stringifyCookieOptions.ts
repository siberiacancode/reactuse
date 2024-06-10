import type { UseCookieOptions } from '@/hooks/useCookie/useCookie';

export function stringifyCookieOptions(options: UseCookieOptions) {
  return Object.keys(options).reduce((acc, key) => {
    if (key === 'days') {
      return acc;
    }
    if (options[key] === false) {
      return acc;
    }
    if (options[key] === true) {
      return `${acc}; ${key}`;
    }
    return `${acc}; ${key}=${options[key]}`;
  }, '');
}
