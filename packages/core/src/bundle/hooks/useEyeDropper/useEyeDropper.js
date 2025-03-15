import { useState } from 'react';
/**
 * @name useEyeDropper
 * @description - Hook that gives you access to the eye dropper
 * @category Browser
 *
 * @browserapi EyeDropper https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
 *
 * @param {string} [initialValue=undefined] The initial value for the eye dropper
 * @returns {UseEyeDropperReturn} An object containing the supported status, the value and the open method
 *
 * @example
 * const { supported, value, open } = useEyeDropper();
 */
export const useEyeDropper = (initialValue = undefined) => {
  const supported = typeof window !== 'undefined' && 'EyeDropper' in window;
  const [value, setValue] = useState(initialValue);
  const open = async (colorSelectionOptions) => {
    if (!window.EyeDropper) throw new Error('EyeDropper is not supported');
    const eyeDropper = new window.EyeDropper();
    const result = await eyeDropper.open(colorSelectionOptions);
    setValue(result.sRGBHex);
    return result;
  };
  return {
    supported,
    value,
    open
  };
};
