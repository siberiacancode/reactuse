import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

// composedPath что это такое

type UseClickOutsideTarget = React.RefObject<Element | null> | (() => Element) | Element;

const getElement = (target: UseClickOutsideTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

export type UseClickOutsideReturn<
  Target extends UseClickOutsideTarget | Array<UseClickOutsideTarget> = any
> = React.RefObject<Target>;

export type UseClickOutside = {
  <Target extends UseClickOutsideTarget | Array<UseClickOutsideTarget> = any>(
    target: Target,
    callback: (event: Event) => void
  ): void;

  <Target extends UseClickOutsideTarget | Array<UseClickOutsideTarget> = any>(
    callback: (event: Event) => void,
    target?: never
  ): UseClickOutsideReturn<Target>;
};

export const useClickOutside = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? null : params[0]) as
    | UseClickOutsideTarget
    | Array<UseClickOutsideTarget>
    | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;

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

  if (target) return;
  return internalRef;
}) as UseClickOutside;
