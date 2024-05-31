import React from 'react';

/**
 * @name usePageLeave
 * @description - Hook what calls given function when mouse leaves the page
 *
 * @param {() => void} onPageLeave The callback function what calls then mouse leaves the page
 *
 * @example
 * usePageLeave(callbackFn)
 */

export function usePageLeave(onPageLeave: () => void) {
  React.useEffect(() => {
    document.documentElement.addEventListener('mouseleave', onPageLeave);
    return () => document.documentElement.removeEventListener('mouseleave', onPageLeave);
  }, []);
}
