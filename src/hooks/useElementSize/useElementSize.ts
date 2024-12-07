import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

interface ElementSize {
  height: number;
  width: number;
}

type UseElementSizeTarget = RefObject<Element>;

type UseElementSizeReturn = ElementSize;

/**
 * @name useElementSize
 * @description - Hook that returns the width and height of the element
 * @category Elements
 *
 * @param {UseElementSizeTarget} target The target element to observe
 * @param {ElementSize} [initialSize] The initial size of the element
 * @returns {UseElementSizeReturn} An object containing the width and height of the element
 *
 * @example
 * const { width, height } = useElementSize(elementRef);
 */
export const useElementSize = (
  target: UseElementSizeTarget,
  initialSize: ElementSize = { height: 0, width: 0 }
): UseElementSizeReturn => {
  const [width, setWidth] = useState(initialSize.width);
  const [height, setHeight] = useState(initialSize.height);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];

      setWidth(width);
      setHeight(height);
    });

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return { width, height };
};
