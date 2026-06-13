import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
 * const { ref, entries, observer } = useResizeObserver();
 *
 * @overload
 * @template Target The target element
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useResizeObserver((entries) => console.log(entries));
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {UseResizeObserverCallback} callback The callback to execute when resize is detected
 * @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 * @example
 * const { entries, observer } = useResizeObserver(ref, (entries) => console.log(entries));
 */
export const useResizeObserver = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { onChange: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { onChange: params[0] };
  const callback = options?.onChange;
  const enabled = options?.enabled ?? true;
  const [observer, setObserver] = useState();
  const [entries, setEntries] = useState();
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries, observer) => {
      setEntries(entries);
      internalCallbackRef.current?.(entries, observer);
    });
    setObserver(observer);
    observer.observe(element, options);
    return () => {
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, options?.box, enabled]);
  if (target) return { observer, entries };
  return {
    ref: internalRef,
    observer,
    entries
  };
};
