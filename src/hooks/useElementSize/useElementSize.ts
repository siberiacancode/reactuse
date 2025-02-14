import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

import type { HookRef } from '@/utils/helpers';

import { createHookRef, getElement, isTarget } from '@/utils/helpers';

//* The element size value type */
export interface UseElementSizeValue {
  height: number;
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
  ): { ref: HookRef<Target> } & UseElementSizeReturn;
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
 * @returns { { ref: (node: Target) => void } & UseElementSizeReturn } An object containing the current width and height of the element
 *
 * @example
 * const { ref, value } = useElementSize();
 */
export const useElementSize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseElementSizeTarget | undefined;
  const initialValue = (target ? params[1] : params[0]) as UseElementSizeTarget | undefined;
  const [size, setSize] = useState(initialValue ?? { width: 0, height: 0 });
  const [internalRef, setInternalRef] = useState<Element>();

  useEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    if (element) observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [internalRef, target]);

  if (target) return { value: size };
  return {
    ref: createHookRef(internalRef, setInternalRef),
    value: size
  };
}) as UseElementSize;
