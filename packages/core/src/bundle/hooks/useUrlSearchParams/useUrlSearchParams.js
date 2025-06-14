import { useEffect, useState } from 'react';
import {
  createQueryString,
  dispatchUrlSearchParamsEvent,
  getUrlSearchParams,
  URL_SEARCH_PARAMS_EVENT
} from '../useUrlSearchParam/useUrlSearchParam';
/**
 * @name useUrlSearchParams
 * @description - Hook that provides reactive URLSearchParams
 * @category Browser
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
export const useUrlSearchParams = (params) => {
  const options =
    typeof params === 'object' &&
    params &&
    ('serializer' in params ||
      'deserializer' in params ||
      'initialValue' in params ||
      'mode' in params ||
      'write' in params)
      ? params
      : undefined;
  const initialValue = options ? options?.initialValue : params;
  const { mode = 'history', write: writeMode = 'replace' } = options;
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
  const setUrlSearchParams = (mode, value, write = 'replace') => {
    const urlSearchParams = new URLSearchParams();
    Object.entries(value).forEach(([key, param]) => {
      if (Array.isArray(param)) {
        param.forEach((value) => urlSearchParams.set(key, serializer(value)));
      } else {
        urlSearchParams.set(key, serializer(param));
      }
    });
    const query = createQueryString(urlSearchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);
    return urlSearchParams;
  };
  const getParsedUrlSearchParams = (searchParams) => {
    if (typeof searchParams === 'string') {
      return getParsedUrlSearchParams(new URLSearchParams(searchParams));
    }
    if (searchParams instanceof URLSearchParams) {
      return Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
        acc[key] = deserializer(value);
        return acc;
      }, {});
    }
    return searchParams;
  };
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue ?? {};
    const urlSearchParams = getUrlSearchParams(mode);
    const value = {
      ...(initialValue && getParsedUrlSearchParams(initialValue)),
      ...getParsedUrlSearchParams(urlSearchParams)
    };
    setUrlSearchParams(mode, value, writeMode);
    return value;
  });
  const set = (params, options) => {
    const searchParams = setUrlSearchParams(
      mode,
      { ...value, ...params },
      options?.write ?? writeMode
    );
    setValue(getParsedUrlSearchParams(searchParams));
    dispatchUrlSearchParamsEvent();
  };
  useEffect(() => {
    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      setValue(getParsedUrlSearchParams(searchParams));
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
};
export { createQueryString, dispatchUrlSearchParamsEvent, getUrlSearchParams };
