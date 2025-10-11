import { useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useElementSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 * @usage low

 * @overload
 * @param {HookTarget} target The target element to observe
 * @returns {UseElementSizeReturn} An object containing the current width and height of the element
 *
 * @example
 * const { value } = useElementSize(ref);
 *
 * @overload
 * @returns { { ref: StateRef<Target> } & UseElementSizeReturn } An object containing the current width and height of the element
 *
 * @example
 * const { ref, value } = useElementSize();
 */
export const useElementSize = (...params) => {
  const target = params[0];
  const [size, setSize] = useState({ width: 0, height: 0 });
  const internalRef = useRefState();
  useIsomorphicLayoutEffect(() => {
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    setSize({
      width,
      height
    });
    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      setSize({ width, height });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [internalRef.current, target]);
  if (target) return { value: size };
  return {
    ref: internalRef,
    value: size
  };
};
