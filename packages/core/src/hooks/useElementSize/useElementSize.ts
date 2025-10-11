import { useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The element size value type */
export interface UseElementSizeValue {
  /** The element's height */
  height: number;
  /** The element's width */
  width: number;
}

/** The use element size return type */
export interface UseElementSizeReturn {
  value: UseElementSizeValue;
}

export interface UseElementSize {
  (target: HookTarget): UseElementSizeReturn;

  <Target extends Element>(
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseElementSizeReturn;
}

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
export const useElementSize = ((...params: any[]) => {
  const target = params[0] as HookTarget | undefined;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const internalRef = useRefState<Element>();

  useIsomorphicLayoutEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

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
}) as UseElementSize;
