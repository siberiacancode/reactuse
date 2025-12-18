import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use focus options type */
export interface UseFocusOptions {
  /** The enabled state of the focus hook */
  enabled?: boolean;
  /** The initial focus state of the target */
  initialValue?: boolean;
  /** The on blur callback */
  onBlur?: (event: FocusEvent) => void;
  /** The on focus callback */
  onFocus?: (event: FocusEvent) => void;
}

/** The use focus return type */
export interface UseFocusReturn {
  /** The boolean state value of the target */
  focused: boolean;
  /** Blur the target */
  blur: () => void;
  /** Focus the target */
  focus: () => void;
}

export interface UseFocus {
  (target: HookTarget, callback?: (event: FocusEvent) => void): UseFocusReturn;

  (target: HookTarget, options?: UseFocusOptions): UseFocusReturn;

  <Target extends Element>(
    callback?: (event: FocusEvent) => void,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseFocusOptions,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };
}

/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref, () => console.log('focused'));
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref);
 *
 * @overload
 * @template Target The target element
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus(() => console.log('focused'));
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus();
 */
export const useFocus = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onFocus: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onFocus: params[0] }
  ) as UseFocusOptions | undefined;
  const enabled = options?.enabled ?? true;
  const initialValue = options?.initialValue ?? false;

  const [focused, setFocused] = useState(initialValue);
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const elementRef = useRef<HTMLElement | null>(null);

  const focus = () => {
    if (!elementRef.current) return;
    elementRef.current.focus();
    setFocused(true);
  };

  const blur = () => {
    if (!elementRef.current) return;
    elementRef.current.blur();
    setFocused(false);
  };

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    elementRef.current = element;

    const onFocus = (event: FocusEvent) => {
      internalOptionsRef.current?.onFocus?.(event);
      if (!focus || (event.target as HTMLElement).matches?.(':focus-visible')) setFocused(true);
    };

    const onBlur = (event: FocusEvent) => {
      internalOptionsRef.current?.onBlur?.(event);
      setFocused(false);
    };

    if (initialValue) element.focus();

    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    return () => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    };
  }, [target, internalRef.state, enabled, isTarget.getRefState(target)]);

  if (target) return { focus, blur, focused };
  return {
    ref: internalRef,
    focus,
    blur,
    focused
  };
}) as UseFocus;
