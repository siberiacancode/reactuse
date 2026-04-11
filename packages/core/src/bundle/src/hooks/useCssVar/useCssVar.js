import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const useCssVar = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const key = target ? params[1] : params[0];
  const initialValue = target ? params[2] : params[1];
  const [value, setValue] = useState(initialValue ?? '');
  const internalRef = useRefState();
  const elementRef = useRef(null);
  const set = (value) => {
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
      (target ? isTarget.getElement(target) : internalRef.current) ??
      window.document.documentElement;
    if (!element.style) return;
    element.style.setProperty(key, initialValue);
    setValue(initialValue);
  }, []);
  useEffect(() => {
    const element =
      (target ? isTarget.getElement(target) : internalRef.current) ??
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
};
