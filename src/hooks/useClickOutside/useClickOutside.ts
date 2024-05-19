import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

// composedPath что это такое
// params error
// string && element а нужно ли ?

type UseClickOutsideTarget = React.RefObject<HTMLElement | null> | string | Element;

const getElement = (target: UseClickOutsideTarget) => {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

export type UseClickOutsideReturn<Ref extends Element = any> = React.RefObject<Ref>;

export type UseClickOutside = {
  <Ref extends Element = any>(
    target: UseClickOutsideTarget | Array<UseClickOutsideTarget>,
    callback: (event: Event) => void
  ): UseClickOutsideReturn<Ref>;
  <Ref extends Element = any>(
    callback: (event: Event) => void,
    target?: never
  ): UseClickOutsideReturn<Ref>;
};

export const useClickOutside: UseClickOutside = (...params) => {
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;
  const target = typeof params[0] === 'function' ? null : params[0];

  const internalRef = React.useRef<Element>(null);
  const internalCallbackRef = React.useRef(callback);

  useIsomorphicLayoutEffect(() => {
    internalCallbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const handler = (event: Event) => {
      if (Array.isArray(target)) {
        target.forEach((target) => {
          const element = getElement(target);

          if (element && !element.contains(event.target as Node)) {
            internalCallbackRef.current(event);
          }
        });

        return;
      }

      const element = target ? getElement(target) : internalRef.current;

      if (element && !element.contains(event.target as Node)) {
        internalCallbackRef.current(event);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  return internalRef;
};
