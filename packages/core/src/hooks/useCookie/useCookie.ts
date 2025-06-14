import { useEffect, useState } from 'react';

export const getCookies = () =>
  Object.fromEntries(
    document.cookie.split('; ').map((cookie) => {
      const [key, ...value] = cookie.split('=');
      const decodedValue = decodeURIComponent(value.join('='));
      return [key, decodedValue];
    })
  );

export interface RemoveCookieParams {
  domain?: string;
  expires?: Date;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'None' | 'Strict';
  secure?: boolean;
}

export const removeCookie = (key: string, options: RemoveCookieParams = {}) => {
  document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
    options.path ? `; path=${options.path}` : ''
  }${options.domain ? `; domain=${options.domain}` : ''}${options.maxAge ? `; max-age=0` : ''}${
    options.expires ? `; expires=Thu, 01 Jan 1970 00:00:00 GMT` : ''
  }${options.secure ? `; secure` : ''}${options.sameSite ? `; samesite=${options.sameSite}` : ''}`;
};

export interface SetCookieParams {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'None' | 'Strict';
  secure?: boolean;
}

export const setCookie = (key: string, value: string, options: SetCookieParams = {}) => {
  const cookie = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];

  if (options.path) cookie.push(`path=${options.path}`);
  if (options.domain) cookie.push(`domain=${options.domain}`);
  if (typeof options.maxAge === 'number') cookie.push(`max-age=${options.maxAge}`);
  if (options.expires) cookie.push(`expires=${options.expires.toUTCString()}`);
  if (options.secure) cookie.push(`secure`);
  if (options.httpOnly) cookie.push(`httpOnly`);
  if (options.sameSite) cookie.push(`samesite=${options.sameSite}`);

  document.cookie = cookie.join('; ');
};

/* The use cookie initial value type */
export type UseCookieInitialValue<Value> = (() => Value) | Value;

/* The use cookie options type */
export interface UseCookieOptions<Value> {
  /* The domain of the cookie */
  domain?: string;
  /* The expiration date of the cookie */
  expires?: Date;
  /* Whether the cookie is httpOnly */
  httpOnly?: boolean;
  /* The initial value of the storage */
  initialValue?: UseCookieInitialValue<Value>;
  /* The maximum age of the cookie */
  maxAge?: number;
  /* The path of the cookie */
  path?: string;
  /* The sameSite of the cookie */
  sameSite?: 'Lax' | 'None' | 'Strict';
  /* Whether the cookie is secure */
  secure?: boolean;
  /* Whether to update the cookie on change */
  updateOnChange?: boolean;
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

export const setCookieItem = (key: string, value: string, options?: SetCookieParams) => {
  setCookie(key, value, options);
  dispatchCookieEvent();
};

export const removeCookieItem = (key: string, options?: RemoveCookieParams) => {
  removeCookie(key, options);
  dispatchCookieEvent();
};

export const getCookie = (key: string): string | undefined => {
  const cookies = getCookies();
  return cookies[key];
};

export interface UseCookie {
  <Value>(
    key: string,
    options: UseCookieOptions<Value> & { initialValue: UseCookieInitialValue<Value> }
  ): UseCookieReturn<Value>;

  <Value>(key: string, options?: UseCookieOptions<Value>): UseCookieReturn<Value | undefined>;

  <Value>(key: string, initialValue: UseCookieInitialValue<Value>): UseCookieReturn<Value>;

  <Value>(key: string): UseCookieReturn<Value | undefined>;
}

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
 * @overload
 * @template Value The type of the cookie value
 * @param {string} key The key of the cookie
 * @param {UseCookieOptions<Value>} options The options object
 * @param {UseCookieInitialValue<Value>} [options.initialValue] The initial value of the cookie
 * @param {boolean} [options.updateOnChange=true] Whether to update the cookie on change
 * @param {(value: string) => Value} [options.deserializer] The deserializer function to be invoked
 * @param {(value: Value) => string} [options.serializer] The serializer function to be invoked
 * @returns {UseCookieReturn<Value | undefined>} The value and the set function
 *
 * @example
 * const { value, set, remove } = useCookie('key', 'value');
 */
export const useCookie = (<Value>(key: string, params?: any) => {
  const options = (
    typeof params === 'object' &&
    params &&
    ('serializer' in params || 'deserializer' in params || 'initialValue' in params)
      ? params
      : undefined
  ) as UseCookieOptions<Value>;
  const initialValue = (options ? options?.initialValue : params) as UseCookieInitialValue<Value>;

  if (typeof document === 'undefined')
    return {
      value: typeof initialValue === 'function' ? (initialValue as () => Value)() : initialValue
    } as UseCookieReturn<Value>;

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
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
    const cookieValue = getCookie(key);
    if (cookieValue === undefined && initialValue !== undefined) {
      const value =
        typeof initialValue === 'function' ? (initialValue as () => Value)() : initialValue;
      setCookieItem(key, serializer(value), options);
      return value;
    }
    return cookieValue ? deserializer(cookieValue) : undefined;
  });

  useEffect(() => {
    const onChange = () => {
      const cookieValue = getCookie(key);
      setValue(cookieValue ? deserializer(cookieValue) : undefined);
    };
    window.addEventListener(COOKIE_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_EVENT, onChange);
  }, [key]);

  const set = (value: Value, params?: SetCookieParams) =>
    setCookieItem(key, serializer(value), { ...options, ...params });
  const remove = (params?: RemoveCookieParams) => removeCookieItem(key, { ...options, ...params });

  return { value, set, remove };
}) as UseCookie;
