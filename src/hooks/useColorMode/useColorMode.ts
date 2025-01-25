import { useEffect, useState } from 'react';

const CSS_DISABLE_TRANS = `
  *, *::before, *::after {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    -ms-transition: none !important;
    transition: none !important;
  }
`;

export type BasicColorMode = 'auto' | 'dark' | 'light';

/** The use color mode options */
export interface UseColorModeOptions<MODE extends string = BasicColorMode> {
  attribute?: string;
  disableTransition?: boolean;
  emitAuto?: boolean;
  initialValue?: BasicColorMode | MODE;
  modes?: Record<BasicColorMode | MODE, string>;
  selector?: string;
  storageKey?: string | null;
  onChanged?: (
    mode: BasicColorMode | MODE,
    defaultHandler: (mode: BasicColorMode | MODE) => void
  ) => void;
}

/** The use color mode return type */
export type UseColorModeReturn<T extends string = BasicColorMode> = BasicColorMode | T;

/**
 * @name useColorMode
 * @description - Hook for recording the timestamp of the last change
 * @category Browser
 *
 * @param {UseColorModeOptions} options The options for configuring color mode behavior.
 * @returns {UseColorModeReturn} The current color mode value.
 */
export const useColorMode = <MODE extends string = BasicColorMode>(
  options?: UseColorModeOptions<MODE>
) => {
  const {
    selector = 'html',
    attribute = 'class',
    disableTransition = true,
    initialValue = 'auto',
    storageKey = 'reactuse-color-scheme',
    modes = {},
    onChanged
  } = options ?? {};

  const [value, setValue] = useState(
    storageKey
      ? (localStorage.getItem(storageKey) as BasicColorMode | MODE | null) || initialValue
      : initialValue
  );

  const updateHTMLAttrs = (mode: string) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const modeClasses = [...Object.values(modes), 'auto', 'dark', 'light'] as (
      | BasicColorMode
      | MODE
    )[];

    if (attribute === 'class') {
      element.classList.remove(...modeClasses);
      element.classList.add(mode);
    } else {
      element.setAttribute(attribute, mode);
    }

    if (disableTransition) {
      const style = document.createElement('style');
      style.textContent = CSS_DISABLE_TRANS;

      document.head.appendChild(style);

      (() => getComputedStyle(style).opacity)();

      document.head.removeChild(style);
    }
  };

  useEffect(() => {
    const mode =
      value !== 'auto'
        ? value
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    if (storageKey) localStorage.setItem(storageKey, value);

    const defaultOnChanged = (mode: BasicColorMode | MODE) => updateHTMLAttrs(mode);

    onChanged ? onChanged(mode, defaultOnChanged) : defaultOnChanged(mode);
  }, [value]);

  return { value, set: setValue };
};
