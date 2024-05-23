import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useMutationObserver } from '../useMutationObserver';

export interface UseDocumentTitleOptions {
  /** Restore the previous title on unmount */
  restoreOnUnmount?: boolean;
}

export type UseDocumentTitleReturn = [
  /** The current title */
  title: string,

  /** Function to update the title */
  setTitle: (title: string) => void
];

/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 *
 * @param {string} [value] The initial title. If not provided, the current document title will be used
 * @param {UseDocumentTitleOptions} [options] The use document title options
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const [title, setTitle] = useDocumentTitle();
 */
export function useDocumentTitle(
  value?: string,
  options?: UseDocumentTitleOptions
): UseDocumentTitleReturn {
  const prevTitleRef = React.useRef(document.title);
  const [title, setTitle] = React.useState(value ?? document.title);

  useMutationObserver(
    () => {
      if (document && document.title !== title) {
        setTitle(document.title);
      }
    },
    { childList: true },
    document.head.querySelector('title')
  );

  useIsomorphicLayoutEffect(() => {
    if (options?.restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current;
      };
    }
  }, []);

  const set = (value: string) => {
    const updatedValue = value.trim();
    if (updatedValue.length > 0) document.title = updatedValue;
  };

  useIsomorphicLayoutEffect(() => {
    if (typeof value !== 'string') return;
    set(value);
  }, [value]);

  return [title, set];
}
