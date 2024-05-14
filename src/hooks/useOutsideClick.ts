import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
  callback: () => void
): { ref: RefObject<T> } => {
  const ref = useRef<T>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref };
};
