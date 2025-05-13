import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useIntersectionObserver
 * @description - Hook that gives you intersection observer state
 * @category Browser
 *
 * @browserapi IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * @overload
 * @param {HookTarget} target The target element to detect intersection
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn} An object containing the state
 *
 * @example
 * const { ref, entry, inView } = useIntersectionObserver();
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The IntersectionObserver options
 * @param {((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) | undefined} [options.onChange] The callback to execute when intersection is detected
 * @param {HookTarget} [options.root] The root element to observe
 * @returns {UseIntersectionObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { entry, inView } = useIntersectionObserver(ref);
 */
export const useIntersectionObserver = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target ? params[1] : params[0];
  const enabled = options?.enabled ?? true;
  const [entry, setEntry] = useState();
  const internalRef = useRefState();
  const internalOnChangeRef = useRef(options?.onChange);
  internalOnChangeRef.current = options?.onChange;
  useEffect(() => {
    if (!enabled && !target && !internalRef.state) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        internalOnChangeRef.current?.(entry);
      },
      {
        ...options,
        root: options?.root ? getElement(options.root) : document
      }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [target, internalRef.state, options?.rootMargin, options?.threshold, options?.root, enabled]);
  if (target) return { entry, inView: !!entry?.isIntersecting };
  return {
    ref: internalRef,
    entry,
    inView: !!entry?.isIntersecting
  };
};
