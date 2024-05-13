import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(
  callback: () => void
): { ref: RefObject<T> } => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);

  return { ref };
};
