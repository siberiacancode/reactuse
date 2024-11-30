import { useEffect, useState } from 'react';

type UseTextDirectionValue = 'auto' | 'ltr' | 'rtl';

interface UseTextDirectionOptions {
  initialValue?: UseTextDirectionValue;
  observe?: boolean;
  selector?: string;
}

type UseTextDirectionReturn = [
  UseTextDirectionValue,
  (value: UseTextDirectionValue | null) => void
];

/**
 * @name useTextDirection
 * @description Hook that can get and set the direction of the element
 * @category Browser
 *
 * @param {string} [options.selector=html] The selector by which the element can be obtained
 * @param {boolean} [options.observe=false] The observe option if the element should be mutation observer
 * @param {UseTextDirectionValue} [options.initialValue=ltr] The initial value for direction of the element
 * @returns {UseTextDirectionReturn} An array containing the direction value and a function to set the direction value
 *
 * @example
 * const [dir, set] = useTextDirection();
 */

export const useTextDirection = (options: UseTextDirectionOptions = {}): UseTextDirectionReturn => {
  const { initialValue = 'ltr', selector = 'html', observe = false } = options;

  const getDir = () => {
    const element = document.querySelector(selector);
    return (element?.getAttribute('dir') as UseTextDirectionValue) ?? initialValue;
  };

  const [dir, setDir] = useState<UseTextDirectionValue>(getDir());

  const set = (value: UseTextDirectionValue | null) => {
    const element = document.querySelector(selector);

    if (!value) {
      element?.removeAttribute('dir');
      return;
    }

    setDir(value);
    element?.setAttribute('dir', value);
  };

  useEffect(() => {
    const element = document.querySelector(selector);

    if (observe && element) {
      const observer = new MutationObserver(() => {
        getDir();
      });

      observer.observe(element, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [selector, initialValue]);

  return [dir, set] as const;
};
