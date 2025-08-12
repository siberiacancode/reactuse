import { useState } from 'react';

export interface ColorSelectionOptions {
  signal?: AbortSignal;
}

export interface ColorSelectionResult {
  sRGBHex: string;
}

export interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

export interface EyeDropperConstructor {
  new (): EyeDropper;
}

declare global {
  interface Window {
    readonly EyeDropper?: EyeDropperConstructor | undefined;
  }
}

/** The color selection return type */
export interface UseEyeDropperReturn {
  /** The eye dropper supported status */
  supported: boolean;
  /** The eye dropper value */
  value?: string;
  /** The eye dropper open method */
  open: (colorSelectionOptions?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

/**
 * @name useEyeDropper
 * @description - Hook that gives you access to the eye dropper
 * @category Browser
 * @usage low
 *
 * @browserapi EyeDropper https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
 *
 * @param {string} [initialValue=undefined] The initial value for the eye dropper
 * @returns {UseEyeDropperReturn} An object containing the supported status, the value and the open method
 *
 * @example
 * const { supported, value, open } = useEyeDropper();
 */
export const useEyeDropper = (
  initialValue: string | undefined = undefined
): UseEyeDropperReturn => {
  const supported = typeof window !== 'undefined' && 'EyeDropper' in window;
  const [value, setValue] = useState(initialValue);

  const open = async (colorSelectionOptions?: ColorSelectionOptions) => {
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
