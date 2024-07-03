import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

/** The resize observer target element type */
type UseResizeObserverTarget = RefObject<Element | null> | (() => Element) | Element;

const getElement = (target: UseResizeObserverTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

/** The resize observer options type */
export interface UseResizeObserverOptions extends ResizeObserverOptions {
  enabled?: boolean;
  onChange?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
}

/** The resize observer return type */
export interface UseResizeObserverReturn {
  entries: ResizeObserverEntry[];
}

export type UseResizeObserver = {
  <Target extends UseResizeObserverTarget | UseResizeObserverTarget[]>(
    target: Target,
    options?: UseResizeObserverOptions
  ): UseResizeObserverReturn;

  <Target extends UseResizeObserverTarget | UseResizeObserverTarget[]>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: RefObject<Target> };
};

/**
 *  @name useResizeObserver
 *  @description - Hook that gives you resize observer state
 *  @category Browser
 *
 *  @overload
 *  @template Target The target element
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 *  @example
 *  const { ref, entries } = useResizeObserver();
 *
 *  @overload
 *  @template Target The target element
 *  @param {Target} target The target element to observe
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 *  @example
 *  const { entries } = useResizeObserver(ref);
 */
export const useResizeObserver = ((...params: any[]) => {
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UseResizeObserverTarget | UseResizeObserverTarget[] | undefined;
  const options = (target ? params[1] : params[0]) as UseResizeObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entries, setEntries] = useState<ResizeObserverEntry[]>([]);

  const internalRef = useRef<Element>(null);
  const internalOnChangeRef = useRef<UseResizeObserverOptions['onChange']>();
  internalOnChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled) return;

    if (Array.isArray(target)) {
      if (!target.length) return;
      const observer = new ResizeObserver((entries) => {
        setEntries(entries);
        internalOnChangeRef.current?.(entries, observer);
      });

      target.forEach((target) => {
        const element = getElement(target);
        if (!element) return;
        observer.observe(element, options);
      });

      return () => {
        observer.disconnect();
      };
    }

    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setEntries(entries);
      internalOnChangeRef.current?.(entries, observer);
    });
    observer.observe(element, options);

    return () => {
      observer.disconnect();
    };
  }, [target, options?.box, enabled]);

  if (target) return { entries };
  return { entries, ref: internalRef };
}) as UseResizeObserver;
