import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The css variable return type */
export interface UseCssVarReturn {
  /** The value of the CSS variable */
  value: string;
  /** Remove the value of the CSS variable */
  remove: () => void;
  /** Set the value of the CSS variable */
  set: (value: string) => void;
}

export interface UseCssVar {
  <Target extends HTMLElement>(
    key: string,
    initialValue?: string
  ): UseCssVarReturn & {
    ref: StateRef<Target>;
  };

  (target: HookTarget, key: string, initialValue?: string): UseCssVarReturn;
}

/**
 * @name useCssVar
 * @description - Hook that returns the value of a css variable
 * @category Browser
 * @usage low

 * @overload
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn & { ref: StateRef<Element> }} The object containing the value of the CSS variable and ref
 *
 * @example
 * const { ref, value, set, remove } = useCssVar('--color', 'red');
 *
 * @overload
 * @param {HookTarget} target The target element
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn} The object containing the value of the CSS variable
 *
 * @example
 * const { value, set, remove } = useCssVar(ref, '--color', 'red');
 */
export const useCssVar = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const key = (target ? params[1] : params[0]) as string;
  const initialValue = (target ? params[2] : params[1]) as string | undefined;

  const [value, setValue] = useState(initialValue ?? '');
  const internalRef = useRefState<HTMLElement>();
  const elementRef = useRef<HTMLElement>(null);

  const set = (value: string) => {
    if (!elementRef.current) return;
    const element = elementRef.current;

    if (!element.style) return;
    element.style.setProperty(key, value);
    setValue(value);
  };

  const remove = () => {
    if (!elementRef.current) return;
    const element = elementRef.current;
    if (!element.style) return;

    element.style.removeProperty(key);
    setValue('');
  };

  useEffect(() => {
    if (!initialValue) return;

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as HTMLElement) ??
      window.document.documentElement;

    if (!element.style) return;
    element.style.setProperty(key, initialValue);
    setValue(initialValue);
  }, []);

  useEffect(() => {
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as HTMLElement) ??
      window.document.documentElement;

    elementRef.current = element;

    const onChange = () => {
      const value = window.getComputedStyle(element).getPropertyValue(key)?.trim();

      setValue(value ?? initialValue);
    };

    const observer = new MutationObserver(onChange);

    observer.observe(element, { attributeFilter: ['style', 'class'] });

    return () => {
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { value, set, remove };
  return { ref: internalRef, value, set, remove };
}) as UseCssVar;
