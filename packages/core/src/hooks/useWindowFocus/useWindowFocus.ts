import { useEffect, useState } from 'react';

/**
 * @name useWindowFocus
 * @description - Hook that provides the current focus state of the window
 * @category Elements
 *
 * @returns {boolean} The current focus state of the window
 *
 * @example
 * const focused = useWindowFocus();
 */
export const useWindowFocus = () => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  });

  return focused;
};
