import { useEffect, useState } from 'react';

import { copy } from '@/utils/helpers';

/** The use copy to clipboard return type */
export interface UseCopyToClipboardReturn {
  /** The copied value */
  value: string | null;
  /** Function to copy to clipboard  */
  copy: (value: string) => Promise<void>;
}

/** The use copy to clipboard params type */
export interface UseCopyToClipboardParams {
  /** Whether the copy to clipboard is enabled */
  enabled: boolean;
}

/**
 * @name useClipboard
 * @description - Hook that manages a copy to clipboard
 * @category Browser
 * @usage medium

 * @browserapi navigator.clipboard https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 *
 * @param {boolean} [params.enabled=false] Whether the copy to clipboard is enabled
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { value, copy } = useClipboard();
 */
export const useClipboard = (params?: UseCopyToClipboardParams): UseCopyToClipboardReturn => {
  const [value, setValue] = useState<string | null>(null);
  const enabled = params?.enabled ?? false;

  const set = async () => {
    try {
      const value = await navigator.clipboard.readText();
      setValue(value);
    } catch {
      setValue(document.getSelection?.()?.toString() ?? '');
    }
  };

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('copy', set);
    document.addEventListener('cut', set);
    return () => {
      document.removeEventListener('copy', set);
      document.removeEventListener('cut', set);
    };
  }, [enabled]);

  const copyToClipboard = async (value: string) => {
    copy(value);
    setValue(value);
  };

  return { value, copy: copyToClipboard };
};
