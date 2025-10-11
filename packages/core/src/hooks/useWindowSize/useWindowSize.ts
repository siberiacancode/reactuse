import { useEffect, useState } from 'react';

/** The use window size return type */
interface UseWindowSizeParams {
  /** Whether to include the scrollbar in the window size calculation */
  includeScrollbar?: boolean;
}

/** The use window size return type */
export interface UseWindowSizeReturn {
  /** The current window height */
  height: number;
  /** The current window width */
  width: number;
}

/**
 * @name useWindowSize
 * @description - Hook that manages a window size
 * @category Elements
 * @usage low
 *
 * @param {number} [params.initialWidth=Number.POSITIVE_INFINITY] The initial window width
 * @param {number} [params.initialHeight=Number.POSITIVE_INFINITY] The initial window height
 * @returns {UseWindowSizeReturn} An object containing the current window width and height
 *
 * @example
 * const { width, height } = useWindowSize();
 */
export const useWindowSize = (params?: UseWindowSizeParams) => {
  const includeScrollbar = params?.includeScrollbar ?? true;
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        width: Number.POSITIVE_INFINITY,
        height: Number.POSITIVE_INFINITY
      };
    }

    return {
      width: includeScrollbar ? window.innerWidth : window.document.documentElement.clientWidth,
      height: includeScrollbar ? window.innerHeight : window.document.documentElement.clientHeight
    };
  });

  useEffect(() => {
    const onResize = () => {
      const { innerWidth, innerHeight, document } = window;
      const { clientWidth, clientHeight } = document.documentElement;

      setSize({
        width: includeScrollbar ? innerWidth : clientWidth,
        height: includeScrollbar ? innerHeight : clientHeight
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [params?.includeScrollbar]);

  return size;
};
