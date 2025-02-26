import { useEffect, useState } from 'react';

import type { RemoveCookieParams, SetCookieParams } from '../useCookie/helpers';

import { clearCookies, getCookies, removeCookie, setCookie } from '../useCookie/helpers';
import { COOKIE_EVENT, dispatchCookieEvent } from '../useCookie/useCookie';

const setCookieItem = (key: string, value: any, options?: SetCookieParams) => {
  setCookie(key, value, options);
  dispatchCookieEvent();
};

const removeCookieItem = (key: string, options?: RemoveCookieParams) => {
  removeCookie(key, options);
  dispatchCookieEvent();
};

const clearCookieItems = () => {
  clearCookies();
  dispatchCookieEvent();
};
/**
 * @name useCookies
 * @description - Hook that manages cookie values
 * @category Browser
 *
 * @overload
 * @template {object} Value The type of the cookie values
 * @param {string} key The key of the cookie
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove, getAll, clear } = useCookies();
 */
export const useCookies = <Value>() => {
  const [value, setValue] = useState<Value>(
    typeof window !== 'undefined' ? (getCookies(true) as Value) : ({} as Value)
  );

  useEffect(() => {
    const onChange = () => setValue(getCookies(true) as Value);

    window.addEventListener(COOKIE_EVENT, onChange);
    return () => {
      window.removeEventListener(COOKIE_EVENT, onChange);
    };
  }, []);

  const set = (key: string, value: Value, options?: SetCookieParams) => {
    if (value === null) return removeCookieItem(key);
    setCookieItem(key, value, options);
  };

  const remove = (key: string, options?: RemoveCookieParams) => removeCookieItem(key, options);
  const getAll = () => getCookies(true);
  const clear = () => clearCookieItems();

  return { value, set, remove, getAll, clear };
};
