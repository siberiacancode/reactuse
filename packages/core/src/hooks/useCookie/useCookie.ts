import { useEffect, useState } from 'react';

import type { RemoveCookieParams, SetCookieParams } from './helpers';

import { getCookies, removeCookie, setCookie } from './helpers';

/* The use storage initial value type */
export type UseCookieInitialValue<Value> = (() => Value) | Value;

/* The use storage options type */
export interface UseCookieOptions<Value> {
  /* The initial value of the storage */
  initialValue?: UseCookieInitialValue<Value>;
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /* The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

/* The use cookie return type */
export interface UseCookieReturn<Value> {
  /* The value of the cookie */
  value: Value;
  /* The remove function */
  remove: (options?: RemoveCookieParams) => void;
  /* The set function */
  set: (value: Value, options?: SetCookieParams) => void;
}

export const COOKIE_EVENT = 'reactuse-cookie';

export const dispatchCookieEvent = () => window.dispatchEvent(new Event(COOKIE_EVENT));

const setCookieItem = (key: string, value: string, options?: SetCookieParams) => {
  setCookie(key, value, options);
  dispatchCookieEvent();
};

const removeCookieItem = (key: string, options?: RemoveCookieParams) => {
  removeCookie(key, options);
  dispatchCookieEvent();
};

const getCookieItem = (key: string): string | undefined => {
  const cookies = getCookies();
  return cookies[key];
};

/**
 * @name useCookie
 * @description - Hook that manages cookie value
 * @category Browser
 *
 * @overload
 * @template Value The type of the cookie value
 * @param {string} key The key of the cookie
 * @param {UseCookieInitialValue<Value>} [initialValue] The initial value of the cookie
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove } = useCookie('key', 'value');
 */
export const useCookie = <Value>(
  key: string,
  params?: UseCookieInitialValue<Value> | UseCookieOptions<Value>
) => {
  const options = (
    typeof params === 'object' &&
    params &&
    ('serializer' in params || 'deserializer' in params || 'initialValue' in params)
      ? params
      : undefined
  ) as UseCookieOptions<Value>;
  const initialValue = (options ? options?.initialValue : params) as UseCookieInitialValue<Value>;

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as Value;

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value;
    }
  };

  const [value, setValue] = useState<Value | undefined>(() => {
    const cookieValue = getCookieItem(key);
    if (cookieValue === undefined && initialValue !== undefined) {
      const value = initialValue instanceof Function ? initialValue() : initialValue;
      setCookieItem(key, serializer(value));
      return value;
    }
    return cookieValue ? deserializer(cookieValue) : undefined;
  });

  useEffect(() => {
    const onChange = () => {
      const cookieValue = getCookieItem(key);
      setValue(cookieValue ? deserializer(cookieValue) : undefined);
    };
    window.addEventListener(COOKIE_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_EVENT, onChange);
  }, [key]);

  const set = (value: Value, options?: SetCookieParams) =>
    setCookieItem(key, serializer(value), options);
  const remove = (options?: RemoveCookieParams) => removeCookieItem(key, options);

  return { value, set, remove };
};
