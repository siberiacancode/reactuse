import { useEffect, useState } from 'react';

import { useMutationObserver } from '../useMutationObserver/useMutationObserver';

/**
 * @name useActiveElement
 * @description - Hook that returns the active element
 * @category Elements
 *
 * @returns {ActiveElement | null} The active element
 *
 * @example
 * const activeElement = useActiveElement();
 */
export const useActiveElement = <ActiveElement extends HTMLElement>() => {
  const [activeElement, setActiveElement] = useState<ActiveElement | null>(null);

  useEffect(() => {
    const onActiveElementChange = () =>
      setActiveElement(document?.activeElement as ActiveElement | null);

    window.addEventListener('focus', onActiveElementChange, true);
    window.addEventListener('blur', onActiveElementChange, true);
    return () => {
      window.removeEventListener('focus', onActiveElementChange);
      window.removeEventListener('blur', onActiveElementChange);
    };
  });

  useMutationObserver(
    document as any,
    (mutations) => {
      mutations
        .filter((mutation) => mutation.removedNodes.length)
        .map((mutation) => Array.from(mutation.removedNodes))
        .flat()
        .forEach((node) => {
          if (node === activeElement)
            setActiveElement(document?.activeElement as ActiveElement | null);
        });
    },
    {
      childList: true,
      subtree: true
    }
  );

  return activeElement;
};
