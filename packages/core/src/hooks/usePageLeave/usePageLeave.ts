import { useEffect, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 * @category Sensors
 * @usage low
 *
 * @param {() => void} [callback] The callback function what calls then mouse leaves the page
 * @returns {boolean} A boolean which determines if the mouse left the page
 *
 * @example
 * const isLeft = usePageLeave(() => console.log('on leave'))
 */
export const usePageLeave = (callback?: () => void) => {
  const [isLeft, setIsLeft] = useState(false);

  const onMouse = useEvent(() => {
    if (isLeft) return setIsLeft(false);
    callback?.();
    setIsLeft(true);
  });

  useEffect(() => {
    document.addEventListener('mouseleave', onMouse, { passive: true });
    document.addEventListener('mouseenter', onMouse, { passive: true });

    return () => {
      document.removeEventListener('mouseenter', onMouse);
      document.removeEventListener('mouseleave', onMouse);
    };
  }, []);

  return isLeft;
};
