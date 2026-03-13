import { useEffect, useState } from 'react';

import {
  createQueryString,
  dispatchUrlSearchParamsEvent,
  getUrlSearchParams,
  URL_SEARCH_PARAMS_EVENT
} from '../useUrlSearchParam/useUrlSearchParam';

/** The url params type */
export type UrlParams = Record<string, any>;

/** The url search params mod */
export type UrlSearchParamsMode = 'hash-params' | 'hash' | 'history';

/** The use url search params set options type */
export interface UseUrlSearchParamsSetOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

/* The use search params initial value type */
export type UseUrlSearchParamsInitialValue<Value> = (() => Value) | Value;

/** The use url search params options type */
export interface UseUrlSearchParamsOptions<Value> {
  /* The initial value of the url search params */
  initialValue?: UseUrlSearchParamsInitialValue<string | URLSearchParams | Value>;
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamsMode;
  /** The mode to use for writing to the URL  */
  write?: 'push' | 'replace';
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}

/** The use url search params return type */
export interface UseUrlSearchParamsReturn<Value> {
  /** The value of the url search params */
  value: Value;
  /** The set function */
  set: (value: Partial<Value>, options?: UseUrlSearchParamsSetOptions) => void;
}

export interface UseUrlSearchParams {
  <Value>(
    key: string,
    options: UseUrlSearchParamsOptions<Value> & {
      initialValue: UseUrlSearchParamsInitialValue<Value>;
    }
  ): UseUrlSearchParamsReturn<Value>;

  <Value>(options?: UseUrlSearchParamsOptions<Value>): UseUrlSearchParamsReturn<Value | undefined>;

  <Value>(initialValue: UseUrlSearchParamsInitialValue<Value>): UseUrlSearchParamsReturn<Value>;

  <Value>(key: string): UseUrlSearchParamsReturn<Value | undefined>;
}

/**
 * @name useUrlSearchParams
 * @description - Hook that provides reactive URLSearchParams
 * @category State
 * @usage high
 *
 * @overload
 * @template Value The type of the url param values
 * @param {UseUrlSearchParamsOptions<Value> & { initialValue: UseUrlSearchParamsInitialValue<Value> }} options The options object with required initialValue
 * @param {UseUrlSearchParamsInitialValue<Value>} [options.initialValue] The initial value for the url params
 * @param {UrlSearchParamsMode} [options.mode='history'] The mode to use for the URL ('history' | 'hash-params' | 'hash')
 * @param {'push' | 'replace'} [options.write='replace'] The mode to use for writing to the URL
 * @param {(value: Value[keyof Value]) => string} [options.serializer] Custom serializer function to convert value to string
 * @param {(value: string) => Value[keyof Value]} [options.deserializer] Custom deserializer function to convert string to value
 * @returns {UseUrlSearchParamsReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParams({ initialValue: { page: 1 } });
 *
 * @overload
 * @template Value The type of the url param values
 * @param {UseUrlSearchParamsInitialValue<Value>} [initialValue] The initial value for the url params
 * @returns {UseUrlSearchParamsReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParams({ page: 1 });
 */
export const useUrlSearchParams = (<Value extends UrlParams>(
  params: any
): UseUrlSearchParamsReturn<Value> => {
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
  ) as UseUrlSearchParamsOptions<Value> | undefined;
  const initialValue = (
    options ? options?.initialValue : params
  ) as UseUrlSearchParamsInitialValue<Value>;

  const { mode = 'history', write: writeMode = 'replace' } = options ?? {};

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

  const setUrlSearchParams = <Value extends UrlParams>(
    mode: UrlSearchParamsMode,
    value: Partial<Value>,
    write: 'push' | 'replace' = 'replace'
  ) => {
    const urlSearchParams = getUrlSearchParams(mode);

    Object.entries(value).forEach(([key, param]) => {
      if (param === undefined) {
        urlSearchParams.delete(key);
      } else {
        const serializedValue = serializer ? serializer(param) : String(param);
        urlSearchParams.set(key, serializedValue);
      }
    });

    const query = createQueryString(urlSearchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);
    dispatchUrlSearchParamsEvent();

    return urlSearchParams;
  };

  const getParsedUrlSearchParams = (searchParams: string | UrlParams | URLSearchParams) => {
    if (typeof searchParams === 'string') {
      return getParsedUrlSearchParams(new URLSearchParams(searchParams));
    }

    if (searchParams instanceof URLSearchParams) {
      return Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          acc[key] = deserializer(value);
          return acc;
        },
        {} as Record<string, any>
      );
    }

    return searchParams;
  };

  const [value, setValue] = useState<Value>(() => {
    if (typeof window === 'undefined') return (initialValue ?? {}) as Value;

    const urlSearchParams = getUrlSearchParams(mode);
    const value = {
      ...(initialValue && getParsedUrlSearchParams(initialValue)),
      ...getParsedUrlSearchParams(urlSearchParams)
    } as Value;

    setUrlSearchParams(mode, value, writeMode);

    return value;
  });

  const set = (params: Partial<Value>, options?: UseUrlSearchParamsSetOptions) => {
    const searchParams = setUrlSearchParams(
      mode,
      { ...value, ...params },
      options?.write ?? writeMode
    );
    setValue(getParsedUrlSearchParams(searchParams) as Value);
  };

  useEffect(() => {
    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      setValue(getParsedUrlSearchParams(searchParams) as Value);
    };

    window.addEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
    window.addEventListener('popstate', onParamsChange);
    if (mode !== 'history') window.addEventListener('hashchange', onParamsChange);

    return () => {
      window.removeEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
      window.removeEventListener('popstate', onParamsChange);
      if (mode !== 'history') window.removeEventListener('hashchange', onParamsChange);
    };
  }, [mode]);

  return {
    value,
    set
  };
}) as UseUrlSearchParams;

export { createQueryString, dispatchUrlSearchParamsEvent, getUrlSearchParams };
