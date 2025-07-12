import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use picture in picture options type */
export interface UsePictureInPictureOptions {
  /** The callback when Picture-in-Picture mode is entered */
  onEnter?: () => void;
  /** The callback when Picture-in-Picture mode is exited */
  onExit?: () => void;
}

/** The use picture in picture return type */
export interface UsePictureInPictureReturn {
  /** Whether Picture-in-Picture mode is currently active */
  open: boolean;
  /** Whether Picture-in-Picture mode is supported by the browser */
  supported: boolean;
  /** Request to enter Picture-in-Picture mode */
  enter: () => Promise<void>;
  /** Request to exit Picture-in-Picture mode */
  exit: () => Promise<void>;
  /** Toggle Picture-in-Picture mode */
  toggle: () => Promise<void>;
}

export interface UsePictureInPicture {
  (target: HookTarget, options?: UsePictureInPictureOptions): UsePictureInPictureReturn;

  (options?: UsePictureInPictureOptions): UsePictureInPictureReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}

/**
 * @name usePictureInPicture
 * @description - Hook that provides Picture-in-Picture functionality for video elements
 * @category Browser
 *
 * @browserapi window.PictureInPicture https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API
 *
 * @overload
 * @param {HookTarget} target The target video element
 * @param {() => void} [options.onEnter] Callback when Picture-in-Picture mode is entered
 * @param {() => void} [options.onExit] Callback when Picture-in-Picture mode is exited
 * @returns {UsePictureInPictureReturn} An object containing Picture-in-Picture state and controls
 *
 * @example
 * const { open, supported, enter, exit, toggle } = usePictureInPicture(videoRef);
 *
 * @overload
 * @param {() => void} [options.onEnter] Callback when Picture-in-Picture mode is entered
 * @param {() => void} [options.onExit] Callback when Picture-in-Picture mode is exited
 * @returns {UsePictureInPictureReturn & { ref: StateRef<HTMLVideoElement> }} An object containing Picture-in-Picture state, controls and ref
 *
 * @example
 * const { ref, open, supported, enter, exit, toggle } = usePictureInPicture();
 */
export const usePictureInPicture = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UsePictureInPictureOptions) ?? {};

  const [open, setOpen] = useState(false);

  const internalRef = useRefState<HTMLVideoElement>();
  const elementRef = useRef<HTMLVideoElement>(null);
  const onOptionsRef = useRef<UsePictureInPictureOptions>(options);
  onOptionsRef.current = options;

  const supported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;

  const enter = async () => {
    if (!supported) return;

    if (!elementRef.current) return;

    await elementRef.current.requestPictureInPicture();
    setOpen(true);

    options.onEnter?.();
  };

  const exit = async () => {
    if (!supported) return;

    await document.exitPictureInPicture();
    setOpen(false);
    options.onExit?.();
  };

  useEffect(() => {
    const element = target ? (getElement(target) as HTMLVideoElement) : internalRef.current;
    if (!element) return;

    elementRef.current = element;

    const onEnterPictureInPicture = () => {
      setOpen(true);
      onOptionsRef.current.onEnter?.();
    };

    const onLeavePictureInPicture = () => {
      setOpen(false);
      onOptionsRef.current.onExit?.();
    };

    element.addEventListener('enterpictureinpicture', onEnterPictureInPicture);
    element.addEventListener('leavepictureinpicture', onLeavePictureInPicture);

    return () => {
      element.removeEventListener('enterpictureinpicture', onEnterPictureInPicture);
      element.removeEventListener('leavepictureinpicture', onLeavePictureInPicture);
    };
  }, [target]);

  const toggle = async () => {
    if (open) await exit();
    else await enter();
  };

  const value = {
    open,
    supported,
    enter,
    exit,
    toggle
  };

  if (target) return value;
  return { ...value, ref: internalRef };
}) as UsePictureInPicture;
