import { useEffect, useState } from 'react';

export const getUrlSearchParams = (mode: UrlSearchParamsMode = 'history') => {
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

export const createQueryString = (searchParams: URLSearchParams, mode: UrlSearchParamsMode) => {
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

export const setUrlSearchParams = <Params extends UrlParams>(
  mode: UrlSearchParamsMode,
  params: Partial<Params>,
  write: 'push' | 'replace' = 'replace'
) => {
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

/** The url params type */
export type UrlParams = Record<string, any>;

/** The url search params mod */
export type UrlSearchParamsMode = 'hash-params' | 'hash' | 'history';

/** The use url search params set options type */
export interface UseUrlSearchParamsSetOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

/** The use url search params options type */
export interface UseUrlSearchParamsOptions {
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamsMode;
  /** The mode to use for writing to the URL  */
  write?: 'push' | 'replace';
}

/** The use url search params return type */
export interface UseUrlSearchParamsReturn<Params extends UrlParams> {
  value: Params;
  set: (params: Partial<Params>) => void;
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
export const useUrlSearchParams = <
  Params extends UrlParams,
  SearchParams extends string | UrlParams | URLSearchParams = UrlParams
>(
  initialValue?: SearchParams,
  options: UseUrlSearchParamsOptions = {}
): UseUrlSearchParamsReturn<Params> => {
  const { mode = 'history', write: writeMode = 'replace' } = options;

  const deserializer = (searchParams: string | UrlParams | URLSearchParams) => {
    if (typeof searchParams === 'string') {
      return deserializer(new URLSearchParams(searchParams));
    }

    if (searchParams instanceof URLSearchParams) {
      return Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (value === 'undefined') return acc;
          try {
            acc[key] = JSON.parse(value);
          } catch {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
    }

    return searchParams;
  };

  const [value, setValue] = useState(deserializer(initialValue ?? {}) as Params);

  const set = (params: Partial<Params>, write: 'push' | 'replace' = 'replace') => {
    const searchParams = setUrlSearchParams(mode, { ...value, ...params }, write ?? writeMode);
    setValue(deserializer(searchParams) as Params);
  };

  useEffect(() => {
    set(value);

    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      set(deserializer(searchParams) as Params);
    };

    window.addEventListener('popstate', onParamsChange);
    if (mode !== 'history') window.addEventListener('hashchange', onParamsChange);

    return () => {
      window.removeEventListener('popstate', onParamsChange);
      if (mode !== 'history') window.removeEventListener('hashchange', onParamsChange);
    };
  }, [mode]);

  return {
    value,
    set
  };
};
