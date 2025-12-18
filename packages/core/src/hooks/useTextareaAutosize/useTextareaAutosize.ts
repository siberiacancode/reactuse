import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use textarea autosize options */
export interface UseTextareaAutosizeOptions {
  /** The initial value for the textarea */
  initialValue?: string;
  /** Callback function called when the textarea size changes */
  onResize?: () => void;
}

/** The use textarea autosize return type */
export interface UseTextareaAutosizeReturn {
  /** The current value of the textarea */
  value: string;
  /** Function to clear the textarea value */
  clear: () => void;
  /** Function to set the textarea value */
  setValue: (value: string) => void;
}

export interface UseTextareaAutosize {
  (target: HookTarget, options?: UseTextareaAutosizeOptions): UseTextareaAutosizeReturn;

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    initialValue: string,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    options?: UseTextareaAutosizeOptions,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useTextareaAutosize
 * @description - Hook that automatically adjusts textarea height based on content
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target textarea element
 * @param {string} [options.initialValue] The initial value for the textarea
 * @param {Function} [options.onResize] Callback function called when the textarea size changes
 * @returns {UseTextareaAutosizeReturn} An object containing value, setValue and clear
 *
 * @example
 * const { value, setValue, clear } = useTextareaAutosize(ref);
 *
 * @overload
 * @template Target The textarea element type
 * @param {string} initialValue The initial value for the textarea
 * @returns {UseTextareaAutosizeReturn & { ref: StateRef<Target> }} An object containing ref, value, setValue and clear
 *
 * @example
 * const { ref, value, setValue, clear } = useTextareaAutosize('initial');
 *
 * @overload
 * @template Target The textarea element type
 * @param {string} [options.initialValue] The initial value for the textarea
 * @param {Function} [options.onResize] Callback function called when the textarea size changes
 * @returns {UseTextareaAutosizeReturn & { ref: StateRef<Target> }} An object containing ref, value, setValue and clear
 *
 * @example
 * const { ref, value, setValue, clear } = useTextareaAutosize();
 */
export const useTextareaAutosize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target ? params[1] : typeof params[0] === 'string' ? { initialValue: params[0] } : params[0]
  ) as UseTextareaAutosizeOptions | undefined;

  const [value, setValue] = useState(options?.initialValue ?? '');
  const internalRef = useRefState<HTMLTextAreaElement>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const onTextareaResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const originalMinHeight = textarea.style.minHeight;
    const originalMaxHeight = textarea.style.maxHeight;

    textarea.style.height = 'auto';
    textarea.style.minHeight = 'auto';
    textarea.style.maxHeight = 'none';

    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = `${scrollHeight}px`;
    textarea.style.minHeight = originalMinHeight;
    textarea.style.maxHeight = originalMaxHeight;

    options?.onResize?.();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLTextAreaElement;
    if (!element) return;

    textareaRef.current = element;
    if (options?.initialValue) element.value = options.initialValue;

    onTextareaResize();

    const onInput = (event: InputEvent) => {
      const newValue = (event.target as HTMLTextAreaElement).value;
      setValue(newValue);

      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };

    const onResize = () => {
      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };

    element.addEventListener('input', onInput as EventListener);
    element.addEventListener('resize', onResize as EventListener);

    return () => {
      element.removeEventListener('input', onInput as EventListener);
      element.removeEventListener('resize', onResize as EventListener);
    };
  }, [target, internalRef.state, isTarget.getRefState(target), options?.initialValue]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value = value;
    requestAnimationFrame(() => {
      onTextareaResize();
    });
  }, [value]);

  const setTextareaValue = (newValue: string) => {
    setValue(newValue);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.value = newValue;
      requestAnimationFrame(() => {
        onTextareaResize();
      });
    }
  };

  const clear = () => setValue('');

  if (target)
    return {
      value,
      setValue: setTextareaValue,
      clear
    };
  return {
    ref: internalRef,
    value,
    setValue: setTextareaValue,
    clear
  };
}) as UseTextareaAutosize;
