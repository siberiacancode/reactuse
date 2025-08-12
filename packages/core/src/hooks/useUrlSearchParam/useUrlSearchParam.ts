import { useEffect, useState } from 'react';

/** The url search params mode type */
export type UrlSearchParamMode = 'hash-params' | 'hash' | 'history';

/** The use url search param options type */
export interface UseUrlSearchParamOptions<Value> {
  /** The initial value of the search param */
  initialValue?: Value;
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamMode;
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
  /** The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /** The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

/** The use url search params set options type */
export interface UseUrlSearchParamsActionOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

/** The use url search param return type */
export interface UseUrlSearchParamReturn<Value> {
  /** Current search param value */
  value: Value | undefined;
  /** Function to remove the search param */
  remove: (options?: UseUrlSearchParamsActionOptions) => void;
  /** Function to update search param */
  set: (value: Value, options?: UseUrlSearchParamsActionOptions) => void;
}

export const URL_SEARCH_PARAMS_EVENT = 'reactuse-url-search-params-event';

export const getUrlSearchParams = (mode: UrlSearchParamMode = 'history') => {
  const { search, hash } = window.location;

  let path = '';

  if (mode === 'history') path = search;
  if (mode === 'hash-params') path = hash.replace(/^#/, '');
  if (mode === 'hash') {
    const index = hash.indexOf('?');
    path = ~index ? hash.slice(index) : '';
  }

  return new URLSearchParams(path);
};

export const createQueryString = (searchParams: URLSearchParams, mode: UrlSearchParamMode) => {
  const searchParamsString = searchParams.toString();
  const { search, hash } = window.location;

  if (mode === 'history') return `${searchParamsString ? `?${searchParamsString}` : ''}${hash}`;
  if (mode === 'hash-params')
    return `${search}${searchParamsString ? `#${searchParamsString}` : ''}`;
  if (mode === 'hash') {
    const index = hash.indexOf('?');
    const base = index > -1 ? hash.slice(0, index) : hash;
    return `${search}${base}${searchParamsString ? `?${searchParamsString}` : ''}`;
  }

  throw new Error('Invalid mode');
};

export const dispatchUrlSearchParamsEvent = () =>
  window.dispatchEvent(new Event(URL_SEARCH_PARAMS_EVENT));

export interface UseUrlSearchParam {
  <Value>(
    key: string,
    options: UseUrlSearchParamOptions<Value> & { initialValue: Value }
  ): UseUrlSearchParamReturn<Value>;

  <Value>(
    key: string,
    options?: UseUrlSearchParamOptions<Value>
  ): UseUrlSearchParamReturn<Value | undefined>;

  <Value>(key: string, initialValue: Value): UseUrlSearchParamReturn<Value>;

  <Value>(key: string): UseUrlSearchParamReturn<Value | undefined>;
}

/**
 * @name useUrlSearchParam
 * @description - Hook that provides reactive URLSearchParams for a single key
 * @category State
 * @usage high
 *
 * @overload
 * @template Value The type of the url param values
 * @param {string} key The key of the url param
 * @param {UseUrlSearchParamOptions<Value> & { initialValue: Value }} options The options object with required initialValue
 * @param {Value} options.initialValue The initial value for the url param
 * @param {UrlSearchParamsMode} [options.mode='history'] The mode to use for the URL ('history' | 'hash-params' | 'hash')
 * @param {'push' | 'replace'} [options.write='replace'] The mode to use for writing to the URL
 * @param {(value: Value) => string} [options.serializer] Custom serializer function to convert value to string
 * @param {(value: string) => Value} [options.deserializer] Custom deserializer function to convert string to value
 * @returns {UseUrlSearchParamReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParam('page', { initialValue: 1 });
 *
 * @overload
 * @template Value The type of the url param values
 * @param {string} key The key of the url param
 * @param {Value} [initialValue] The initial value for the url param
 * @returns {UseUrlSearchParamReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParam('page', 1);
 */
export const useUrlSearchParam = (<Value>(key: string, params?: any) => {
  const options = (
    typeof params === 'object' &&
    params &&
    ('serializer' in params ||
      'deserializer' in params ||
      'initialValue' in params ||
      'mode' in params ||
      'write' in params)
      ? params
      : undefined
  ) as UseUrlSearchParamOptions<Value>;

  const initialValue = (options ? options?.initialValue : params) as Value;
  const { mode = 'history', write: writeMode = 'replace' } = options ?? {};

  if (typeof window === 'undefined') {
    return {
      value: initialValue,
      remove: () => {},
      set: () => {}
    } as UseUrlSearchParamReturn<Value>;
  }

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;

    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined' || value === 'null') return undefined as unknown as Value;

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value;
    }
  };

  const setUrlSearchParam = (
    key: string,
    value: Value | undefined,
    mode: UrlSearchParamMode,
    write: 'push' | 'replace' = 'replace'
  ) => {
    const searchParams = getUrlSearchParams(mode);
    const serializedValue =
      value !== undefined ? (serializer ? serializer(value) : String(value)) : '';

    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, serializedValue);
    }

    const query = createQueryString(searchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);

    dispatchUrlSearchParamsEvent();
  };

  const [value, setValue] = useState<Value | undefined>(() => {
    const searchParams = getUrlSearchParams(mode);
    const currentValue = searchParams.get(key);

    if (currentValue === null && initialValue !== undefined) {
      setUrlSearchParam(key, initialValue, mode, writeMode);
      return initialValue;
    }

    return currentValue ? deserializer(currentValue) : undefined;
  });

  const set = (value: Value, options?: UseUrlSearchParamsActionOptions) => {
    setUrlSearchParam(key, value, mode, options?.write ?? writeMode);
    setValue(value);
  };

  const remove = (options?: UseUrlSearchParamsActionOptions) => {
    setUrlSearchParam(key, undefined, mode, options?.write ?? writeMode);
    setValue(undefined);
  };

  useEffect(() => {
    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      const newValue = searchParams.get(key);
      setValue(newValue ? deserializer(newValue) : undefined);
    };

    window.addEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
    window.addEventListener('popstate', onParamsChange);
    if (mode !== 'history') {
      window.addEventListener('hashchange', onParamsChange);
    }

    return () => {
      window.removeEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
      window.removeEventListener('popstate', onParamsChange);
      if (mode !== 'history') {
        window.removeEventListener('hashchange', onParamsChange);
      }
    };
  }, [key, mode]);

  return {
    value,
    remove,
    set
  };
}) as UseUrlSearchParam;
