import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The resize observer options type */
export interface UseResizeObserverOptions extends ResizeObserverOptions {
  /** The enabled state */
  enabled?: boolean;
  /** The resize observer callback */
  onChange?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
}

/** The resize observer return type */
export interface UseResizeObserverReturn {
  /** The resize observer entries */
  entries: ResizeObserverEntry[];
}

export interface UseResizeObserver {
  (target: HookTarget, options?: UseResizeObserverOptions): UseResizeObserverReturn;

  <Target extends Element>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };
}

/**
 *  @name useResizeObserver
 *  @description - Hook that gives you resize observer state
 *  @category Browser
 *
 *  @browserapi ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 *  @overload
 *  @template Target The target element
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} An object containing the resize observer state
 *
 *  @example
 *  const { ref, entries } = useResizeObserver();
 *
 *  @overload
 *  @template Target The target element
 *  @param {HookTarget} target The target element to observe
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 *  @example
 *  const { entries } = useResizeObserver(ref);
 */
export const useResizeObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseResizeObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entries, setEntries] = useState<ResizeObserverEntry[]>([]);

  const internalRef = useRefState<Element>();
  const internalOnChangeRef = useRef<UseResizeObserverOptions['onChange']>(options?.onChange);
  internalOnChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setEntries(entries);
      internalOnChangeRef.current?.(entries, observer);
    });
    observer.observe(element as Element, options);

    return () => {
      observer.disconnect();
    };
  }, [target, internalRef.state, options?.box, enabled]);

  if (target) return { entries };
  return {
    ref: internalRef,
    entries
  };
}) as UseResizeObserver;
