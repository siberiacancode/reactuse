import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

import { getElement, isTarget } from '@/utils/helpers';

import { useRefState } from '../useRefState/useRefState';
/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {Target} target The target element for fullscreen
 * @param {boolean} [options.initialValue] initial value of fullscreen
 * @param {() => void} [options.onEnter] on enter fullscreen
 * @param {() => void} [options.onExit] on exit fullscreen
 * @returns {UseFullScreenReturn} An object with the fullscreen state and methods
 *
 * @example
 * const { enter, exit, toggle, value } = useFullscreen(ref);
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {boolean} [options.initialValue] initial value of fullscreen
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
  const onChange = () => {
    if (!screenfull.isEnabled) return;
    if (screenfull.isFullscreen) {
      options?.onEnter?.();
    } else {
      screenfull.off('change', onChange);
      options?.onExit?.();
    }
    setValue(screenfull.isFullscreen);
  };
  const enter = () => {
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    if (screenfull.isEnabled) {
      try {
        screenfull.request(element);
        screenfull.on('change', onChange);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const exit = () => {
    if (screenfull.isEnabled) screenfull.exit();
  };
  const toggle = () => {
    if (value) return exit();
    enter();
  };
  useEffect(
    () => () => {
      if (screenfull.isEnabled) screenfull.off('change', onChange);
    },
    []
  );
  if (target)
    return {
      enter,
      exit,
      toggle,
      value
    };
  return {
    ref: internalRef,
    enter,
    exit,
    toggle,
    value
  };
};
