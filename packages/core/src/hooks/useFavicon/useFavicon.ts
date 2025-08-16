import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

import { useMount } from '../useMount/useMount';

/** The use favicon return type */
export type UseFaviconReturn = [string, Dispatch<SetStateAction<string>>];

/**
 * @name useFavicon
 * @description - Hook that manages the favicon
 * @category Browser
 * @usage low
 *
 * @param {string} [initialFavicon] The initial favicon. If not provided, the current favicon will be used
 * @returns {UseFaviconReturn} An array containing the current favicon and a function to update the favicon
 *
 * @example
 * const { href, set } = useFavicon('https://siberiacancode.github.io/reactuse/favicon.ico');
 */
export const useFavicon = (initialHref?: string) => {
  const [href, setHref] = useState(
    initialHref ??
      (typeof document !== 'undefined'
        ? document.querySelector<HTMLLinkElement>(`link[rel*="icon"]`)?.href
        : undefined)
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

  return { href, set } as const;
};
