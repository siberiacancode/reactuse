import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The resize observer callback type */
export type UseResizeObserverCallback = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void;

/** The resize observer options type */
export interface UseResizeObserverOptions extends ResizeObserverOptions {
  /** The enabled state of the resize observer */
  enabled?: boolean;
  /** The callback to execute when resize is detected */
  onChange?: UseResizeObserverCallback;
}

/** The resize observer return type */
export interface UseResizeObserverReturn {
  /** The resize observer entries */
  entry: ResizeObserverEntry;
  /** The resize observer instance */
  observer?: ResizeObserver;
}

export interface UseResizeObserver {
  <Target extends Element>(
    options?: UseResizeObserverOptions,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, options?: UseResizeObserverOptions): UseResizeObserverReturn;

  <Target extends Element>(
    callback: UseResizeObserverCallback,
    target?: never
  ): UseResizeObserverReturn & { ref: StateRef<Target> };

  (target: HookTarget, callback: UseResizeObserverCallback): UseResizeObserverReturn;
}

/**
 * @name useResizeObserver
 * @description - Hook that gives you resize observer state
 * @category Sensors
 * @usage low
 *
 * @browserapi ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {boolean} [options.enabled=true] The enabled state of the resize observer
 * @param {ResizeObserverBoxOptions} [options.box] The box model to observe
 * @param {UseResizeObserverCallback} [options.onChange] The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 * @example
 * const { entries, observer } = useResizeObserver(ref);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the resize observer
 * @param {ResizeObserverBoxOptions} [options.box] The box model to observe
 * @param {UseResizeObserverCallback} [options.onChange] The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entry, observer } = useResizeObserver();
 *
 * @overload
 * @template Target The target element
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entry, observer } = useResizeObserver((entry) => console.log(entry));
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 * @example
 * const { entry, observer } = useResizeObserver(ref, (entry) => console.log(entry));
 */
export const useResizeObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onChange: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onChange: params[0] }
  ) as UseResizeObserverOptions | undefined;

  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<ResizeObserverEntry>();
  const [observer, setObserver] = useState<ResizeObserver>();

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry], observer) => {
      setEntry(entry);
      internalCallbackRef.current?.(entry, observer);
    });

    setObserver(observer);
    observer.observe(element as Element, options);

    return () => {
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, options?.box, enabled]);

  if (target) return { entry, observer };
  return {
    ref: internalRef,
    entry,
    observer
  };
}) as UseResizeObserver;
