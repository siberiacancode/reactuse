import React from 'react';

import {
  getCookie,
  isClient,
  removeCookie as removeItem,
  setCookie as setItem
} from '@/utils/helpers';
import type { UseCookieOptions } from '@/utils/helpers/cookie/stringifyCookieOptions';

export interface UseCookieReturn {
  value?: string;
  set: (value: string, options?: UseCookieOptions) => void;
  remove: () => void;
}

/**
 * @name useCookie
 * @description - Hook that returns the current value of a cookie, a callback to update the cookie and a callback to delete the cookie.
 *
 * @param {string} key The name of the cookie
 * @param {string} [initialValue=''] The initial cookie value
 * @returns {UseCookieReturn} An object containing the current value and functions to interact with the cookie
 *
 * @example
 * const { value, set, remove } = useCounter('my-cookie');
 */

export const useCookie = (key: string, initialValue?: string): UseCookieReturn => {
  const [value, setValue] = React.useState<string | undefined>(
    isClient ? () => getCookie(key, initialValue) : undefined
  );

  const remove = () => {
    setValue(undefined);
    removeItem(key);
  };

  const set = (value: string, options?: UseCookieOptions) => {
    setValue(value);
    setItem(key, value, options);
  };

  return { value, set, remove };
};
