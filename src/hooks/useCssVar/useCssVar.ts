import { useState } from 'react';

import { useMutationObserver } from '../useMutationObserver';

/**
 * @name useCssVar
 * @description - Hook that returns the value of a CSS variable
 * @category Utilities
 *
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {string} The value of the CSS variable
 *
 * @example
 * const value = useCssVar('color', 'red');
 */
export const useCssVar = (key: string, initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const updateCssVar = () => {
    const value = window
      .getComputedStyle(window?.document?.documentElement)
      .getPropertyValue(key)
      ?.trim();

    setValue(value ?? initialValue);
  };

  useMutationObserver(updateCssVar, {
    attributeFilter: ['style', 'class']
  });

  return value;
};
