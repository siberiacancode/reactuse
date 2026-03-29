import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
 * @param {HookTarget} target The target textarea element
 * @param {string} initialValue The initial value for the textarea
 * @returns {UseTextareaAutosizeReturn} An object containing value, setValue and clear
 *
 * @example
 * const { value, setValue, clear } = useTextareaAutosize(ref, 'initial');
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
export const useTextareaAutosize = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target
    ? typeof params[1] === 'object'
      ? params[1]
      : { initialValue: params[1] }
    : typeof params[0] === 'object'
      ? params[0]
      : { initialValue: params[0] };
  const [value, setValue] = useState(options?.initialValue ?? '');
  const internalRef = useRefState();
  const textareaRef = useRef(null);
  const scrollHeightRef = useRef(0);
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
    if (scrollHeight !== scrollHeightRef.current) options?.onResize?.();
    scrollHeightRef.current = scrollHeight;
  };
  const setTextareaValue = (newValue) => {
    setValue(newValue);
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value = newValue;
    requestAnimationFrame(() => {
      onTextareaResize();
    });
  };
  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    textareaRef.current = element;
    if (options?.initialValue) element.value = options.initialValue;
    onTextareaResize();
    const onInput = (event) => {
      const newValue = event.target.value;
      setTextareaValue(newValue);
      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };
    const onResize = () => {
      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };
    element.addEventListener('input', onInput);
    element.addEventListener('resize', onResize);
    return () => {
      element.removeEventListener('input', onInput);
      element.removeEventListener('resize', onResize);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  const clear = () => setValue('');
  if (target)
    return {
      value,
      set: setTextareaValue,
      clear
    };
  return {
    ref: internalRef,
    value,
    set: setTextareaValue,
    clear
  };
};
