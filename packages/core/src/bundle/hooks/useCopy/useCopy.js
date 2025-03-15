import { useState } from 'react';
import { copy } from '@/utils/helpers';
/**
 * @name useCopy
 * @description - Hook that manages copying text with status reset
 * @category Browser
 *
 * @browserapi navigator.clipboard https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 *
 * @param {number} [delay=1000] Delay in ms before resetting copied status
 * @returns {UseCopyReturn} An object containing the copied value, status and copy function
 *
 * @example
 * const { copied, value, copy } = useCopy();
 */
export const useCopy = (delay = 1000) => {
  const [value, setValue] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async (text) => {
    await copy(text);
    setValue(text);
    setCopied(true);
    setTimeout(() => setCopied(false), delay);
  };
  return { value, copied, copy: copyToClipboard };
};
