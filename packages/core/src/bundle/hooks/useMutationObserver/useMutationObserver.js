import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useMutationObserver
 * @description - Hook that gives you mutation observer state
 * @category Sensors
 * @usage low
 *
 * @browserapi MutationObserver https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {UseMutationObserverCallback} [options.onChange] The callback to execute when mutation is detected
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree] Set to true if mutations to not just target, but also target's descendants are to be observed
 * @returns {UseMutationObserverReturn} An object containing the mutation observer state
 *
 * @example
 * const { observer, stop } = useMutationObserver(ref, { childList: true });
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {UseMutationObserverCallback} [options.onChange] The callback to execute when mutation is detected
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree] Set to true if mutations to not just target, but also target's descendants are to be observed
 * @returns {UseMutationObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, observer, stop } = useMutationObserver({ childList: true });
 *
 * @overload
 * @template Target The target element
 * @param {UseMutationObserverCallback} callback The callback to execute when mutation is detected
 * @returns {UseMutationObserverReturn & { ref: StateRef<Target> }} A React ref to attach to the target element
 *
 * @example
 * const { ref, observer, stop } = useMutationObserver((mutations) => console.log(mutations));
 *
 * @overload
 * @param {UseMutationObserverCallback} callback The callback to execute when mutation is detected
 * @param {HookTarget} target The target element to observe
 * @returns {UseMutationObserverReturn} An object containing the mutation observer state
 *
 * @example
 * const { observer, stop } = useMutationObserver((mutations) => console.log(mutations), ref);
 */
export const useMutationObserver = (...params) => {
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
  const internalRef = useRefState();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const observer = new MutationObserver((mutations, observer) => {
      internalCallbackRef.current?.(mutations, observer);
    });
    setObserver(observer);
    observer.observe(element, options);
    return () => {
      observer.disconnect();
    };
  }, [
    target,
    internalRef.state,
    options?.childList,
    options?.attributes,
    options?.characterData,
    options?.subtree,
    options?.attributeOldValue,
    options?.characterDataOldValue,
    options?.attributeFilter,
    enabled
  ]);
  if (target) return { observer };
  return {
    ref: internalRef,
    observer
  };
};
