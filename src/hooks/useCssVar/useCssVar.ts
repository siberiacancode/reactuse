import type { RefObject } from 'react';

import { useState } from 'react';

import { getElement } from '@/utils/helpers';

import { useMount } from '../useMount/useMount';
import { useMutationObserver } from '../useMutationObserver/useMutationObserver';

/** The css variable target element type */
export type UseCssVarTarget =
  | (() => Element)
  | Element
  | RefObject<Element | null | undefined>
  | undefined;

/** The css variable return type */
export interface UseCssVarReturn {
  /** The value of the CSS variable */
  value: string;
  /** Set the value of the CSS variable */
  set: (value: string) => void;
}

export interface UseCssVar {
  (key: string, initialValue?: string): UseCssVarReturn;

  <Target extends UseCssVarTarget>(
    target: Target,
    key: string,
    initialValue?: string
  ): UseCssVarReturn;
}

/**
 * @name useCssVar
 * @description - Hook that returns the value of a CSS variable
 * @category Utilities
 *
 * @overload
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn} The object containing the value of the CSS variable
 *
 * @example
 * const { value, set } = useCssVar('color', 'red');
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn} The object containing the value of the CSS variable
 *
 * @example
 * const { value, set } = useCssVar(ref, 'color', 'red');
 */
export const useCssVar = ((...params: any[]) => {
  const target = (typeof params[0] === 'object' ? params[0] : undefined) as
    | UseCssVarTarget
    | undefined;
  const key = (target ? params[1] : params[0]) as string;
  const initialValue = (target ? params[2] : params[1]) as string | undefined;

  const [value, setValue] = useState(initialValue ?? '');

  const set = (value: string) => {
    const element = getElement(target ?? window?.document?.documentElement) as HTMLElement;

    if (element.style) {
      if (!value) {
        element.style.removeProperty(key);
        setValue(value);
        return;
      }

      element.style.setProperty(key, value);
      setValue(value);
    }
  };

  const updateCssVar = () => {
    const element = getElement(target ?? window?.document?.documentElement) as HTMLElement;
    if (!element) return;

    const value = window
      .getComputedStyle(element as Element)
      .getPropertyValue(key)
      ?.trim();

    setValue(value ?? initialValue);
  };

  useMount(() => {
    if (initialValue) set(initialValue);
  });

  useMutationObserver(window, updateCssVar, {
    attributeFilter: ['style', 'class']
  });

  return {
    value,
    set
  };
}) as UseCssVar;
