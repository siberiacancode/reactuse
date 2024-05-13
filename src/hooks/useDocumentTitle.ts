import React from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';
import { useMutationObserver } from './useMutationObserver';

export interface UseDocumentTitleOptions {
  restoreOnUnmount?: boolean;
}

export function useDocumentTitle(value?: string, options?: UseDocumentTitleOptions) {
  const prevTitleRef = React.useRef(document.title);
  const [title, setTitle] = React.useState(value ?? document.title);

  useMutationObserver(
    () => {
      if (document) setTitle(document.title);
    },
    { childList: true },
    document.head.querySelector('title')
  );

  useIsomorphicEffect(() => {
    if (options?.restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current;
      };
    }
    return;
  }, []);

  const set = (value: string) => {
    const updatedValue = value.trim();
    if (updatedValue.length > 0) document.title = updatedValue;
  };

  useIsomorphicEffect(() => {
    if (typeof value !== 'string') return;
    set(value);
  }, [value]);

  return [title, set] as const;
}
