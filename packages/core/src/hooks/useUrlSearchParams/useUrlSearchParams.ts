import { useEffect, useState } from 'react';

export type UrlParams = Record<string, string | string[]>;
export type UrlSearchParamsMode = 'hash-params' | 'hash' | 'history';

export interface UseUrlSearchParamsOptions<VALUE> {
  /** The initial value for hook that use in URL params */
  initialValue?: VALUE;
  /** The boolean flag, for remove values that has falsy values (e.g. `''`, `0`, `false`, `NaN`) */
  removeFalsyValues?: boolean;
  /** The boolean flag, for remove values that 'null' and 'undefined' */
  removeNullishValues?: boolean;
  /** The custom window object */
  window?: Window;
  /**  Whether to write changes back to the URL */
  write?: boolean;
  /**
   * Use `'push'` to push a new history entry on each update,
   * or `'replace'` to replace the current entry.
   */
  writeMode?: 'push' | 'replace';
}

export interface UseUrlSearchParamsReturn<VALUE> {
  value: VALUE;
  set: (newParams: Partial<VALUE>) => void;
}

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

export const useUrlSearchParams = <VALUE extends Record<string, any> = UrlParams>(
  mode: UrlSearchParamsMode = 'history',
  options: UseUrlSearchParamsOptions<VALUE> = {}
): UseUrlSearchParamsReturn<VALUE> => {
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

  const urlParamsToObject = (params: URLSearchParams) => {
    const result: UrlParams = {};

    for (const key of params.keys()) {
      const values = params.getAll(key);
      result[key] = values.length > 1 ? values : values[0];
    }

    return result;
  };

  const [params, setParams] = useState<VALUE>(() => {
    if (!defaultWindow) return initialValue as VALUE;
    return urlParamsToObject(new URLSearchParams(getRawParams())) as VALUE;
  });

  const buildQueryString = (params: URLSearchParams): string => {
    const paramsString = params.toString();
    const { search, hash } = defaultWindow.location;

    if (mode === 'history') return `${paramsString ? `?${paramsString}` : ''}${hash}`;
    if (mode === 'hash-params') return `${search}${paramsString ? `#${paramsString}` : ''}`;

    const index = hash.indexOf('?');
    const base = index > -1 ? hash.slice(0, index) : hash;

    return `${search}${base}${paramsString ? `?${paramsString}` : ''}`;
  };

  const updateUrl = (newParams: Partial<VALUE>) => {
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

    setParams(urlParamsToObject(searchParams) as VALUE);
  };

  useEffect(() => {
    if (!defaultWindow) return;

    const currentParams = new URLSearchParams(getRawParams());

    if (!Array.from(currentParams.keys()).length && Object.keys(initialValue).length) {
      updateUrl(initialValue);
    }

    const handleSetParams = () => {
      const newParams = new URLSearchParams(getRawParams());
      setParams(urlParamsToObject(newParams) as VALUE);
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
