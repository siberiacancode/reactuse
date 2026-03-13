import { useEffect, useState } from 'react';
import {
  COOKIE_EVENT,
  dispatchCookieEvent,
  removeCookie,
  removeCookieItem,
  setCookieItem
} from '../useCookie/useCookie';
export const clearCookies = () => {
  document.cookie.split('; ').forEach((cookie) => {
    const [name] = cookie.split('=');
    removeCookie(name);
  });
};
const clearCookieItems = () => {
  clearCookies();
  dispatchCookieEvent();
};
/**
 * @name useCookies
 * @description - Hook that manages cookie values
 * @category State
 * @usage medium

 * @overload
 * @template {object} Value The type of the cookie values
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove, getAll, clear } = useCookies();
 */
export const useCookies = (options) => {
  const serializer = (value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };
  const deserializer = (value) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };
  const getParsedCookies = () => {
    if (!document.cookie) return {};
    return Object.fromEntries(
      document.cookie
        .split('; ')
        .map((cookie) => {
          const [key, ...value] = cookie.split('=');
          if (!key || !value.length) return [];
          const decodedValue = decodeURIComponent(value.join('='));
          return [key, deserializer(decodedValue)];
        })
        .filter((entry) => entry.length)
    );
  };
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return {};
    return getParsedCookies();
  });
  useEffect(() => {
    const onChange = () => setValue(getParsedCookies());
    window.addEventListener(COOKIE_EVENT, onChange);
    return () => {
      window.removeEventListener(COOKIE_EVENT, onChange);
    };
  }, []);
  const set = (key, value, options) => setCookieItem(key, serializer(value), options);
  const remove = (key, options) => removeCookieItem(key, options);
  const getAll = () => getParsedCookies();
  const clear = () => clearCookieItems();
  return { value, set, remove, getAll, clear };
};
