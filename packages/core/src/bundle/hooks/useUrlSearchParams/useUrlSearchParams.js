import { useEffect, useState } from 'react';
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
export const useUrlSearchParams = (mode = 'history', options = {}) => {
  const {
    initialValue = {},
    removeNullishValues = true,
    removeFalsyValues = false,
    write = true,
    window: defaultWindow = window,
    writeMode = 'replace'
  } = options;
  const getRawParams = () => {
    const { search, hash } = defaultWindow.location;
    if (mode === 'history') return search;
    if (mode === 'hash-params') return hash.replace(/^#/, '');
    const index = hash.indexOf('?');
    return index > -1 ? hash.slice(index) : '';
  };
  const urlParamsToObject = (params) => {
    const result = {};
    for (const key of params.keys()) {
      const values = params.getAll(key);
      result[key] = values.length > 1 ? values : values[0];
    }
    return result;
  };
  const [params, setParams] = useState(() => {
    if (!defaultWindow) return initialValue;
    return urlParamsToObject(new URLSearchParams(getRawParams()));
  });
  const buildQueryString = (params) => {
    const paramsString = params.toString();
    const { search, hash } = defaultWindow.location;
    if (mode === 'history') return `${paramsString ? `?${paramsString}` : ''}${hash}`;
    if (mode === 'hash-params') return `${search}${paramsString ? `#${paramsString}` : ''}`;
    const index = hash.indexOf('?');
    const base = index > -1 ? hash.slice(0, index) : hash;
    return `${search}${base}${paramsString ? `?${paramsString}` : ''}`;
  };
  const updateUrl = (newParams) => {
    if (!defaultWindow || !write) return;
    const searchParams = new URLSearchParams();
    Object.entries({ ...params, ...newParams }).forEach(([key, value]) => {
      if (value == null && removeNullishValues) return;
      if (!value && removeFalsyValues) return;
      Array.isArray(value)
        ? value.forEach((value) => searchParams.append(key, value))
        : searchParams.set(key, String(value));
    });
    const query = buildQueryString(searchParams);
    writeMode === 'replace'
      ? defaultWindow.history.replaceState({}, '', query)
      : defaultWindow.history.pushState({}, '', query);
    setParams(urlParamsToObject(searchParams));
  };
  useEffect(() => {
    if (!defaultWindow) return;
    const currentParams = new URLSearchParams(getRawParams());
    if (!Array.from(currentParams.keys()).length && Object.keys(initialValue).length) {
      updateUrl(initialValue);
    }
    const handleSetParams = () => {
      const newParams = new URLSearchParams(getRawParams());
      setParams(urlParamsToObject(newParams));
    };
    defaultWindow.addEventListener('popstate', handleSetParams);
    if (mode !== 'history') defaultWindow.addEventListener('hashchange', handleSetParams);
    return () => {
      defaultWindow.removeEventListener('popstate', handleSetParams);
      if (mode !== 'history') defaultWindow.removeEventListener('hashchange', handleSetParams);
    };
  }, [defaultWindow, mode]);
  return {
    value: params,
    set: updateUrl
  };
};
