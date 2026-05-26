import { useEffect, useRef, useState } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 * @usage low
 *
 * @browserapi Fullscreen API https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 *
 * @overload
 * @param {HookTarget} target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn} An object with the fullscreen state and methods
 *
 * @example
 * const { enter, exit, toggle, value } = useFullscreen(ref);
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {boolean} [options.initialValue=false] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn & { ref: RefObject<Target> }} An object with the fullscreen state and methods
 *
 * @example
 * const { ref, enter, exit, toggle, value } = useFullscreen();
 */
export const useFullscreen = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = target ? params[1] : params[0];
  const [value, setValue] = useState(options?.initialValue ?? false);
  const internalRef = useRefState();
  const elementRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const enter = () => {
    const element = elementRef.current;
    if (!element) return;
    element.requestFullscreen();
  };
  const exit = () => {
    if (!document.fullscreenElement) return;
    document.exitFullscreen();
  };
  const toggle = () => {
    if (value) return exit();
    enter();
  };
  useEffect(() => {
    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;
    elementRef.current = element;
    const onChange = () => {
      const active = document.fullscreenElement === elementRef.current;
      setValue((currentValue) => {
        if (!currentValue && active) optionsRef.current?.onEnter?.();
        if (currentValue && !active) optionsRef.current?.onExit?.();
        return active;
      });
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return { enter, exit, toggle, value };
  return { ref: internalRef, enter, exit, toggle, value };
};
