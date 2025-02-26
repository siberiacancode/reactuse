import { useEffect, useSyncExternalStore } from 'react';

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

const setCookieItem = (key: string, value: any, options?: SetCookieParams) => {
  setCookie(key, value, options);
  dispatchCookieEvent();
};

const removeCookieItem = (key: string, options?: RemoveCookieParams) => {
  removeCookie(key, options);
  dispatchCookieEvent();
};

const getCookieItem = (key: string) => {
  const cookies = getCookies();
  return cookies[key];
};

const cookieSubscribe = (callback: () => void) => {
  window.addEventListener(COOKIE_EVENT, callback);
  return () => window.removeEventListener(COOKIE_EVENT, callback);
};

const getServerSnapshot = () => undefined;

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

  if (typeof window === 'undefined')
    return {
      value: initialValue instanceof Function ? initialValue() : initialValue
    } as UseCookieReturn<Value>;

  const getSnapshot = () => getCookieItem(key);
  const cookie = useSyncExternalStore(cookieSubscribe, getSnapshot, getServerSnapshot);

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as Value;

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value;
    }
  };

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    return JSON.stringify(value);
  };

  const set = (value: Value, options?: SetCookieParams) =>
    setCookieItem(key, serializer(value), options);
  const remove = (options?: RemoveCookieParams) => removeCookieItem(key, options);

  useEffect(() => {
    const value = getCookieItem(key);
    if (value === undefined && initialValue !== undefined) {
      setCookieItem(
        key,
        serializer(initialValue instanceof Function ? initialValue() : initialValue)
      );
    }
  }, [key]);

  return { value: cookie ? deserializer(cookie) : undefined, set, remove };
};
