import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

import { getElement } from '@/utils/helpers';

interface ElementSize {
  height: number;
  width: number;
}

/** The use element size target element type */
export type UseElementSizeTarget =
  | (() => Element)
  | Element
  | RefObject<Element | null | undefined>;

export interface UseElementSizeReturn {
  value: ElementSize;
}

export interface UseElementSize {
  <Target extends UseElementSizeTarget>(
    target: Target,
    initialSize?: ElementSize
  ): UseElementSizeReturn;

  <Target extends UseElementSizeTarget>(
    initialSize?: ElementSize,
    target?: never
  ): { ref: (node: Target) => void } & UseElementSizeReturn;
}

/**
 * @name useElementSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 *
 * @overload
 * @template Target The target element type.
 * @param {UseElementSizeTarget} target The target element to observe.
 * @param {ElementSize} [initialSize = { width: 0, height: 0 }]
 * @returns {UseElementSizeReturn} An object containing the current width and height of the element.
 *
 * @example
 * const { value } = useElementSize(elementRef);
 *
 * @overload
 * @param {ElementSize} [initialSize = { width: 0, height: 0 }] The initial size of the element.
 * @returns { { ref: (node: Target) => void } & UseElementSizeReturn } A reference function to attach to the element to observe size changes.
 *
 * @example
 * const { ref, value } = useElementSize({ width: 100, height: 100 });
 */
export const useElementSize = ((...params: any[]) => {
  const target = (typeof params[1] === 'undefined' ? undefined : params[0]) as
    | UseElementSizeTarget
    | undefined;

  const initialSize = (target ? params[1] : params[0]) as ElementSize | undefined;

  const [size, setSize] = useState(initialSize ?? { width: 0, height: 0 });
  const [internalRef, setInternalRef] = useState<Element>();

  useEffect(() => {
    if (!target && !internalRef) return;
    const element = (target ? getElement(target) : internalRef) as Element;

    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];

      setSize({ width, height });
    });

    if (element) observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [internalRef, target]);

  if (target) return { value: size };
  return { ref: setInternalRef, value: size };
}) as UseElementSize;
