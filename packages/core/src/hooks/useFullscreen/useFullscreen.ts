import type { RefObject } from 'react';

import { useEffect, useState } from 'react';
import screenfull from 'screenfull';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use fullscreen target element type */
export type UseFullScreenTarget = string | Element | RefObject<Element | null | undefined>;

/** The use fullscreen options type */
export interface UseFullScreenOptions {
  /** initial value */
  initialValue?: boolean;
  /** on enter fullscreen */
  onEnter?: () => void;
  /** on exit fullscreen */
  onExit?: () => void;
}

/** The use click outside return type */
export interface UseFullScreenReturn {
  /** The fullscreen state */
  value: boolean;
  /** The fullscreen enter method */
  enter: () => void;
  /** The fullscreen exit method */
  exit: () => void;
  /** The fullscreen toggle method */
  toggle: () => void;
}

export interface UseFullScreen {
  <Target extends UseFullScreenTarget>(
    target: Target,
    options?: UseFullScreenOptions
  ): UseFullScreenReturn;

  <Target extends UseFullScreenTarget>(
    options?: UseFullScreenOptions,
    target?: never
  ): UseFullScreenReturn & { ref: StateRef<Target> };
}

/**
 * @name useFullscreen
 * @description - Hook to handle fullscreen events
 * @category Browser
 *
 * @overload
 * @template Target The target element for fullscreen
 * @param {Target} target The target element for fullscreen
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
export const useFullscreen = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as UseFullScreenTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseFullScreenOptions | undefined;

  const [value, setValue] = useState(options?.initialValue ?? false);
  const internalRef = useRefState<Element>();

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
    const element = (target ? getElement(target) : internalRef.current) as Element;
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
}) as UseFullScreen;
