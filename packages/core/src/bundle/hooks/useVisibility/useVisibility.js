import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useVisibility
 * @description - Hook that gives you visibility observer state
 * @category Sensors
 * @usage medium
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @param {HookTarget} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The Intersection options
 * @param {((entries: IntersectionEntry[], observer: Intersection) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseVisibilityReturn} An object containing the state
 *
 * @example
 * const { ref, entries, observer } = useVisibility();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The Intersection options
 * @param {((entries: IntersectionEntry[], observer: Intersection) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root=document] The root element to observe
 * @returns {UseVisibilityReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { entries, observer } = useVisibility(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseVisibilityCallback} callback The callback to execute when intersection is detected
 * @returns {UseVisibilityReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, entries, observer } = useVisibility(() => console.log('callback'));
 *
 * @overload
 * @param {UseVisibilityCallback} callback The callback to execute when intersection is detected
 * @param {HookTarget} target The target element to detect intersection
 * @returns {UseVisibilityReturn} An object containing the state
 *
 * @example
 * const { entries, observer } = useVisibility(ref, () => console.log('callback'));
 */
export const useVisibility = (...params) => {
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
  const [entry, setEntry] = useState();
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const entry = entries.pop();
        setEntry(entry);
        internalCallbackRef.current?.(entry, observer);
      },
      {
        ...options,
        root: options?.root ? isTarget.getElement(options.root) : document
      }
    );
    setObserver(observer);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [
    target,
    internalRef.state,
    isTarget.getRefState(target),
    options?.rootMargin,
    options?.threshold,
    options?.root,
    enabled
  ]);
  if (target) return { observer, entry, inView: !!entry?.isIntersecting };
  return {
    observer,
    ref: internalRef,
    entry,
    inView: !!entry?.isIntersecting
  };
};
