import { useState } from 'react';

import { copy } from '@/utils/helpers';

/** The use copy return type */
export interface UseCopyReturn {
  /** Whether copy is in progress */
  copied: boolean;
  /** The copied value */
  value: string | null;
  /** Function to copy text */
  copy: (value: string) => Promise<void>;
}

/** The use copy params type */
export interface UseCopyParams {
  /** Reset delay in milliseconds */
  resetDelay?: number;
}

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
export const useCopy = (delay: number = 1000): UseCopyReturn => {
  const [value, setValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await copy(text);
    setValue(text);
    setCopied(true);
    setTimeout(() => setCopied(false), delay);
  };

  return { value, copied, copy: copyToClipboard };
};
