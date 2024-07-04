import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useMount } from '../useMount/useMount';

/** The use favicon return type */
export type UseFaviconReturn = [string, Dispatch<SetStateAction<string>>];

/**
 * @name useFavicon
 * @description - Hook that manages the favicon
 * @category Browser
 *
 * @param {string} [initialFavicon] The initial favicon. If not provided, the current favicon will be used
 * @returns {UseFaviconReturn} An array containing the current favicon and a function to update the favicon
 *
 * @example
 * const { href, set } = useFavicon('https://www.google.com/favicon.ico');
 */
export const useFavicon = (initialHref?: string) => {
  const [href, setHref] = useState(
    initialHref ?? document.querySelector<HTMLLinkElement>(`link[rel*="icon"]`)?.href
  );

  const injectFavicon = (favicon: string) => {
    const link =
      document.querySelector<HTMLLinkElement>(`link[rel*="icon"]`) ||
      document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = `image/${favicon.split('.').pop()}`;
    document.head.append(link);
  };

  const set = (favicon: string) => {
    setHref(favicon);
    injectFavicon(favicon);
  };

  useMount(() => {
    if (!initialHref) return;
    injectFavicon(initialHref);
  });

  useDidUpdate(() => {
    if (!initialHref) return;
    setHref(initialHref);
    injectFavicon(initialHref);
  }, [initialHref]);

  return { href, set } as const;
};
