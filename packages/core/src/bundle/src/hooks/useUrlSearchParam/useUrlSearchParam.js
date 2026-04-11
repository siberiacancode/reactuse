import { useEffect, useState } from 'react';
export const URL_SEARCH_PARAMS_EVENT = 'reactuse-url-search-params-event';
export const getUrlSearchParams = (mode = 'history') => {
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
export const createQueryString = (searchParams, mode) => {
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
export const useUrlSearchParam = (key, params) => {
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
  const { mode = 'history', write: writeMode = 'replace' } = options ?? {};
  if (typeof window === 'undefined') {
    return {
      value: initialValue,
      remove: () => {},
      set: () => {}
    };
  }
  const serializer = (value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };
  const deserializer = (value) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined' || value === 'null') return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };
  const setUrlSearchParam = (key, value, mode, write = 'replace') => {
    const urlSearchParams = getUrlSearchParams(mode);
    if (value === undefined) {
      urlSearchParams.delete(key);
    } else {
      const serializedValue = serializer ? serializer(value) : String(value);
      urlSearchParams.set(key, serializedValue);
    }
    const query = createQueryString(urlSearchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);
    dispatchUrlSearchParamsEvent();
  };
  const [value, setValue] = useState(() => {
    const urlSearchParams = getUrlSearchParams(mode);
    const currentValue = urlSearchParams.get(key);
    if (currentValue === null && initialValue !== undefined) {
      setUrlSearchParam(key, initialValue, mode, writeMode);
      return initialValue;
    }
    return currentValue ? deserializer(currentValue) : undefined;
  });
  const set = (value, options) => {
    setUrlSearchParam(key, value, mode, options?.write ?? writeMode);
    setValue(value);
  };
  const remove = (options) => {
    setUrlSearchParam(key, undefined, mode, options?.write ?? writeMode);
    setValue(undefined);
  };
  useEffect(() => {
    const onParamsChange = () => {
      const urlSearchParams = getUrlSearchParams(mode);
      const newValue = urlSearchParams.get(key);
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
};
