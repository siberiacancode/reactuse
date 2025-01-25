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
  /** HTML attribute applying the target element */
  attribute?: string;
  /**  Disable transition on switch */
  disableTransition?: boolean;
  /** The initial color mode */
  initialValue?: BasicColorMode | MODE;
  /** Prefix when adding value to the attribute */
  modes?: Record<BasicColorMode | MODE, string>;
  /** CSS Selector for the target element applying to */
  selector?: string;
  /** Storage object, can be localStorage or sessionStorage */
  storage?: 'localStorage' | 'sessionStorage';
  /** Key to persist the data into localStorage/sessionStorage. Pass `null` to disable persistence */
  storageKey?: string | null;
  /**A custom handler for handle the updates. When specified, the default behavior will be overridden */
  onChanged?: (
    mode: BasicColorMode | MODE,
    defaultHandler: (mode: BasicColorMode | MODE) => void
  ) => void;
}

/** The use color mode return type */
export interface UseColorModeReturn<MODE extends string = BasicColorMode> {
  /** The value of the auto mode */
  auto: BasicColorMode;
  /** The current color mode value */
  value: BasicColorMode | MODE;
  /** Function to set the color mode */
  set: (mode: BasicColorMode | MODE) => void;
}

/**
 * @name useColorMode
 * @description - Hook for get and set color mode (dark / light / customs) with auto data persistence.
 * @category Browser
 *
 * @param {UseColorModeOptions} options The options for configuring color mode hook.
 * @returns {UseColorModeReturn} The object containing the current color mode and a function to set the color mode.
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
    storage: _storage = 'localStorage',
    onChanged
  } = options ?? {};

  const storage = _storage === 'sessionStorage' ? sessionStorage : localStorage;

  const [value, setValue] = useState(
    storageKey
      ? (storage.getItem(storageKey) as BasicColorMode | MODE | null) || initialValue
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

  const auto = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  useEffect(() => {
    const mode = value !== 'auto' ? value : auto;

    if (storageKey) storage.setItem(storageKey, value);

    const defaultOnChanged = (mode: BasicColorMode | MODE) => updateHTMLAttrs(mode);

    onChanged ? onChanged(mode, defaultOnChanged) : defaultOnChanged(mode);
  }, [value, storage, storageKey, onChanged]);

  return { value, auto, set: setValue };
};
