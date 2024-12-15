import { useCallback, useEffect, useState } from 'react';

import { usePermission } from '../usePermission/usePermission';

export const isPermissionAllowed = (status: PermissionState) =>
  status === 'granted' || status === 'prompt';

export const legacyCopyToClipboard = (value: string) => {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = value;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};

/** The use copy to clipboard return type */
export interface UseCopyToClipboardReturn {
  /** The copied value */
  value: string | null;
  /** Function to copy to clipboard  */
  copy: (value: string) => Promise<void>;
  /** Whether the copy to clipboard is supported */
  supported: boolean;
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
 *
 * @param {boolean} [params.enabled=false] Whether the copy to clipboard is enabled
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { supported, value, copy } = useClipboard();
 */
export const useClipboard = (params?: UseCopyToClipboardParams): UseCopyToClipboardReturn => {
  const supported = navigator && 'clipboard' in navigator;

  const [value, setValue] = useState<string | null>(null);
  const clipboardReadPermission = usePermission('clipboard-read');
  const clipboardWritePermissionWrite = usePermission('clipboard-write');

  const enabled = params?.enabled ?? false;

  const set = async () => {
    try {
      if (supported && isPermissionAllowed(clipboardReadPermission.state)) {
        const value = await navigator.clipboard.readText();
        setValue(value);
      } else setValue(document?.getSelection?.()?.toString() ?? '');
    } catch {
      setValue(document?.getSelection?.()?.toString() ?? '');
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

  const copy = useCallback(async (value: string) => {
    try {
      if (supported || isPermissionAllowed(clipboardWritePermissionWrite.state)) {
        await navigator.clipboard.writeText(value);
      } else {
        legacyCopyToClipboard(value);
      }
    } catch {
      legacyCopyToClipboard(value);
    }

    setValue(value);
  }, []);

  return { supported, value, copy };
};
