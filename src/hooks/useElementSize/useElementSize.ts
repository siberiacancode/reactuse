import type { RefObject } from 'react';

import { useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

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

/** The use element size target element type */
export type UseElementSizeTarget = string | Element | RefObject<Element | null | undefined>;

/** The use element size return type */
export interface UseElementSizeReturn {
  value: UseElementSizeValue;
}

export interface UseElementSize {
  <Target extends UseElementSizeTarget>(
    target: Target,
    initialValue?: UseElementSizeValue
  ): UseElementSizeReturn;

  <Target extends UseElementSizeTarget>(
    initialValue?: UseElementSizeValue,
    target?: never
  ): { ref: StateRef<Target> } & UseElementSizeReturn;
}

/**
 * @name useElementSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 *
 * @overload
 * @template Target The target element type
 * @param {UseElementSizeTarget} target The target element to observe
 * @param {UseElementSizeValue} [initialValue] The initial size of the element.
 * @returns {UseElementSizeReturn} An object containing the current width and height of the element
 *
 * @example
 * const { value } = useElementSize(ref);
 *
 * @overload
 * @param {UseElementSizeValue} [initialValue] The initial size of the element
 * @returns { { ref: StateRef<Target> } & UseElementSizeReturn } An object containing the current width and height of the element
 *
 * @example
 * const { ref, value } = useElementSize();
 */
export const useElementSize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseElementSizeTarget | undefined;
  const initialValue = (target ? params[1] : params[0]) as UseElementSizeValue | undefined;

  const [size, setSize] = useState(initialValue ?? { width: 0, height: 0 });
  const internalRef = useRefState<Element>();

  useIsomorphicLayoutEffect(() => {
    const element = (target ? getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const callback = () => {
      const rect = element.getBoundingClientRect();
      setSize((prev) => {
        if (prev.width !== rect.width || prev.height !== rect.height) {
          return {
            width: rect.width,
            height: rect.height
          };
        }
        return prev;
      });
    };

    const observer = new ResizeObserver(callback);
    observer.observe(element);
    callback();

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
