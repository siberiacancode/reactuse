import type { RefObject } from 'react';

import { getElement } from '@/utils/helpers';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useMutationObserver } from '../useMutationObserver/useMutationObserver';
import type { UseStorageInitialValue, UseStorageOptions } from '../useStorage/useStorage';
import { useStorage } from '../useStorage/useStorage';

export type BasicColorMode = 'light' | 'dark';
export type BasicColorSchema = BasicColorMode | 'auto';

const memoryStorageMap = new Map<BasicColorSchema, string>();
const memoryStorage = {
  getItem: (key: BasicColorSchema) => memoryStorageMap.get(key) ?? null,
  setItem: (key: BasicColorSchema, value: string) => memoryStorageMap.set(key, value),
  removeItem: (key: BasicColorSchema) => memoryStorageMap.delete(key),
  length: memoryStorageMap.size,
  key: () => null,
  clear: () => memoryStorageMap.clear()
};
const CSS_DISABLE_TRANS = '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}';

export type UseColorModeTarget =
  | RefObject<Element | null | undefined>
  | (() => Element)
  | Element;

/** The use color mode return type */
export type UseColorModeReturn<T extends string = BasicColorMode> = [
  /** Current color mode  */
  string | undefined,
  /** Function to set the color mode */
  (value: T) => void
];

export interface UseColorModeOptions<
  T extends string = BasicColorMode,
  Target extends UseColorModeTarget = UseColorModeTarget
>
  extends UseStorageOptions<T | BasicColorMode> {
  /** Target element applying to */
  target?: Target;
  /** HTML attribute applying the target element */
  attribute?: string;
  /** The initial color mode */
  initialValue?: UseStorageInitialValue<T | BasicColorMode>;
  /** Prefix when adding value to the attribute */
  modes?: Partial<Record<T | BasicColorSchema, string>>;
  /** A custom handler for handle the updates. When specified, the default behavior will be overridden. */
  storageKey?: string | null;
  /** Storage object, can be localStorage or sessionStorage */
  storage?: Storage;
  /** Disable CSS transitions */
  disableTransition?: boolean;
}

/**
 * @name useColorMode
 * @description - Hook that work with color mode
 * @category Utilities
 *
 * @template T The color mode type
 * @template Target The target element
 * @param {Target} [options.target=document.documentElement] The target element applying to
 * @param {string} [options.attribute='class'] HTML attribute applying the target element
 * @param {string} [options.initialValue='auto'] The initial color mode
 * @param {Record<string, string>} [options.modes={light: 'light', dark: 'dark', auto: ''}] The color modes
 * @param {string} [options.storageKey='reactuse-color-scheme'] Prefix when adding value to the attribute
 * @param {Storage} [options.storage=localStorage] Storage object
 * @param {boolean} [options.disableTransition=true] Disable CSS transitions
 * @returns {UseColorModeReturn} An object containing the color mode
 *
 * @example
 * const {mode, setMode} = useColorMode();
 */
export const useColorMode = <
  T extends string = BasicColorMode,
  Target extends UseColorModeTarget = UseColorModeTarget
> (options?: UseColorModeOptions<T, Target>): UseColorModeReturn<T | BasicColorSchema> => {
  const {
    target = document.documentElement,
    attribute = 'class',
    initialValue = 'auto',
    storageKey = 'reactuse-color-scheme',
    storage,
    modes = {},
    disableTransition = true
  } = options ?? {};

  const possibleModes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...(modes || {})
  } as Record<BasicColorSchema | T, string>;

  const calculatedStorage = !storage && storageKey === null ? memoryStorage : storage;
  const { value: mode, set } = useStorage(storageKey ?? '', { initialValue, storage: calculatedStorage });

  useMutationObserver(target, () => {
    const element = getElement(target) as HTMLElement | null | undefined;
    if (!element) {
      return;
    }

    const attributeValue = element.getAttribute(attribute);

    if (attributeValue && attributeValue in possibleModes) {
      set(possibleModes[attributeValue as BasicColorMode | T]);
    } else {
      set('light');
    }
  }, {
    attributes: true
  });

  const setMode = (value: BasicColorSchema | T) => {
    if (value === 'auto') {
      const media = window?.matchMedia('(prefers-color-scheme: dark)');
      value = media?.matches ? 'dark' : 'light';
    }

    const element = getElement(target) as HTMLElement | null | undefined;

    if (element) {
      const attributeValue = possibleModes[value];
      element.setAttribute(attribute, attributeValue);
    }

    set(possibleModes[value]);

    if (disableTransition) {
      const style = window.document.createElement('style');
      style.appendChild(document.createTextNode(CSS_DISABLE_TRANS));
      window.document.head.appendChild(style);
      // Calling getComputedStyle forces the browser to redraw
      const _ = window.getComputedStyle(style).opacity;
      document.head.removeChild(style!);
    }
  };

  useIsomorphicLayoutEffect(() => {
    setMode(mode as T | BasicColorMode);
  }, []);

  return [
    mode,
    setMode
  ];
};
