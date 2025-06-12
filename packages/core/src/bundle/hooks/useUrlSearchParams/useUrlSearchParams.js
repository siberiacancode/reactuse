import { useEffect, useState } from 'react';
export const getUrlSearchParams = (mode = 'history') => {
  const { search, hash } = window.location;
  let path = '';
  if (mode === 'history') path = search;
  if (mode === 'hash-params') path = hash.replace(/^#/, '');
  if (mode === 'hash') {
    const index = hash.indexOf('?');
    path = ~index ? hash.slice(index) : '';
  }
  const searchParams = new URLSearchParams(path);
  return searchParams;
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
export const URL_SEARCH_PARAMS_EVENT = 'reactuse-url-search-params-event';
export const dispatchUrlSearchParamsEvent = () =>
  window.dispatchEvent(new Event(URL_SEARCH_PARAMS_EVENT));
export const setUrlSearchParams = (mode, params, write = 'replace') => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, param]) => {
    if (Array.isArray(param)) {
      param.forEach((value) => searchParams.set(key, String(value)));
    } else {
      searchParams.set(key, String(param));
    }
  });
  const query = createQueryString(searchParams, mode);
  if (write === 'replace') window.history.replaceState({}, '', query);
  if (write === 'push') window.history.pushState({}, '', query);
  return searchParams;
};
/**
 * @name useUrlSearchParams
 * @description - Hook that provides reactive URLSearchParams
 * @category Browser
 *
 * @overload
 * @template Value The type of the url param values
 * @param {UrlSearchParamsMode} mode The URL mode
 * @param {UseUrlSearchParamsOptions<Value>} [options] The URL mode
 * @returns {UseUrlSearchParamsReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParams('history');
 */
export const useUrlSearchParams = (initialValue, options = {}) => {
  const { mode = 'history', write: writeMode = 'replace' } = options;
  const deserializer = (searchParams) => {
    if (typeof searchParams === 'string') {
      return deserializer(new URLSearchParams(searchParams));
    }
    if (searchParams instanceof URLSearchParams) {
      return Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
        if (value === 'undefined') return acc;
        try {
          acc[key] = JSON.parse(value);
        } catch {
          acc[key] = value;
        }
        return acc;
      }, {});
    }
    return searchParams;
  };
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue ?? {};
    const searchParams = getUrlSearchParams(mode);
    const value = {
      ...(initialValue && deserializer(initialValue)),
      ...deserializer(searchParams)
    };
    setUrlSearchParams(mode, value, writeMode);
    return value;
  });
  const set = (params, write = 'replace') => {
    const searchParams = setUrlSearchParams(mode, { ...value, ...params }, write ?? writeMode);
    setValue(deserializer(searchParams));
    dispatchUrlSearchParamsEvent();
  };
  useEffect(() => {
    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      setValue(deserializer(searchParams));
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
