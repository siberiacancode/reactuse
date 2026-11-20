import { useRef, useState } from 'react';
import { copy } from '@/utils/helpers';
/**
 * @name useCopy
 * @description - Hook that manages copying text with status reset
 * @category Browser
 * @usage medium

 * @browserapi navigator.clipboard https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 *
 * @param {number} [delay=1000] Delay in ms before resetting copied status
 * @returns {UseCopyReturn} An object containing the copied value, status and copy function
 *
 * @example
 * const { copied, value, copy } = useCopy();
 */
export const useCopy = (delay = 1000) => {
  const [value, setValue] = useState();
  const [copied, setCopied] = useState(false);
  const timeoutIdRef = useRef(undefined);
  const copyToClipboard = async (text) => {
    await copy(text);
    setValue(text);
    setCopied(true);
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(setCopied, delay, false);
  };
  return { value, copied, copy: copyToClipboard };
};
