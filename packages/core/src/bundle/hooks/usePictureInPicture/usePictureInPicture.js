import { useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
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
export const usePictureInPicture = (...params) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (target ? params[1] : params[0]) ?? {};
  const [open, setOpen] = useState(false);
  const internalRef = useRefState();
  const supported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;
  const enter = async () => {
    if (!supported) return;
    const element = target ? getElement(target) : internalRef.current;
    if (!element) return;
    await element.requestPictureInPicture();
    setOpen(true);
    options.onEnter?.();
  };
  const exit = async () => {
    if (!supported) return;
    await document.exitPictureInPicture();
    setOpen(false);
    options.onExit?.();
  };
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
};
