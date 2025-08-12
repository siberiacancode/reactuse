import { useEffect, useState } from 'react';
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
export const useWindowSize = (params) => {
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
      if (includeScrollbar) {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        setSize({
          width: window.document.documentElement.clientWidth,
          height: window.document.documentElement.clientHeight
        });
      }
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [params?.includeScrollbar]);
  return size;
};
