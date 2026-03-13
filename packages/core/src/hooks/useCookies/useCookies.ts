import { useEffect, useState } from 'react';

import type { RemoveCookieParams, SetCookieParams } from '../useCookie/useCookie';

import {
  COOKIE_EVENT,
  dispatchCookieEvent,
  removeCookie,
  removeCookieItem,
  setCookieItem
} from '../useCookie/useCookie';

/** The cookies params type */
export type CookieParams = Record<string, any>;

/* The use cookies options type */
export interface UseCookiesOptions<Value> {
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}

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
export const useCookies = <Value extends CookieParams>(options?: UseCookiesOptions<Value>) => {
  const serializer = (value: Value[keyof Value]) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as Value[keyof Value];

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value[keyof Value];
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
    if (typeof window === 'undefined') return {} as Value;
    return getParsedCookies() as Value;
  });

  useEffect(() => {
    const onChange = () => setValue(getParsedCookies() as Value);

    window.addEventListener(COOKIE_EVENT, onChange);
    return () => {
      window.removeEventListener(COOKIE_EVENT, onChange);
    };
  }, []);

  const set = <Key extends keyof Value>(key: Key, value: Value[Key], options?: SetCookieParams) =>
    setCookieItem(key as string, serializer(value), options);

  const remove = <Key extends keyof Value>(key: Key, options?: RemoveCookieParams) =>
    removeCookieItem(key as string, options);
  const getAll = () => getParsedCookies();
  const clear = () => clearCookieItems();

  return { value, set, remove, getAll, clear };
};
